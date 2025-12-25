import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { jobApi, applicationApi } from '../api';
import { Job, Application } from '../types';
import { calculateDistance } from '../utils/distance';
import RatingModal from '../components/RatingModal';
import Toast from '../components/Toast';
import WhatsAppButton from '../components/WhatsAppButton';
import { useToast } from '../hooks/useToast';
import { SkeletonJobCard, SkeletonApplicationCard } from '../components/SkeletonLoader';
import ModernJobCard from '../components/ModernJobCard';

export default function WorkerDashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { toasts, removeToast, success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState<'available' | 'applications'>('available');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      if (activeTab === 'available') {
        const data = await jobApi.getJobs({ status: 'OPEN' });
        setJobs(data.jobs || []);
      } else {
        const data = await applicationApi.getMyApplications();
        setApplications(data.applications || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const [optimisticApplications, setOptimisticApplications] = useState<Set<string>>(new Set());

  const handleApply = async (jobId: string) => {
    // OPTIMISTIC UI - Update UI immediately for instant feedback!
    setOptimisticApplications(prev => new Set(prev).add(jobId));
    success('Application submitted!');

    try {
      await applicationApi.createApplication({ jobId });
      // Refresh to get real data
      loadData();
    } catch (err: any) {
      // Revert optimistic update on error
      setOptimisticApplications(prev => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
      showError(err.response?.data?.error || 'Failed to apply. Please try again.');
    }
  };

  const hasApplied = (jobId: string) => {
    return applications.some(app => app.jobId === jobId) || optimisticApplications.has(jobId);
  };

  const openRatingModal = (farmerId: string, farmerName: string) => {
    setSelectedFarmer({ id: farmerId, name: farmerName });
    setRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
    setSelectedFarmer(null);
  };

  const handleRatingSuccess = () => {
    loadData();
  };

  // Get worker's location
  const workerLatitude = user?.workerProfile?.latitude;
  const workerLongitude = user?.workerProfile?.longitude;

  // Calculate and sort jobs by distance
  const jobsWithDistance = useMemo(() => {
    if (!workerLatitude || !workerLongitude) {
      return jobs.map(job => ({ ...job, distance: null }));
    }

    return jobs.map(job => {
      if (job.latitude && job.longitude) {
        const distance = calculateDistance(
          workerLatitude,
          workerLongitude,
          job.latitude,
          job.longitude
        );
        return { ...job, distance };
      }
      return { ...job, distance: null };
    });
  }, [jobs, workerLatitude, workerLongitude]);

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobsWithDistance;

    // Apply distance filter
    if (distanceFilter !== null) {
      filtered = filtered.filter(job =>
        job.distance !== null && job.distance <= distanceFilter
      );
    }

    // Sort by distance (nearest first), jobs without distance at the end
    return filtered.sort((a, b) => {
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  }, [jobsWithDistance, distanceFilter]);

  // Filter applications by status
  const filteredApplications = useMemo(() => {
    if (!statusFilter) return applications;
    return applications.filter(app => app.status === statusFilter);
  }, [applications, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">Raitakarya</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 hidden sm:inline">
              {t('dashboard.welcomeBack')}, {user?.name}!
            </span>
            <Link to="/profile" className="btn btn-secondary">
              {t('dashboard.profile')}
            </Link>
            <button onClick={logout} className="btn btn-secondary">
              {t('auth.logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Total Jobs Completed</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">
              {user?.workerProfile?.totalJobs || 0}
            </p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
            <p className="text-3xl font-bold text-accent-600 mt-2">
              ₹{user?.workerProfile?.totalEarnings?.toLocaleString() || 0}
            </p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {user?.workerProfile?.averageRating?.toFixed(1) || 0} ⭐
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('available')}
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'available'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('dashboard.availableJobs')}
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('dashboard.myApplications')}
              </button>
            </nav>
          </div>
        </div>

        {/* Distance Filter (only for available jobs) */}
        {activeTab === 'available' && workerLatitude && workerLongitude && (
          <div className="mb-6 bg-white rounded-2xl p-5 shadow-md border-2 border-gray-100">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block">
              Filter by Distance
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setDistanceFilter(null)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  distanceFilter === null
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Jobs
              </button>
              <button
                onClick={() => setDistanceFilter(10)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  distanceFilter === 10
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Within 10km
              </button>
              <button
                onClick={() => setDistanceFilter(50)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  distanceFilter === 50
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Within 50km
              </button>
              <button
                onClick={() => setDistanceFilter(100)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  distanceFilter === 100
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Within 100km
              </button>
            </div>
          </div>
        )}

        {/* Status Filter (only for applications tab) */}
        {activeTab === 'applications' && applications.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl p-5 shadow-md border-2 border-gray-100">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block">
              Filter by Status
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter(null)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  statusFilter === null
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({applications.length})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  statusFilter === 'PENDING'
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({applications.filter(a => a.status === 'PENDING').length})
              </button>
              <button
                onClick={() => setStatusFilter('ACCEPTED')}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  statusFilter === 'ACCEPTED'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Accepted ({applications.filter(a => a.status === 'ACCEPTED').length})
              </button>
              <button
                onClick={() => setStatusFilter('COMPLETED')}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  statusFilter === 'COMPLETED'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed ({applications.filter(a => a.status === 'COMPLETED').length})
              </button>
              <button
                onClick={() => setStatusFilter('REJECTED')}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  statusFilter === 'REJECTED'
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected ({applications.filter(a => a.status === 'REJECTED').length})
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {activeTab === 'available' ? (
              <>
                <SkeletonJobCard />
                <SkeletonJobCard />
                <SkeletonJobCard />
              </>
            ) : (
              <>
                <SkeletonApplicationCard />
                <SkeletonApplicationCard />
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'available' && filteredAndSortedJobs.length === 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-16 text-center border-2 border-dashed border-gray-300">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-700 mb-2">No Jobs Found</h3>
                <p className="text-gray-500 text-lg">
                  {distanceFilter
                    ? `No jobs found within ${distanceFilter}km. Try increasing the distance filter.`
                    : 'No jobs available at the moment. Check back soon!'}
                </p>
              </div>
            )}

            {activeTab === 'available' && filteredAndSortedJobs.map((job) => (
              <ModernJobCard
                key={job.id}
                job={job}
                onApply={handleApply}
                hasApplied={hasApplied(job.id)}
                userRole="WORKER"
                showActions={true}
              />
            ))}

            {activeTab === 'applications' && applications.length === 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-16 text-center border-2 border-dashed border-blue-300">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-blue-700 mb-2">No Applications Yet</h3>
                <p className="text-blue-600 text-lg mb-6">Start applying to jobs to see your applications here!</p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Browse Available Jobs
                </button>
              </div>
            )}

            {activeTab === 'applications' && filteredApplications.length === 0 && applications.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-16 text-center border-2 border-dashed border-gray-300">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-700 mb-2">No {statusFilter} Applications</h3>
                <p className="text-gray-500 text-lg">Try selecting a different status filter.</p>
              </div>
            )}

            {activeTab === 'applications' && filteredApplications.map((app) => (
              <div key={app.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-200 p-7">
                <div className="flex justify-between items-start flex-col gap-5">
                  <div className="flex-1 w-full">
                    {/* Header with Status */}
                    <div className="flex justify-between items-start flex-wrap gap-3 mb-4">
                      <h3 className="text-2xl font-black text-gray-900">{app.job.title}</h3>
                      <span className={`px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg ${
                        app.status === 'ACCEPTED' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                        app.status === 'REJECTED' ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white' :
                        app.status === 'COMPLETED' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                        'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <p className="text-gray-600 text-base leading-relaxed mb-5">{app.job.description}</p>

                    {/* Details Grid - Beautiful Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Applied on</span>
                        <p className="font-black text-gray-900 text-lg mt-1">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                        <span className="text-xs text-green-600 font-bold uppercase tracking-wide">Daily Wage</span>
                        <p className="font-black text-green-700 text-xl mt-1">₹{app.job.wagePerDay.toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
                        <span className="text-xs text-blue-600 font-bold uppercase tracking-wide">Duration</span>
                        <p className="font-black text-blue-700 text-xl mt-1">{app.job.duration} days</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200">
                        <span className="text-xs text-orange-600 font-bold uppercase tracking-wide">Total Pay</span>
                        <p className="font-black text-orange-700 text-xl mt-1">₹{(app.job.wagePerDay * app.job.duration).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Payment Status if exists */}
                    {app.payment && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm text-purple-600 font-bold uppercase tracking-wide">Payment Status</span>
                            <p className="font-black text-purple-900 text-lg">{app.payment.status}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Farmer contact info - PREMIUM */}
                    {(app.status === 'ACCEPTED' || app.status === 'COMPLETED') && app.job.farmer && (
                      <div className="pt-5 border-t-2 border-gray-100">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4">
                            {app.job.farmer.profileImage ? (
                              <div className="relative">
                                <img
                                  src={app.job.farmer.profileImage}
                                  alt={app.job.farmer.name}
                                  className="w-14 h-14 rounded-2xl object-cover shadow-lg border-3 border-white"
                                />
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                              </div>
                            ) : (
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                                <span className="text-white text-2xl font-bold">
                                  {app.job.farmer.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="text-lg font-black text-gray-900">{app.job.farmer.name}</p>
                              <p className="text-sm text-gray-500 font-medium">Farmer • Hiring</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <WhatsAppButton
                              phoneNumber={app.job.farmer.phone}
                              message={`Hello ${app.job.farmer.name}, regarding the job: ${app.job.title}`}
                              size="md"
                            />
                            {app.status === 'COMPLETED' && (
                              <button
                                onClick={() => openRatingModal(app.job.farmerId, app.job.farmer.name)}
                                className="px-5 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-2xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                              >
                                ⭐ Rate Farmer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Rating Modal */}
      {ratingModalOpen && selectedFarmer && (
        <RatingModal
          revieweeId={selectedFarmer.id}
          revieweeName={selectedFarmer.name}
          onClose={closeRatingModal}
          onSuccess={handleRatingSuccess}
        />
      )}

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
