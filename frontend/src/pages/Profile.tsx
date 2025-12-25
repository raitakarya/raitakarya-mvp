import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../api';
import PhotoUpload from '../components/PhotoUpload';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function Profile() {
  const { t } = useTranslation();
  const { user, logout, loadUser } = useAuthStore();
  const { toasts, removeToast, success } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profileImage: user?.profileImage || '',
    whatsappNumber: user?.whatsappNumber || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUploadSuccess = (url: string) => {
    setFormData({ ...formData, profileImage: url });
    setPhotoError('');
  };

  const handlePhotoUploadError = (error: string) => {
    setPhotoError(error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      await userApi.updateProfile(formData);
      await loadUser();
      setIsEditing(false);
      success('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Get location from the appropriate profile
  const getLocation = () => {
    if (user?.role === 'WORKER' && user.workerProfile) {
      return user.workerProfile.location;
    } else if (user?.role === 'FARMER' && user.farmerProfile) {
      return user.farmerProfile.farmLocation;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">Raitakarya</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              {t('common.back')}
            </button>
            <button onClick={logout} className="btn btn-secondary">
              {t('auth.logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header with Photo */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Photo */}
              <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg flex-shrink-0">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary-300 bg-primary-50">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* User Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">{user?.name}</h2>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-white bg-opacity-20 text-white rounded-full text-sm font-medium">
                    {user?.role}
                  </span>
                  {user?.isVerified && (
                    <span className="px-3 py-1 bg-green-500 bg-opacity-90 text-white rounded-full text-sm font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn bg-white text-primary-700 hover:bg-primary-50 border-0"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t('common.edit')} Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-8 py-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload Section */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
                  <PhotoUpload
                    onUploadSuccess={handlePhotoUploadSuccess}
                    onUploadError={handlePhotoUploadError}
                    currentPhoto={formData.profileImage}
                    type="profile"
                    showReasons={!formData.profileImage}
                  />
                  {photoError && (
                    <div className="mt-3 text-red-600 text-sm">{photoError}</div>
                  )}
                </div>

                {/* Basic Information */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.name')} *
                      </label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.email')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.phone')}
                      </label>
                      <input
                        type="tel"
                        value={user?.phone || ''}
                        className="input bg-gray-50"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleChange}
                        className="input"
                        placeholder="WhatsApp number (optional)"
                      />
                      <p className="text-xs text-gray-500 mt-1">For easier communication</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                  <button type="submit" disabled={isLoading} className="btn btn-primary">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      t('common.save') + ' Changes'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        profileImage: user?.profileImage || '',
                        whatsappNumber: user?.whatsappNumber || '',
                      });
                      setError('');
                      setPhotoError('');
                    }}
                    className="btn btn-secondary"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-500 font-medium">{t('auth.phone')}</label>
                      <p className="font-medium text-lg text-gray-900 mt-1">{user?.phone}</p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 font-medium">{t('auth.email')}</label>
                      <p className="font-medium text-lg text-gray-900 mt-1">{user?.email || 'Not provided'}</p>
                    </div>

                    {user?.whatsappNumber && (
                      <div>
                        <label className="text-sm text-gray-500 font-medium">WhatsApp Number</label>
                        <p className="font-medium text-lg text-gray-900 mt-1">{user.whatsappNumber}</p>
                      </div>
                    )}

                    {getLocation() && (
                      <div>
                        <label className="text-sm text-gray-500 font-medium">{t('location.village')}</label>
                        <p className="font-medium text-lg text-gray-900 mt-1">{getLocation()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Worker Profile */}
                {user?.role === 'WORKER' && user.workerProfile && (
                  <div className="border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Worker Profile</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-primary-50 rounded-lg p-4">
                        <label className="text-sm text-primary-700 font-medium">Total Jobs</label>
                        <p className="font-bold text-2xl text-primary-900 mt-1">{user.workerProfile.totalJobs}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <label className="text-sm text-green-700 font-medium">Total Earnings</label>
                        <p className="font-bold text-2xl text-green-900 mt-1">₹{user.workerProfile.totalEarnings.toLocaleString()}</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <label className="text-sm text-yellow-700 font-medium">Average Rating</label>
                        <p className="font-bold text-2xl text-yellow-900 mt-1 flex items-center gap-1">
                          {user.workerProfile.averageRating.toFixed(1)}
                          <span className="text-xl">⭐</span>
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <label className="text-sm text-blue-700 font-medium">Experience</label>
                        <p className="font-bold text-2xl text-blue-900 mt-1">{user.workerProfile.experienceYears} years</p>
                      </div>
                      {user.workerProfile.skills && user.workerProfile.skills.length > 0 && (
                        <div className="bg-purple-50 rounded-lg p-4 md:col-span-2">
                          <label className="text-sm text-purple-700 font-medium">Skills</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {user.workerProfile.skills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {user.workerProfile.languages && user.workerProfile.languages.length > 0 && (
                        <div className="bg-indigo-50 rounded-lg p-4 md:col-span-2 lg:col-span-3">
                          <label className="text-sm text-indigo-700 font-medium">Languages</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {user.workerProfile.languages.map((language, index) => (
                              <span key={index} className="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm font-medium">
                                {language}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Farmer Profile */}
                {user?.role === 'FARMER' && user.farmerProfile && (
                  <div className="border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Farmer Profile</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-primary-50 rounded-lg p-4">
                        <label className="text-sm text-primary-700 font-medium">Jobs Posted</label>
                        <p className="font-bold text-2xl text-primary-900 mt-1">{user.farmerProfile.totalJobsPosted}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <label className="text-sm text-green-700 font-medium">Total Spent</label>
                        <p className="font-bold text-2xl text-green-900 mt-1">₹{user.farmerProfile.totalSpent.toLocaleString()}</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <label className="text-sm text-yellow-700 font-medium">Average Rating</label>
                        <p className="font-bold text-2xl text-yellow-900 mt-1 flex items-center gap-1">
                          {user.farmerProfile.averageRating.toFixed(1)}
                          <span className="text-xl">⭐</span>
                        </p>
                      </div>
                      {user.farmerProfile.farmName && (
                        <div className="bg-blue-50 rounded-lg p-4 md:col-span-2">
                          <label className="text-sm text-blue-700 font-medium">Farm Name</label>
                          <p className="font-bold text-xl text-blue-900 mt-1">{user.farmerProfile.farmName}</p>
                        </div>
                      )}
                      {user.farmerProfile.farmSize && (
                        <div className="bg-purple-50 rounded-lg p-4">
                          <label className="text-sm text-purple-700 font-medium">Farm Size</label>
                          <p className="font-bold text-2xl text-purple-900 mt-1">{user.farmerProfile.farmSize} acres</p>
                        </div>
                      )}
                      {user.farmerProfile.cropTypes && user.farmerProfile.cropTypes.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-4 md:col-span-2 lg:col-span-3">
                          <label className="text-sm text-green-700 font-medium">Crop Types</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {user.farmerProfile.cropTypes.map((crop, index) => (
                              <span key={index} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-500 font-medium">Member Since</label>
                      <p className="font-medium text-lg text-gray-900 mt-1">
                        {new Date(user?.createdAt || '').toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 font-medium">Last Updated</label>
                      <p className="font-medium text-lg text-gray-900 mt-1">
                        {new Date(user?.updatedAt || '').toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

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
