import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Video, Clock } from 'lucide-react';
import { counselorService, type Counselor, type AvailabilitySlot } from '../services/counselorService';
import { appointmentService } from '../services/appointmentService';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert } from '../components/ui/alert';
import { Modal } from '../components/ui/dialog';
import { Skeleton } from '../components/ui/skeleton';
import { fadeUpVariants, staggerContainerVariants } from '../lib/motion';

export const CounselorMarketplace = () => {
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
        setBookingStatus('Appointment booked successfully! Details sent to your account.');
        setSelectedSlot(null);
        setSelectedCounselor(null);
      } else {
        setBookingStatus(`Booking failed: ${res.error?.message || 'Slot unavailable'}`);
      }
    } catch (err: any) {
      setBookingStatus(`Booking failed: ${err.message || 'Slot unavailable'}`);
    } finally {
      setIsBooking(false);
    }
  };

  const getDayName = (dayNum: number) =>
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayNum] || 'Day';

  return (
    <AppShell
      title="Counselor Directory"
      subtitle="Connect with licensed mental health specialists for private 1-on-1 consultations"
    >
      <div className="space-y-6">
        {bookingStatus && (
          <Alert
            variant={bookingStatus.startsWith('Booking failed') ? 'error' : 'success'}
            title={bookingStatus.startsWith('Booking failed') ? 'Booking Error' : 'Success'}
          >
            {bookingStatus}
          </Alert>
        )}

        {/* Directory Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 space-y-4 rounded-2xl">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-1/4" />
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {counselors.map((c) => (
              <motion.div key={c._id} variants={fadeUpVariants}>
                <Card className="p-6 sm:p-7 flex flex-col justify-between space-y-5 h-full rounded-2xl border-slate-200/90 shadow-xs hover:border-slate-300">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-[#172033]">{c.name}</h3>
                        <div className="mt-1">
                          <Badge variant="primary" size="sm">{c.specialization}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                        <span>{c.rating} ({c.reviewsCount})</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mt-3 font-normal">{c.description}</p>

                    <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <strong className="text-[#172033]">Qualifications:</strong>
                        <span>{c.qualifications?.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <strong className="text-[#172033]">Languages:</strong>
                        <span>{c.languages?.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-slate-400 font-medium">Session Fee: </span>
                      <span className="font-bold text-[#172033]">
                        {c.price === 0 ? 'Campus Sponsored (Free)' : `₹${c.price}`}
                      </span>
                    </div>

                    <Button
                      variant="primary"
                      size="default"
                      onClick={() => {
                        setSelectedCounselor(c);
                        setSelectedSlot(null);
                      }}
                      leftIcon={<Calendar className="w-4 h-4" />}
                    >
                      Select Slot
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Booking Modal */}
        <Modal
          isOpen={!!selectedCounselor}
          onClose={() => setSelectedCounselor(null)}
          title={`Schedule Consultation: ${selectedCounselor?.name}`}
          description={selectedCounselor?.specialization}
          maxWidth="md"
          footer={
            <>
              <Button
                variant="secondary"
                size="default"
                onClick={() => setSelectedCounselor(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="default"
                disabled={!selectedSlot}
                isLoading={isBooking}
                onClick={handleBookSlot}
              >
                Confirm Appointment
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-[#172033] mb-2.5">Available Consultation Slots</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedCounselor?.availabilitySlots?.map((slot, idx) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold shadow-xs ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-[#111827]">{getDayName(slot.dayOfWeek)}</div>
                      <div className="text-[11px] text-slate-500 flex items-center mt-1 font-medium">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {slot.startTime} – {slot.endTime}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-500 space-y-1">
              <div className="flex items-center space-x-1.5">
                <Video className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-[#111827]">Private End-to-End Encrypted Telehealth</span>
              </div>
              <p className="leading-relaxed">Appointments are conducted securely. A confidential video link will be sent prior to the session.</p>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
};

export default CounselorMarketplace;
