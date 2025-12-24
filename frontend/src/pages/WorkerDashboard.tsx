import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { jobApi, applicationApi } from '../api';
import { Job, Application } from '../types';

export default function WorkerDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'available' | 'applications'>('available');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleApply = async (jobId: string) => {
    try {
      await applicationApi.createApplication({ jobId });
      alert('Application submitted successfully!');
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to apply');
    }
  };

  const hasApplied = (jobId: string) => {
    return applications.some(app => app.jobId === jobId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">Raitakarya</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}!</span>
            <Link to="/profile" className="btn btn-secondary">
              Profile
            </Link>
            <button onClick={logout} className="btn btn-secondary">
              Logout
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
                Available Jobs
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Applications
              </button>
            </nav>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'available' && jobs.length === 0 && (
              <div className="card text-center py-12">
                <p className="text-gray-500">No jobs available at the moment.</p>
              </div>
            )}

            {activeTab === 'available' && jobs.map((job) => (
              <div key={job.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600 mt-1">{job.description}</p>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Location</span>
                        <p className="font-medium">{job.location}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Wage/Day</span>
                        <p className="font-medium text-accent-600">₹{job.wagePerDay}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Duration</span>
                        <p className="font-medium">{job.duration} days</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Workers Needed</span>
                        <p className="font-medium">{job.workersNeeded}</p>
                      </div>
                    </div>
                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <div className="mt-4">
                        <span className="text-sm text-gray-500">Required Skills:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {job.requiredSkills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={hasApplied(job.id)}
                    className={`ml-4 btn ${hasApplied(job.id) ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {hasApplied(job.id) ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </div>
            ))}

            {activeTab === 'applications' && applications.length === 0 && (
              <div className="card text-center py-12">
                <p className="text-gray-500">You haven't applied to any jobs yet.</p>
              </div>
            )}

            {activeTab === 'applications' && applications.map((app) => (
              <div key={app.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{app.job.title}</h3>
                    <p className="text-gray-600 mt-1">{app.job.description}</p>
                    <div className="mt-4 flex items-center gap-6">
                      <div>
                        <span className="text-sm text-gray-500">Status</span>
                        <p className={`font-medium ${
                          app.status === 'ACCEPTED' ? 'text-green-600' :
                          app.status === 'REJECTED' ? 'text-red-600' :
                          app.status === 'COMPLETED' ? 'text-blue-600' :
                          'text-yellow-600'
                        }`}>
                          {app.status}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Applied on</span>
                        <p className="font-medium">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      {app.payment && (
                        <div>
                          <span className="text-sm text-gray-500">Payment Status</span>
                          <p className="font-medium text-accent-600">{app.payment.status}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
