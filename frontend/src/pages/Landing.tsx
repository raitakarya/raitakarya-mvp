import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Modern Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🌾</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Raitakarya
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              {t('auth.login')}
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              {t('auth.signup')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - STUNNING! */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-8 animate-bounce">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Connecting Agriculture, Empowering Lives
          </div>

          {/* Main Heading */}
          <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Find Farm Work.
            <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Build Your Future.
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            India's first digital platform connecting agricultural workers with farmers.
            <span className="font-semibold text-gray-900"> Fair wages. Verified jobs. Instant payments.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              to="/signup"
              className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Get Started Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-300"
            >
              Find Jobs Now
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-gray-600 font-medium">Active Workers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                200+
              </div>
              <div className="text-gray-600 font-medium">Verified Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                ₹10L+
              </div>
              <div className="text-gray-600 font-medium">Paid Out</div>
            </div>
          </div>
        </div>

        {/* Features - Modern Cards */}
        <div className="py-20">
          <h3 className="text-4xl font-black text-center mb-4 text-gray-900">
            Why Raitakarya?
          </h3>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Built for India's agricultural community
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-100 hover:border-green-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-3xl">🌾</span>
              </div>
              <h4 className="text-2xl font-bold mb-3 text-gray-900">For Farmers</h4>
              <p className="text-gray-600 leading-relaxed">
                Post jobs in 60 seconds. Get verified workers. See distance, ratings, experience at a glance.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border-2 border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-3xl">👨‍🌾</span>
              </div>
              <h4 className="text-2xl font-bold mb-3 text-gray-900">For Workers</h4>
              <p className="text-gray-600 leading-relaxed">
                One-tap apply. See jobs near you (2.3 km!). Fair wages. Get paid on time, every time.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-3xl">💰</span>
              </div>
              <h4 className="text-2xl font-bold mb-3 text-gray-900">Secure Payments</h4>
              <p className="text-gray-600 leading-relaxed">
                Escrow protection. Instant release after work completion. No delays, no disputes.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl px-8 my-20">
          <h3 className="text-4xl font-black text-center mb-16 text-gray-900">
            Get Started in 3 Steps
          </h3>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-black text-white">1</span>
              </div>
              <h4 className="text-xl font-bold mb-3">Create Profile</h4>
              <p className="text-gray-600">Add your photo, location, skills. Takes 2 minutes.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-black text-white">2</span>
              </div>
              <h4 className="text-xl font-bold mb-3">Find or Post Jobs</h4>
              <p className="text-gray-600">Browse nearby jobs or post your requirement instantly.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-black text-white">3</span>
              </div>
              <h4 className="text-xl font-bold mb-3">Work & Get Paid</h4>
              <p className="text-gray-600">Complete work, get rated, receive payment. Simple!</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-20 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 shadow-2xl">
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Transform Agriculture?
            </h3>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of farmers and workers building a better future
            </p>
            <Link
              to="/signup"
              className="inline-block px-10 py-4 bg-white text-green-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Sign Up Free - It Takes 2 Minutes
            </Link>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🌾</span>
                </div>
                <h4 className="text-xl font-bold">Raitakarya</h4>
              </div>
              <p className="text-gray-400">
                Connecting India's agricultural workforce with opportunities
              </p>
            </div>

            <div>
              <h5 className="font-bold mb-4">Quick Links</h5>
              <div className="space-y-2">
                <Link to="/signup" className="block text-gray-400 hover:text-white transition-colors">Sign Up</Link>
                <Link to="/login" className="block text-gray-400 hover:text-white transition-colors">Login</Link>
                <Link to="/terms" className="block text-gray-400 hover:text-white transition-colors">Terms</Link>
                <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy</Link>
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-4">Contact</h5>
              <p className="text-gray-400">
                support@raitakarya.com
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Raitakarya. Built with ❤️ for India's farmers and workers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
