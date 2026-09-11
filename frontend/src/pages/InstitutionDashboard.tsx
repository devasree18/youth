import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, UserPlus, TrendingUp } from 'lucide-react';
import { institutionService, type InstitutionStats } from '../services/institutionService';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import { staggerContainerVariants, fadeUpVariants } from '../lib/motion';

export const InstitutionDashboard = () => {
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
    <AppShell
      title="Campus Administration Portal"
      subtitle="Aggregated student wellbeing metrics, participation trends, and member management"
    >
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {stats?.privacyNotice && (
          <motion.div variants={fadeUpVariants}>
            <Alert variant="warning" title="Privacy Protection Threshold Active">
              {stats.privacyNotice}
            </Alert>
          </motion.div>
        )}

        {/* Analytics Widgets Grid */}
        <motion.div variants={fadeUpVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-6 flex items-center justify-between rounded-2xl border-slate-200/90 shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enrolled Students</span>
              <div className="text-3xl font-extrabold text-[#172033] mt-1.5 font-mono">
                {loading ? <Skeleton className="h-8 w-16" /> : stats?.activeStudents ?? 0}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
                Active campus accounts
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-6 flex items-center justify-between rounded-2xl border-slate-200/90 shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Check-in Participation</span>
              <div className="text-3xl font-extrabold text-[#172033] mt-1.5 font-mono">
                {loading ? <Skeleton className="h-8 w-16" /> : stats?.checkInParticipation ?? 0}
              </div>
              <span className="text-[11px] text-indigo-600 font-semibold mt-1 inline-block">
                Assessments logged
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-6 flex items-center justify-between rounded-2xl border-slate-200/90 shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Campus Wellbeing Index</span>
              <div className="text-3xl font-extrabold text-[#172033] mt-1.5 font-mono">
                {loading ? <Skeleton className="h-8 w-16" /> : stats?.aggregatedWellbeingIndex ?? 'N/A'}
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">
                Cohort aggregate score
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </Card>
        </motion.div>

        {/* Member Invitation Card */}
        <motion.div variants={fadeUpVariants}>
          <Card className="p-6 sm:p-7 space-y-4 rounded-2xl border-slate-200/90 shadow-xs">
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#172033]">Invite Campus Members</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                Send an onboarding invite to students, campus counselors, or institutional staff.
              </p>
            </div>

            {inviteStatus && (
              <Alert
                variant={inviteStatus.startsWith('Invitation failed') ? 'error' : 'success'}
              >
                {inviteStatus}
              </Alert>
            )}

            <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <Input
                label="Full Name"
                type="text"
                placeholder="e.g. Maya Patel"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                required
              />

              <Input
                label="Campus Email"
                type="email"
                placeholder="user@campus.edu"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold text-slate-700 tracking-tight">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-white text-sm text-[#172033] border border-slate-200 rounded-xl px-3.5 py-2.5 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
                >
                  <option value="STUDENT">Student</option>
                  <option value="INSTITUTION_STAFF">Counselor / Staff</option>
                </select>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="default"
                  className="w-full min-h-[44px]"
                  isLoading={isSubmitting}
                >
                  Send Invite
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </AppShell>
  );
};

export default InstitutionDashboard;
