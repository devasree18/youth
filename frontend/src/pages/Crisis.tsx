import { useState, useEffect } from 'react';
import { PhoneCall, HeartHandshake, Clock, Globe } from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { Navbar } from '../components/layout/Navbar';

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
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-8 py-10">
        
        {/* Urgent Banner */}
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 shadow-sm flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <HeartHandshake className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-900 mb-1">You Are Not Alone</h2>
            <p className="text-sm text-red-800 leading-relaxed">
              If you or someone you know is in immediate distress, feeling overwhelmed, or experiencing thoughts of self-harm, please reach out to one of the free, confidential 24/7 helplines below right now.
            </p>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Emergency & Helpline Directory</h2>
          
          {loading ? (
            <div className="p-8 text-center text-slate-500 font-medium bg-white rounded-2xl border border-slate-200">Loading resources...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((res, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        res.category === 'EMERGENCY_SERVICES' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {res.category === 'EMERGENCY_SERVICES' ? 'Emergency' : 'Helpline'}
                      </span>
                      <div className="flex items-center text-xs text-slate-500 font-medium">
                        <Globe className="w-3.5 h-3.5 mr-1" />
                        {res.region}
                      </div>
                    </div>

                    <h3 className="font-black text-slate-900 text-base mb-2">{res.name}</h3>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">{res.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {res.hours}
                    </div>

                    <a 
                      href={`tel:${res.contact.split('/')[0].trim()}`} 
                      className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
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
        <div className="bg-slate-100 rounded-2xl p-6 text-xs text-slate-600 leading-relaxed border border-slate-200 text-center">
          <strong>Important Medical Notice:</strong> YOUTH provides wellbeing support resources, self-guided tools, and connectivity to counselors. YOUTH is not a substitute for clinical emergency care. If you are experiencing a medical or life-threatening emergency, please call <strong>112</strong> or visit the nearest emergency room immediately.
        </div>

      </main>
    </div>
  );
};

export default Crisis;
