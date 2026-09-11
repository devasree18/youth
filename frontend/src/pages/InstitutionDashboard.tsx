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
          <Card className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Enrolled Students</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {loading ? <Skeleton className="h-8 w-16" /> : stats?.activeStudents ?? 0}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
                Active campus accounts
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Check-in Participation</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {loading ? <Skeleton className="h-8 w-16" /> : stats?.checkInParticipation ?? 0}
              </div>
              <span className="text-[11px] text-blue-600 font-medium mt-1 inline-block">
                Assessments logged
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Campus Wellbeing Index</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {loading ? <Skeleton className="h-8 w-16" /> : stats?.aggregatedWellbeingIndex ?? 'N/A'}
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">
                Cohort aggregate score
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </Card>
        </motion.div>

        {/* Member Invitation Card */}
        <motion.div variants={fadeUpVariants}>
          <Card className="p-6 space-y-4">
            <div>
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Invite Campus Members</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
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
                <label className="block text-xs font-semibold text-slate-700 tracking-tight">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-white text-sm text-slate-900 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                >
                  <option value="STUDENT">Student</option>
                  <option value="INSTITUTION_STAFF">Counselor / Staff</option>
                </select>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
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
