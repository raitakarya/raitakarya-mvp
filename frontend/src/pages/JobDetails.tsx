import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { jobApi } from '../api';
import { Job } from '../types';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      setIsLoading(true);
      if (id) {
        const data = await jobApi.getJobById(id);
        setJob(data.job);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load job');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Job not found'}</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">Raitakarya</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              Back
            </button>
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Job Details */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h2>
          <p className="text-gray-600 mb-6">{job.description}</p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Job Details</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Location</dt>
                  <dd className="font-medium">{job.location}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Job Type</dt>
                  <dd className="font-medium">{job.jobType}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Status</dt>
                  <dd className="font-medium">{job.status}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Compensation & Duration</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Wage per Day</dt>
                  <dd className="font-medium text-accent-600">₹{job.wagePerDay}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Duration</dt>
                  <dd className="font-medium">{job.duration} days</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Workers Needed</dt>
                  <dd className="font-medium">{job.workersNeeded}</dd>
                </div>
              </dl>
            </div>
          </div>

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Posted by</h3>
            <p className="font-medium">{job.farmer.name}</p>
            <p className="text-sm text-gray-500">{job.farmer.phone}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
