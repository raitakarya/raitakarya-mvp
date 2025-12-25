import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { jobApi, applicationApi, paymentApi } from '../api';
import { Job } from '../types';
import PhotoUpload from '../components/PhotoUpload';
import LocationDetector from '../components/LocationDetector';
import WhatsAppButton from '../components/WhatsAppButton';
import RatingModal from '../components/RatingModal';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function FarmerDashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { toasts, removeToast, success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState<'jobs' | 'create'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobPhotos, setJobPhotos] = useState<string[]>([]);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: '',
    location: '',
    latitude: null as number | null,
    longitude: null as number | null,
    wagePerDay: '',
    duration: '',
    workersNeeded: '',
    requiredSkills: '',
    startDate: '',
  });

  useEffect(() => {
    if (activeTab === 'jobs') {
      loadJobs();
    }
  }, [activeTab]);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const data = await jobApi.getMyJobs();
      setJobs(data.jobs || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (url: string) => {
    if (jobPhotos.length < 3) {
      setJobPhotos([...jobPhotos, url]);
    }
  };

  const removePhoto = (index: number) => {
    setJobPhotos(jobPhotos.filter((_, i) => i !== index));
  };

  const handleLocationDetected = (location: { latitude: number; longitude: number; locationName: string }) => {
    setFormData({
      ...formData,
      location: location.locationName,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        latitude: formData.latitude ?? undefined,
        longitude: formData.longitude ?? undefined,
        wagePerDay: parseFloat(formData.wagePerDay),
        duration: parseInt(formData.duration),
        workersNeeded: parseInt(formData.workersNeeded),
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        photos: jobPhotos,
      };
      await jobApi.createJob(jobData);
      success(t('common.success') || 'Job created successfully!');
      setFormData({
        title: '',
        description: '',
        jobType: '',
        location: '',
        latitude: null,
        longitude: null,
        wagePerDay: '',
        duration: '',
        workersNeeded: '',
        requiredSkills: '',
        startDate: '',
      });
      setJobPhotos([]);
      setActiveTab('jobs');
      loadJobs();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to create job');
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      await applicationApi.updateApplicationStatus(applicationId, status);
      success('Application status updated!');
      loadJobs();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleInitiatePayment = async (applicationId: string, amount: number) => {
    try {
      await paymentApi.createPayment({ applicationId, amount });
      success('Payment initiated successfully!');
      loadJobs();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to initiate payment');
    }
  };

  const openRatingModal = (workerId: string, workerName: string) => {
    setSelectedWorker({ id: workerId, name: workerName });
    setRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
    setSelectedWorker(null);
  };

  const handleRatingSuccess = () => {
    loadJobs();
  };

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
            <h3 className="text-sm font-medium text-gray-500">Total Jobs Posted</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">
              {user?.farmerProfile?.totalJobsPosted || 0}
            </p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
            <p className="text-3xl font-bold text-accent-600 mt-2">
              ₹{user?.farmerProfile?.totalSpent?.toLocaleString() || 0}
            </p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {user?.farmerProfile?.averageRating?.toFixed(1) || 0} ⭐
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'jobs'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('dashboard.myJobs')}
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('dashboard.postNewJob')}
              </button>
            </nav>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Photos ({t('common.optional')}) - Up to 3 photos
                </label>
                <div className="space-y-4">
                  {jobPhotos.length < 3 && (
                    <PhotoUpload
                      onUploadSuccess={handlePhotoUpload}
                      type="job"
                      showReasons={false}
                    />
                  )}
                  {jobPhotos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {jobPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Job photo ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobPosting.title')}</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobPosting.jobType')}</label>
                  <input type="text" name="jobType" value={formData.jobType} onChange={handleChange} className="input" placeholder="e.g., Harvesting" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobPosting.description')}</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="input" rows={4} required />
              </div>

              {/* Location Detector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('jobPosting.location')}</label>
                <LocationDetector
                  onLocationDetected={handleLocationDetected}
                  autoDetect={false}
                />
                {formData.location && (
                  <div className="mt-3">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="input"
                      placeholder="Edit location name if needed"
                    />
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobPosting.wagePerDay')}</label>
                  <input type="number" name="wagePerDay" value={formData.wagePerDay} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobPosting.duration')}</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="input" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobPosting.workersNeeded')}</label>
                  <input type="number" name="workersNeeded" value={formData.workersNeeded} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobPosting.startDate')}</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="input" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobPosting.requiredSkills')} (comma-separated)</label>
                <input type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} className="input" placeholder="e.g., Plowing, Harvesting" />
              </div>

              <button type="submit" className="btn btn-primary">{t('jobPosting.postJob')}</button>
            </form>
          </div>
        )}

        {activeTab === 'jobs' && (
          isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('common.loading')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.length === 0 && (
                <div className="card text-center py-12">
                  <p className="text-gray-500">You haven't posted any jobs yet.</p>
                </div>
              )}

              {jobs.map((job) => (
                <div key={job.id} className="card">
                  {/* Job Photos */}
                  {job.photos && job.photos.length > 0 && (
                    <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {job.photos.map((photo: string, index: number) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`${job.title} photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600 mt-1">{job.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                      job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      job.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">{t('jobPosting.wagePerDay')}</span>
                      <p className="font-medium text-accent-600">₹{job.wagePerDay}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{t('jobPosting.duration')}</span>
                      <p className="font-medium">{job.duration} days</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{t('jobPosting.workersNeeded')}</span>
                      <p className="font-medium">{job.workersNeeded}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Applications</span>
                      <p className="font-medium">{job.applications?.length || 0}</p>
                    </div>
                  </div>

                  {job.applications && job.applications.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Applications</h4>
                      <div className="space-y-3">
                        {job.applications.map((app) => (
                          <div key={app.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start flex-col md:flex-row gap-3">
                              <div className="flex items-center gap-3 flex-1">
                                {app.worker.profileImage ? (
                                  <img
                                    src={app.worker.profileImage}
                                    alt={app.worker.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{app.worker.name}</p>
                                  <p className="text-sm text-gray-500">{app.worker.phone}</p>
                                  {app.worker.workerProfile && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-gray-500">
                                        {app.worker.workerProfile.experienceYears} years exp
                                      </span>
                                      <span className="text-xs text-yellow-600">
                                        ⭐ {app.worker.workerProfile.averageRating?.toFixed(1) || 0}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                  app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                  app.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {app.status}
                                </span>

                                {app.status === 'PENDING' && (
                                  <>
                                    <WhatsAppButton
                                      phoneNumber={app.worker.phone}
                                      message={`Hello ${app.worker.name}, regarding your application for: ${job.title}`}
                                      size="sm"
                                    />
                                    <button
                                      onClick={() => handleUpdateApplicationStatus(app.id, 'ACCEPTED')}
                                      className="btn btn-primary text-sm px-3 py-1"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => handleUpdateApplicationStatus(app.id, 'REJECTED')}
                                      className="btn btn-secondary text-sm px-3 py-1"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}

                                {app.status === 'ACCEPTED' && (
                                  <>
                                    <WhatsAppButton
                                      phoneNumber={app.worker.phone}
                                      message={`Hello ${app.worker.name}, regarding the job: ${job.title}`}
                                      size="sm"
                                    />
                                    {!app.payment && (
                                      <button
                                        onClick={() => handleInitiatePayment(app.id, job.wagePerDay * job.duration)}
                                        className="btn btn-primary text-sm px-3 py-1"
                                      >
                                        Initiate Payment
                                      </button>
                                    )}
                                    {app.payment && (
                                      <span className="text-sm text-gray-600">
                                        Payment: {app.payment.status}
                                      </span>
                                    )}
                                  </>
                                )}

                                {app.status === 'COMPLETED' && (
                                  <>
                                    <WhatsAppButton
                                      phoneNumber={app.worker.phone}
                                      message={`Hello ${app.worker.name}, thank you for completing the job: ${job.title}`}
                                      size="sm"
                                    />
                                    <button
                                      onClick={() => openRatingModal(app.workerId, app.worker.name)}
                                      className="btn btn-secondary text-sm px-3 py-1"
                                    >
                                      Rate Worker
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </main>

      {/* Rating Modal */}
      {ratingModalOpen && selectedWorker && (
        <RatingModal
          revieweeId={selectedWorker.id}
          revieweeName={selectedWorker.name}
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
