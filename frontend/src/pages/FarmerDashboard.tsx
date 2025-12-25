import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { jobApi, applicationApi } from '../api';
import { Job } from '../types';

export default function FarmerDashboard() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'jobs' | 'create'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: '',
    location: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        wagePerDay: parseFloat(formData.wagePerDay),
        duration: parseInt(formData.duration),
        workersNeeded: parseInt(formData.workersNeeded),
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      };
      await jobApi.createJob(jobData);
      alert('Job created successfully!');
      setFormData({
        title: '',
        description: '',
        jobType: '',
        location: '',
        wagePerDay: '',
        duration: '',
        workersNeeded: '',
        requiredSkills: '',
        startDate: '',
      });
      setActiveTab('jobs');
      loadJobs();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create job');
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      await applicationApi.updateApplicationStatus(applicationId, status);
      alert('Application status updated!');
      loadJobs();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
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
                My Jobs
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Post New Job
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <input type="text" name="jobType" value={formData.jobType} onChange={handleChange} className="input" placeholder="e.g., Harvesting" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="input" rows={4} required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wage per Day (₹)</label>
                  <input type="number" name="wagePerDay" value={formData.wagePerDay} onChange={handleChange} className="input" required />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Workers Needed</label>
                  <input type="number" name="workersNeeded" value={formData.workersNeeded} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="input" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma-separated)</label>
                <input type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} className="input" placeholder="e.g., Plowing, Harvesting" />
              </div>

              <button type="submit" className="btn btn-primary">Post Job</button>
            </form>
          </div>
        )}

        {activeTab === 'jobs' && (
          isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
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
                  <div className="flex justify-between items-start mb-4">
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
                    <div>
                      <span className="text-sm text-gray-500">Applications</span>
                      <p className="font-medium">{job.applications?.length || 0}</p>
                    </div>
                  </div>

                  {job.applications && job.applications.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Applications</h4>
                      <div className="space-y-2">
                        {job.applications.map((app) => (
                          <div key={app.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                            <div>
                              <p className="font-medium">{app.worker.name}</p>
                              <p className="text-sm text-gray-500">{app.worker.phone}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-sm ${
                                app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {app.status}
                              </span>
                              {app.status === 'PENDING' && (
                                <>
                                  <button onClick={() => handleUpdateApplicationStatus(app.id, 'ACCEPTED')} className="btn btn-primary text-sm px-3 py-1">
                                    Accept
                                  </button>
                                  <button onClick={() => handleUpdateApplicationStatus(app.id, 'REJECTED')} className="btn btn-secondary text-sm px-3 py-1">
                                    Reject
                                  </button>
                                </>
                              )}
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
    </div>
  );
}
