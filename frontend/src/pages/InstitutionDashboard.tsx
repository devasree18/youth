import { useState, useEffect } from 'react';
import { Users, Activity, ShieldCheck, UserPlus, TrendingUp } from 'lucide-react';
import { institutionService, type InstitutionStats } from '../services/institutionService';
import { AppShell } from '../components/layout/AppShell';

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
    <AppShell title="Institution Portal" subtitle="B2B Campus Wellbeing Analytics & Privacy-Safe Management">
      <div className="space-y-6">

        {stats?.privacyNotice && (
          <div className="p-4 bg-amber-50 border border-amber-200/80 text-amber-900 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{stats.privacyNotice}</span>
          </div>
        )}

        {/* Analytics Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enrolled Members</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{loading ? '...' : stats?.activeStudents ?? 0}</div>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">Active Campus Accounts</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assessment Responses</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{loading ? '...' : stats?.checkInParticipation ?? 0}</div>
              <span className="text-[11px] text-blue-600 font-bold mt-1 inline-block">Completed Check-ins</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campus Wellbeing Index</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{loading ? '...' : (stats?.aggregatedWellbeingIndex ?? 'N/A')}</div>
              <span className="text-[11px] text-slate-500 font-bold mt-1 inline-block">Privacy Aggregated Score</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Member Invitation Form */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center space-x-2 mb-1">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-extrabold text-slate-900">Invite Campus Members</h3>
          </div>
          <p className="text-xs text-slate-500 mb-5 font-semibold">Send onboarding invitations to new students, faculty, or campus counselor staff.</p>

          {inviteStatus && (
            <div className={`mb-4 p-3.5 rounded-2xl text-xs font-bold ${
              inviteStatus.startsWith('Invitation failed') ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
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
              className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
              required
            />
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Email (@university.edu)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
              required
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none font-bold text-slate-700"
            >
              <option value="STUDENT">Student</option>
              <option value="INSTITUTION_STAFF">Campus Counselor / Staff</option>
            </select>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
            >
              {isSubmitting ? 'Sending...' : 'Send Invite'}
            </button>
          </form>
        </div>

      </div>
    </AppShell>
  );
};

export default InstitutionDashboard;

