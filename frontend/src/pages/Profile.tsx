import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../api';

export default function Profile() {
  const { user, logout, loadUser } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      await userApi.updateProfile(formData);
      await loadUser();
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Profile Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Profile</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={isLoading} className="btn btn-primary">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user?.name || '', email: user?.email || '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium text-lg">{user?.name}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="font-medium text-lg">{user?.phone}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium text-lg">{user?.email || 'Not provided'}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Role</label>
                <p className="font-medium text-lg">{user?.role}</p>
              </div>

              {user?.role === 'WORKER' && user.workerProfile && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-4">Worker Profile</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Total Jobs</label>
                      <p className="font-medium">{user.workerProfile.totalJobs}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Total Earnings</label>
                      <p className="font-medium">₹{user.workerProfile.totalEarnings.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Average Rating</label>
                      <p className="font-medium">{user.workerProfile.averageRating.toFixed(1)} ⭐</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Experience</label>
                      <p className="font-medium">{user.workerProfile.experienceYears} years</p>
                    </div>
                  </div>
                </div>
              )}

              {user?.role === 'FARMER' && user.farmerProfile && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-4">Farmer Profile</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Jobs Posted</label>
                      <p className="font-medium">{user.farmerProfile.totalJobsPosted}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Total Spent</label>
                      <p className="font-medium">₹{user.farmerProfile.totalSpent.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Average Rating</label>
                      <p className="font-medium">{user.farmerProfile.averageRating.toFixed(1)} ⭐</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Farm Name</label>
                      <p className="font-medium">{user.farmerProfile.farmName || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
