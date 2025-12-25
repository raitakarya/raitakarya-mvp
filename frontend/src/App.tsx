import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WorkerDashboard from './pages/WorkerDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import JobDetails from './pages/JobDetails';
import Profile from './pages/Profile';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  const { token, user, loadUser } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      loadUser();
    }
  }, [token, user, loadUser]);

  const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    if (role && user?.role !== role) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? (
          user?.role === 'WORKER' ? <Navigate to="/worker/dashboard" /> : <Navigate to="/farmer/dashboard" />
        ) : <Landing />} />
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={token ? <Navigate to="/" /> : <Signup />} />

        <Route
          path="/worker/dashboard"
          element={
            <ProtectedRoute role="WORKER">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmer/dashboard"
          element={
            <ProtectedRoute role="FARMER">
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
