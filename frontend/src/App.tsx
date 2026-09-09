import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import ResourceHub from './pages/ResourceHub';
import AiAssistant from './pages/AiAssistant';
import Crisis from './pages/Crisis';
import Community from './pages/Community';
import SolutionHub from './pages/SolutionHub';
import CounselorMarketplace from './pages/CounselorMarketplace';
import InstitutionDashboard from './pages/InstitutionDashboard';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><ResourceHub /></ProtectedRoute>} />
          <Route path="/ai-assistant" element={<ProtectedRoute><AiAssistant /></ProtectedRoute>} />
          <Route path="/crisis" element={<ProtectedRoute><Crisis /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/solutions" element={<ProtectedRoute><SolutionHub /></ProtectedRoute>} />
          <Route path="/counselors" element={<ProtectedRoute><CounselorMarketplace /></ProtectedRoute>} />
          <Route path="/institution" element={<ProtectedRoute><InstitutionDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
