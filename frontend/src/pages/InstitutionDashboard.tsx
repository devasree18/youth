import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Activity, ShieldCheck, UserPlus, TrendingUp } from 'lucide-react';
import { institutionService, type InstitutionStats } from '../services/institutionService';

const InstitutionDashboard = () => {
  const [stats, setStats] = useState<InstitutionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('STUDENT');
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await institutionService.getStats();
        if (res.success && res.data) setStats(res.data);
      } catch (err: any) {
        console.error('Failed to load institution stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setInviteStatus(null);

    try {
      const res = await institutionService.inviteMember(inviteName, inviteEmail, inviteRole);
      if (res.success) {
        setInviteStatus(`Invitation sent successfully to ${inviteEmail}`);
        setInviteName('');
        setInviteEmail('');
      } else {
        setInviteStatus(`Invitation failed: ${res.error?.message || 'Error sending invite'}`);
      }
    } catch (err: any) {
      setInviteStatus(`Invitation failed: ${err.message || 'Error sending invite'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Institution SaaS Portal</h1>
              <p className="text-xs text-slate-500 font-medium">B2B Campus Wellbeing Analytics & Member Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">Aggregated & Privacy Suppressed</span>
          </div>
        </div>

        {stats?.privacyNotice && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-bold">
            ⚠️ {stats.privacyNotice}
          </div>
        )}

        {/* Analytics Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enrolled Students</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{loading ? '...' : stats?.activeStudents ?? 0}</div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">Active Campus Members</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assessment Check-ins</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{loading ? '...' : stats?.checkInParticipation ?? 0}</div>
              <span className="text-[11px] text-indigo-600 font-semibold mt-1 inline-block">Completed Surveys</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Campus Wellbeing Index</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{loading ? '...' : (stats?.aggregatedWellbeingIndex ?? 'N/A')}</div>
              <span className="text-[11px] text-slate-500 font-semibold mt-1 inline-block">0 - 100 Privacy Aggregated Score</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Member Invitation Form */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-black text-slate-900 mb-1 flex items-center">
            <UserPlus className="w-5 h-5 text-indigo-600 mr-2" />
            Invite Institution Members
          </h2>
          <p className="text-xs text-slate-500 mb-6 font-medium">Send onboarding invitations to new students, faculty, or campus staff.</p>

          {inviteStatus && (
            <div className={`mb-4 p-3 rounded-xl text-xs font-bold ${
              inviteStatus.startsWith('Invitation failed') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'
            }`}>
              {inviteStatus}
            </div>
          )}

          <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="Full Name"
              className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:border-indigo-500"
              required
            />
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Institutional Email (@university.edu)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:border-indigo-500"
              required
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none font-bold text-slate-700"
            >
              <option value="STUDENT">Student</option>
              <option value="INSTITUTION_STAFF">Campus Staff / Counselor</option>
            </select>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default InstitutionDashboard;
