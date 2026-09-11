import { motion } from 'framer-motion';
import { ShieldAlert, PhoneCall, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AppShell } from '../components/layout/AppShell';
import { staggerContainerVariants, fadeUpVariants } from '../lib/motion';

const HOTLINES = [
  {
    name: 'Tele-MANAS (Govt. of India)',
    number: '14416',
    altNumber: '1800-891-4416',
    hours: '24/7 • Toll-Free • Multi-lingual',
    desc: 'National tele-mental health programme providing comprehensive psychological counseling.',
    primary: true,
  },
  {
    name: 'KIRAN Mental Health Helpline',
    number: '1800-599-0019',
    hours: '24/7 • Toll-Free',
    desc: 'Government mental health helpline offering early screening, psychological support, and distress management.',
  },
  {
    name: 'Vandrevala Foundation',
    number: '9999-666-555',
    hours: '24/7 • Free & Confidential',
    desc: 'Experienced mental health professionals specializing in crisis intervention and emotional wellbeing.',
  },
  {
    name: 'NIMHANS Helpline',
    number: '080-46110007',
    hours: '24/7 Psychosocial Support',
    desc: 'National Institute of Mental Health and Neuro-Sciences emergency counseling service.',
  },
];

export const Crisis = () => {
  return (
    <AppShell
      title="Emergency Crisis Support"
      subtitle="Immediate 24/7 assistance and certified helpline contacts"
    >
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Urgent Emergency Banner */}
        <motion.div
          variants={fadeUpVariants}
          className="bg-rose-50 border border-rose-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-rose-950">You Are Not Alone</h2>
              <Badge variant="danger" dot>24/7 Immediate Care</Badge>
            </div>
            <p className="text-xs sm:text-sm text-rose-900 max-w-xl leading-relaxed">
              If you or someone around you is in immediate danger or severe emotional distress, please connect directly with the national helplines below. All calls are free and confidential.
            </p>
          </div>

          <a
            href="tel:14416"
            className="w-full md:w-auto inline-flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-6 py-3 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Tele-MANAS (14416)</span>
          </a>
        </motion.div>

        {/* Certified Hotlines List */}
        <motion.div variants={fadeUpVariants} className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Certified National Hotlines (India)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HOTLINES.map((hotline, idx) => (
              <Card key={idx} className="p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{hotline.name}</h4>
                    <Badge variant={hotline.primary ? 'danger' : 'neutral'} size="sm">
                      {hotline.hours}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{hotline.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-slate-900">
                    {hotline.number}
                  </span>
                  <a
                    href={`tel:${hotline.number.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-slate-700" />
                    <span>Call Now</span>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Immediate Grounding Protocols */}
        <motion.div variants={fadeUpVariants}>
          <Card className="p-6 bg-white border-slate-200 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">5-4-3-2-1 Sensory Grounding Technique</h4>
                <p className="text-xs text-slate-500">A clinically proven exercise to reduce acute anxiety and panic symptoms.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              {[
                { num: '5', label: 'Things you can SEE around you' },
                { num: '4', label: 'Things you can TOUCH or feel' },
                { num: '3', label: 'Things you can HEAR' },
                { num: '2', label: 'Things you can SMELL' },
                { num: '1', label: 'Thing you can TASTE or affirm' },
              ].map((step, sIdx) => (
                <div key={sIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-1">
                  <span className="text-lg font-extrabold text-blue-600">{step.num}</span>
                  <p className="text-[11px] text-slate-700 font-medium leading-tight">{step.label}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 flex items-center justify-between">
              <Link to="/solutions" className="text-xs font-semibold text-blue-600 hover:underline">
                Explore Interactive Breathing & Grounding Timers →
              </Link>
              <Link to="/counselors">
                <Button variant="secondary" size="sm">
                  Schedule Counselor Follow-up
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AppShell>
  );
};

export default Crisis;
