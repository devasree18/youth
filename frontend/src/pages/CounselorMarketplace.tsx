import { useState, useEffect } from 'react';
import { Star, Calendar, CheckCircle2, Video } from 'lucide-react';
import { counselorService, type Counselor, type AvailabilitySlot } from '../services/counselorService';
import { appointmentService } from '../services/appointmentService';
import { AppShell } from '../components/layout/AppShell';

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
        const res = await counselorService.getCounselors();
        if (res.success && res.data) setCounselors(res.data);
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

    const now = new Date();
    const resultDate = new Date(now.getTime());
    resultDate.setDate(now.getDate() + ((7 + selectedSlot.dayOfWeek - now.getDay()) % 7 || 7));
    const [hours, minutes] = selectedSlot.startTime.split(':');
    resultDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    try {
      const res = await appointmentService.bookAppointment(
        selectedCounselor._id,
        resultDate.toISOString(),
        'online'
      );
      if (res.success) {
        setBookingStatus('Appointment successfully booked! Confirmation details sent to your account.');
        setSelectedSlot(null);
      } else {
        setBookingStatus(`Booking failed: ${res.error?.message || 'Slot unavailable'}`);
      }
    } catch (err: any) {
      setBookingStatus(`Booking failed: ${err.message || 'Slot unavailable'}`);
    } finally {
      setIsBooking(false);
    }
  };

  const getDayName = (dayNum: number) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayNum] || 'Day';

  return (
    <AppShell title="Campus Counselors" subtitle="Connect with licensed mental health specialists for private 1-on-1 consultations">
      <div className="space-y-6">

        {bookingStatus && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
            bookingStatus.startsWith('Booking failed') ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{bookingStatus}</span>
          </div>
        )}

        {/* Directory Grid */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 text-slate-500 font-semibold text-xs">Loading verified specialists...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {counselors.map((c) => (
              <div key={c._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-black text-slate-900 text-base">{c.name}</h3>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full inline-block mt-1">{c.specialization}</span>
                    </div>

                    <div className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1 text-amber-400" />
                      {c.rating} ({c.reviewsCount})
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{c.description}</p>

                  <div className="space-y-1 text-xs text-slate-500 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div>🎓 <strong>Qualifications:</strong> {c.qualifications?.join(', ')}</div>
                    <div>🗣️ <strong>Languages:</strong> {c.languages?.join(', ')}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 font-semibold">Consultation: </span>
                    <span className="font-bold text-slate-900">{c.price === 0 ? 'Free / Campus Sponsored' : `₹${c.price}`}</span>
                  </div>

                  <button 
                    onClick={() => { setSelectedCounselor(c); setSelectedSlot(null); }}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
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
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Book Session with {selectedCounselor.name}</h3>
                  <p className="text-xs text-slate-500">{selectedCounselor.specialization}</p>
                </div>
                <button onClick={() => setSelectedCounselor(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1">✕</button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Available Slot Schedule</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCounselor.availabilitySlots?.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-2xl text-left border transition-all text-xs ${
                        selectedSlot === slot 
                          ? 'border-blue-600 bg-blue-50 font-bold text-blue-900 ring-2 ring-blue-500/20 shadow-sm' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-slate-900">{getDayName(slot.dayOfWeek)}</div>
                      <div className="text-[11px] text-slate-500 flex items-center mt-1">
                        <Video className="w-3 h-3 mr-1 text-blue-600" />
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                <button onClick={() => setSelectedCounselor(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button 
                  disabled={!selectedSlot || isBooking}
                  onClick={handleBookSlot}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
                >
                  {isBooking ? 'Confirming...' : 'Confirm Appointment'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
};

export default CounselorMarketplace;

