import { useState, useEffect } from 'react';
import { PhoneCall, HeartHandshake, Clock, Globe } from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { AppShell } from '../components/layout/AppShell';

interface EmergencyResource {
  name: string;
  contact: string;
  description: string;
  hours: string;
  region: string;
  category: 'HELPLINE' | 'EMERGENCY_SERVICES' | 'ORGANIZATION';
}

const DEFAULT_RESOURCES: EmergencyResource[] = [
  {
    name: 'Tele-MANAS (Govt of India National Tele-Mental Health Program)',
    contact: '14416 / 1800-891-4416',
    description: 'Free 24/7 tele-mental health services provided by NIMHANS and the Ministry of Health.',
    hours: '24/7 (Multi-lingual)',
    region: 'India',
    category: 'HELPLINE'
  },
  {
    name: 'KIRAN Mental Health Helpline',
    contact: '1800-599-0019',
    description: 'National helpline providing early screening, first-aid, psychological support and crisis management.',
    hours: '24/7',
    region: 'India',
    category: 'HELPLINE'
  },
  {
    name: 'Vandrevala Foundation Helpline',
    contact: '+91 9999 666 555',
    description: 'Free emotional support and crisis intervention services provided by trained counselors.',
    hours: '24/7',
    region: 'India',
    category: 'HELPLINE'
  },
  {
    name: 'Emergency Services (Ambulance / Police)',
    contact: '112 / 102',
    description: 'National Emergency Response System for immediate life safety emergencies.',
    hours: '24/7',
    region: 'India',
    category: 'EMERGENCY_SERVICES'
  }
];

const Crisis = () => {
  const [resources, setResources] = useState<EmergencyResource[]>(DEFAULT_RESOURCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await apiClient.get<EmergencyResource[]>('/crisis/resources');
        if (res.data && res.data.length > 0) {
          setResources(res.data);
        }
      } catch (err) {
        console.error('Failed to load online crisis resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <AppShell title="24/7 Crisis Support" subtitle="Immediate confidential helplines, emergency services & safety guidance">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Urgent Distress Banner */}
        <div className="bg-rose-50 border border-rose-200/90 rounded-3xl p-6 shadow-sm flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-rose-900 mb-1">You Are Not Alone</h2>
            <p className="text-xs text-rose-800 leading-relaxed font-medium">
              If you or someone you know is in immediate distress, feeling overwhelmed, or experiencing crisis thoughts, please connect with one of the free, confidential 24/7 helplines below right now.
            </p>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">National & Regional Crisis Directory</h3>
          
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-semibold text-xs bg-white rounded-3xl border border-slate-200/80">Loading emergency resources...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((res, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        res.category === 'EMERGENCY_SERVICES' ? 'bg-rose-100 text-rose-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {res.category === 'EMERGENCY_SERVICES' ? 'Emergency' : 'Helpline'}
                      </span>
                      <div className="flex items-center text-[11px] text-slate-400 font-semibold">
                        <Globe className="w-3.5 h-3.5 mr-1" />
                        {res.region}
                      </div>
                    </div>

                    <h4 className="font-black text-slate-900 text-sm mb-1.5">{res.name}</h4>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">{res.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center text-[11px] text-slate-500 font-semibold">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {res.hours}
                    </div>

                    <a 
                      href={`tel:${res.contact.split('/')[0].trim()}`} 
                      className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-md shadow-rose-500/20 active:scale-[0.98]"
                    >
                      <PhoneCall className="w-3.5 h-3.5 mr-1.5" />
                      {res.contact}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Safety Disclaimer */}
        <div className="bg-slate-100/70 rounded-3xl p-5 text-xs text-slate-600 leading-relaxed border border-slate-200/80 text-center font-medium">
          <strong>Important Clinical Disclaimer:</strong> YOUTH provides wellbeing support resources, self-guided check-ins, and connectivity to counselors. YOUTH is not a substitute for clinical emergency care. If you are experiencing a medical or life-threatening emergency, please call <strong>112</strong> or visit the nearest hospital emergency room immediately.
        </div>

      </div>
    </AppShell>
  );
};

export default Crisis;

