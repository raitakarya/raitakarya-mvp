import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">Raitakarya</h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/login" className="btn btn-secondary">
              {t('auth.login')}
            </Link>
            <Link to="/signup" className="btn btn-primary">
              {t('auth.signup')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/signup" className="btn btn-primary text-lg px-8 py-3">
              {t('hero.getStarted')}
            </Link>
            <Link to="/login" className="btn btn-accent text-lg px-8 py-3">
              {t('hero.findJobs')}
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">🌾</div>
            <h3 className="text-xl font-semibold mb-2">{t('features.forFarmers.title')}</h3>
            <p className="text-gray-600">
              {t('features.forFarmers.description')}
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">👨‍🌾</div>
            <h3 className="text-xl font-semibold mb-2">{t('features.forWorkers.title')}</h3>
            <p className="text-gray-600">
              {t('features.forWorkers.description')}
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">{t('features.securePayments.title')}</h3>
            <p className="text-gray-600">
              {t('features.securePayments.description')}
            </p>
          </div>
        </div>

        {/* Starting Out Banner */}
        <div className="mt-24 bg-white rounded-2xl shadow-lg p-12 border-2 border-primary-200">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('impact.startingOut')}</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('impact.helpUsGrow')}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-24 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
