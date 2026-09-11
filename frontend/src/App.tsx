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
import Games from './pages/Games';
import WellbeingInsights from './pages/WellbeingInsights';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MobileAppProvider } from './components/mobile/MobileAppProvider';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-3"></div>
        <p className="text-xs font-medium text-slate-500">Restoring session...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MobileAppProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/wellbeing-insights" element={<ProtectedRoute><WellbeingInsights /></ProtectedRoute>} />
            <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><ResourceHub /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AiAssistant /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute><AiAssistant /></ProtectedRoute>} />
            <Route path="/crisis" element={<ProtectedRoute><Crisis /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/solutions" element={<ProtectedRoute><SolutionHub /></ProtectedRoute>} />
            <Route path="/counselors" element={<ProtectedRoute><CounselorMarketplace /></ProtectedRoute>} />
            <Route path="/institution" element={<ProtectedRoute><InstitutionDashboard /></ProtectedRoute>} />
          </Routes>
        </MobileAppProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
