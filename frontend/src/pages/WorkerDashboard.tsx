import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { jobApi, applicationApi } from '../api';
import { Job, Application } from '../types';
import { calculateDistance } from '../utils/distance';
import RatingModal from '../components/RatingModal';
import Toast from '../components/Toast';
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
          <div className="mb-6 flex items-center gap-4 flex-wrap">
            <label className="text-sm font-medium text-gray-700">
              Filter by Distance:
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setDistanceFilter(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  distanceFilter === null
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Jobs
              </button>
              <button
                onClick={() => setDistanceFilter(10)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  distanceFilter === 10
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Within 10km
              </button>
              <button
                onClick={() => setDistanceFilter(50)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  distanceFilter === 50
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Within 50km
              </button>
              <button
                onClick={() => setDistanceFilter(100)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  distanceFilter === 100
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Within 100km
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
              <div className="card text-center py-12">
                <p className="text-gray-500">
                  {distanceFilter
                    ? `No jobs found within ${distanceFilter}km. Try increasing the distance filter.`
                    : 'No jobs available at the moment.'}
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
              <div className="card text-center py-12">
                <p className="text-gray-500">You haven't applied to any jobs yet.</p>
              </div>
            )}

            {activeTab === 'applications' && applications.map((app) => (
              <div key={app.id} className="card">
                <div className="flex justify-between items-start flex-col gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h3 className="text-xl font-semibold text-gray-900">{app.job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        app.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{app.job.description}</p>
                    <div className="mt-4 flex items-center gap-6 flex-wrap">
                      <div>
                        <span className="text-sm text-gray-500">Applied on</span>
                        <p className="font-medium">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">{t('jobPosting.wagePerDay')}</span>
                        <p className="font-medium text-accent-600">₹{app.job.wagePerDay}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">{t('jobPosting.duration')}</span>
                        <p className="font-medium">{app.job.duration} days</p>
                      </div>
                      {app.payment && (
                        <div>
                          <span className="text-sm text-gray-500">Payment Status</span>
                          <p className="font-medium text-accent-600">{app.payment.status}</p>
                        </div>
                      )}
                    </div>

                    {/* Farmer contact info for accepted/completed applications */}
                    {(app.status === 'ACCEPTED' || app.status === 'COMPLETED') && app.job.farmer && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            {app.job.farmer.profileImage ? (
                              <img
                                src={app.job.farmer.profileImage}
                                alt={app.job.farmer.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{app.job.farmer.name}</p>
                              <p className="text-xs text-gray-500">Farmer</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <WhatsAppButton
                              phoneNumber={app.job.farmer.phone}
                              message={`Hello ${app.job.farmer.name}, regarding the job: ${app.job.title}`}
                              size="sm"
                            />
                            {app.status === 'COMPLETED' && (
                              <button
                                onClick={() => openRatingModal(app.job.farmerId, app.job.farmer.name)}
                                className="btn btn-secondary text-sm px-3 py-1"
                              >
                                Rate Farmer
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
