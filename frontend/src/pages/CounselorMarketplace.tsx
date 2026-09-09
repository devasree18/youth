import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, ShieldCheck, CheckCircle2, Video } from 'lucide-react';
import { apiClient } from '../api/apiClient';

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Counselor {
  _id: string;
  name: string;
  specialization: string;
  qualifications: string[];
  languages: string[];
  consultationType: 'online' | 'in_person' | 'both';
  price: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  description: string;
  availabilitySlots: AvailabilitySlot[];
}

const CounselorMarketplace = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await apiClient.get<Counselor[]>('/counselors');
        if (res.data) setCounselors(res.data);
      } catch (err) {
        console.error('Failed to load counselors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounselors();
  }, []);

  const handleBookSlot = async () => {
    if (!selectedCounselor || !selectedSlot || isBooking) return;

    setIsBooking(true);
    setBookingStatus(null);

    // Calculate next date matching dayOfWeek
    const now = new Date();
    const resultDate = new Date(now.getTime());
    resultDate.setDate(now.getDate() + ((7 + selectedSlot.dayOfWeek - now.getDay()) % 7 || 7));
    const [hours, minutes] = selectedSlot.startTime.split(':');
    resultDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    try {
      await apiClient.post('/appointments/book', {
        counselorId: selectedCounselor._id,
        scheduledAt: resultDate.toISOString(),
        consultationType: 'online'
      });
      setBookingStatus('Appointment successfully booked! Confirmation details sent to your account.');
      setSelectedSlot(null);
    } catch (err: any) {
      setBookingStatus(`Booking failed: ${err.message || 'Slot unavailable'}`);
    } finally {
      setIsBooking(false);
    }
  };

  const getDayName = (dayNum: number) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayNum] || 'Day';

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verified Counselor Marketplace</h1>
              <p className="text-xs text-slate-500 font-medium">Connect with licensed student mental health specialists</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="font-bold">100% Confidential & Institution-Backed</span>
          </div>
        </div>

        {bookingStatus && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
            bookingStatus.startsWith('Booking failed') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{bookingStatus}</span>
          </div>
        )}

        {/* Directory Grid */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-500 font-medium">Loading verified counselors...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {counselors.map((c) => (
              <div key={c._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-black text-slate-900 text-lg">{c.name}</h2>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{c.specialization}</span>
                    </div>

                    <div className="flex items-center text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      {c.rating} ({c.reviewsCount})
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{c.description}</p>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-6">
                    <div>🎓 <strong>Qualifications:</strong> {c.qualifications?.join(', ')}</div>
                    <div>🗣️ <strong>Languages:</strong> {c.languages?.join(', ')}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 font-medium">Consultation: </span>
                    <span className="font-bold text-slate-900">{c.price === 0 ? 'Free / Campus Sponsored' : `₹${c.price}`}</span>
                  </div>

                  <button 
                    onClick={() => { setSelectedCounselor(c); setSelectedSlot(null); }}
                    className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    Book Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal / Booking Drawer */}
        {selectedCounselor && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Book Session with {selectedCounselor.name}</h3>
                  <p className="text-xs text-slate-500">{selectedCounselor.specialization}</p>
                </div>
                <button onClick={() => setSelectedCounselor(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Available Weekly Slots</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCounselor.availabilitySlots?.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-2xl text-left border transition-all text-xs ${
                        selectedSlot === slot 
                          ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900 ring-2 ring-indigo-500' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">{getDayName(slot.dayOfWeek)}</div>
                      <div className="text-[11px] text-slate-500 flex items-center mt-1">
                        <Video className="w-3 h-3 mr-1 text-indigo-500" />
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setSelectedCounselor(null)} className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button 
                  disabled={!selectedSlot || isBooking}
                  onClick={handleBookSlot}
                  className="px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isBooking ? 'Confirming...' : 'Confirm Appointment'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CounselorMarketplace;
