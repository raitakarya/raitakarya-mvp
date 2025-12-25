import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import LanguageSwitcher from '../components/LanguageSwitcher';
import PhotoUpload from '../components/PhotoUpload';
import LocationDetector from '../components/LocationDetector';
import type { LocationData } from '../hooks/useGeolocation';

export default function EnhancedSignup() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    email: '',
    password: '',
    whatsappNumber: '',
    usePhoneForWhatsapp: true,
    role: 'WORKER' as 'WORKER' | 'FARMER',
    profileImage: '',
    location: '',
    latitude: null as number | null,
    longitude: null as number | null,
    acceptedTerms: false
  });
  const { signup, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Auto-set WhatsApp to phone if checkbox is checked
    if (name === 'usePhoneForWhatsapp' && checked) {
      setFormData(prev => ({ ...prev, whatsappNumber: prev.phone }));
    }
  };

  const handlePhotoUpload = (url: string) => {
    setFormData({ ...formData, profileImage: url });
  };

  const handleLocationDetected = (location: LocationData) => {
    setFormData({
      ...formData,
      location: location.locationName,
      latitude: location.latitude,
      longitude: location.longitude
    });
  };

  const handleNext = () => {
    clearError();

    // Validation for each step
    if (step === 1) {
      if (!formData.phone || !formData.name || !formData.password || !formData.role) {
        return;
      }
    }

    if (step === 2 && formData.role === 'WORKER' && !formData.profileImage) {
      alert(t('photo.required'));
      return;
    }

    if (step === 3 && !formData.location) {
      alert(t('location.required'));
      return;
    }

    if (step === 4 && !formData.acceptedTerms) {
      alert(t('terms.mustAccept'));
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    clearError();
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!formData.acceptedTerms) {
      alert(t('terms.mustAccept'));
      return;
    }

    try {
      const signupData = {
        ...formData,
        whatsappNumber: formData.usePhoneForWhatsapp ? formData.phone : formData.whatsappNumber
      };

      await signup(signupData);
      navigate('/');
    } catch (err) {
      // Error handled in store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1"></div>
            <h1 className="text-3xl font-bold text-primary-700 flex-1 text-center">Raitakarya</h1>
            <div className="flex-1 flex justify-end">
              <LanguageSwitcher />
            </div>
          </div>
          <p className="text-gray-600 mt-2">{t('auth.joinCommunity')}</p>

          {/* Progress Bar */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {t('common.step')} {step} {t('common.of')} 4
          </p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-6">
            {step === 1 && t('auth.basicInfo')}
            {step === 2 && t('photo.uploadPhoto')}
            {step === 3 && t('location.detectLocation')}
            {step === 4 && t('terms.reviewTerms')}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    placeholder={t('auth.namePlaceholder')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                    placeholder={t('auth.phonePlaceholder')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    placeholder={t('auth.emailPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.password')}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input"
                    placeholder={t('auth.createPassword')}
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.iAm')}
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="WORKER">{t('auth.worker')}</option>
                    <option value="FARMER">{t('auth.farmer')}</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="usePhoneForWhatsapp"
                    name="usePhoneForWhatsapp"
                    checked={formData.usePhoneForWhatsapp}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="usePhoneForWhatsapp" className="text-sm text-gray-700">
                    {t('auth.usePhoneForWhatsapp')}
                  </label>
                </div>

                {!formData.usePhoneForWhatsapp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('auth.whatsappNumber')}
                    </label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      className="input"
                      placeholder={t('auth.whatsappPlaceholder')}
                    />
                  </div>
                )}
              </>
            )}

            {/* Step 2: Photo Upload */}
            {step === 2 && (
              <div>
                <PhotoUpload
                  onUploadSuccess={handlePhotoUpload}
                  currentPhoto={formData.profileImage}
                  type="profile"
                  showReasons={formData.role === 'WORKER'}
                />
                {formData.role === 'FARMER' && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    {t('photo.optionalForFarmers')}
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Location Detection */}
            {step === 3 && (
              <div>
                <LocationDetector
                  onLocationDetected={handleLocationDetected}
                  autoDetect={false}
                />
                {formData.location && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ {t('location.saved')}: <strong>{formData.location}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Terms & Conditions */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 max-h-64 overflow-y-auto">
                  <h3 className="font-semibold mb-2">{t('terms.summary')}</h3>
                  <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                    <li>{t('terms.point1')}</li>
                    <li>{t('terms.point2')}</li>
                    <li>{t('terms.point3')}</li>
                    <li>{t('terms.point4')}</li>
                  </ul>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptedTerms"
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                    className="mt-1 rounded border-gray-300"
                    required
                  />
                  <label htmlFor="acceptedTerms" className="text-sm text-gray-700">
                    {t('terms.iAccept')}{' '}
                    <Link to="/terms" target="_blank" className="text-primary-600 hover:underline">
                      {t('terms.termsAndConditions')}
                    </Link>
                    {' '}{t('common.and')}{' '}
                    <Link to="/privacy" target="_blank" className="text-primary-600 hover:underline">
                      {t('terms.privacyPolicy')}
                    </Link>
                  </label>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">{t('common.summary')}</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>{t('auth.name')}:</strong> {formData.name}</p>
                    <p><strong>{t('auth.phone')}:</strong> {formData.phone}</p>
                    <p><strong>{t('auth.role')}:</strong> {formData.role}</p>
                    <p><strong>{t('location.location')}:</strong> {formData.location || t('common.notSet')}</p>
                    <p><strong>{t('photo.photo')}:</strong> {formData.profileImage ? t('common.uploaded') : t('common.notUploaded')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 btn btn-secondary"
                >
                  {t('common.back')}
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 btn btn-primary"
                >
                  {t('common.next')}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !formData.acceptedTerms}
                  className="flex-1 btn btn-primary"
                >
                  {isLoading ? t('auth.creatingAccount') : t('auth.signup')}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('auth.haveAccount')}{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            ← {t('common.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
