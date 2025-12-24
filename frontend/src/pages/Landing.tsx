import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">Raitakarya</h1>
          <div className="space-x-4">
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Connecting Farmers & Agricultural Workers
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Raitakarya bridges the gap between farmers seeking skilled workers and agricultural laborers looking for opportunities. Find work, post jobs, and grow together.
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/signup" className="btn btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-accent text-lg px-8 py-3">
              Find Jobs
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">🌾</div>
            <h3 className="text-xl font-semibold mb-2">For Farmers</h3>
            <p className="text-gray-600">
              Post job listings, find skilled workers, and manage your agricultural workforce efficiently.
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">👨‍🌾</div>
            <h3 className="text-xl font-semibold mb-2">For Workers</h3>
            <p className="text-gray-600">
              Browse available jobs, apply to opportunities, and build your reputation through quality work.
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">
              Escrow-based payment system ensures fair compensation for workers and quality assurance for farmers.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 bg-white rounded-2xl shadow-lg p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600">1000+</div>
              <div className="text-gray-600 mt-2">Active Workers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">500+</div>
              <div className="text-gray-600 mt-2">Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">5000+</div>
              <div className="text-gray-600 mt-2">Jobs Completed</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-24 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Raitakarya. Empowering agricultural communities.</p>
        </div>
      </footer>
    </div>
  );
}
