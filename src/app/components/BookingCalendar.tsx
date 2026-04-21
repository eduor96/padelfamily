import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Check, X, AlertCircle, List } from 'lucide-react';
import { getBookings, createBooking, cancelBooking, getMemberBookings, Booking as SupabaseBooking } from '../../utils/supabase';

interface BookingCalendarProps {
  memberId: string;
  memberName: string;
}

const COURTS = [1, 2];
const MORNING_HOURS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];
const EVENING_HOURS = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
const ALL_HOURS = [...MORNING_HOURS, ...EVENING_HOURS];
const PRIME_HOURS = ['19:00', '20:00', '21:00']; // 7pm-9pm

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function BookingCalendar({ memberId, memberName }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<SupabaseBooking[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ court: number; time: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ court: number; date: string; time: string } | null>(null);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Helper functions
  function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  function getWeekDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  const weekDates = getWeekDates();

  // Cargar reservas desde Supabase
  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);
      const weekDates = getWeekDates();
      const startDate = formatDate(weekDates[0]);
      const endDate = formatDate(weekDates[weekDates.length - 1]);

      const data = await getBookings(startDate, endDate);
      setBookings(data);
    } catch (err: any) {
      console.error('Error loading bookings:', err);
      setError('Error al cargar reservas: ' + err.message);
    } finally {
      setLoading(false);
    }
  }


  const isSlotBooked = (court: number, date: string, time: string) => {
    return bookings.some(
      (b) => b.cancha === court && b.fecha === date && b.hora === time && b.estado === 'confirmada'
    );
  };

  const getBookingForSlot = (court: number, date: string, time: string) => {
    return bookings.find(
      (b) => b.cancha === court && b.fecha === date && b.hora === time && b.estado === 'confirmada'
    );
  };

  const getUserPrimeTimeBookings = () => {
    const weekDates = getWeekDates();
    return bookings.filter(
      (b) =>
        b.miembro_id === memberId &&
        PRIME_HOURS.includes(b.hora) &&
        b.estado === 'confirmada' &&
        weekDates.some((d) => formatDate(d) === b.fecha)
    );
  };

  const handleSlotClick = (court: number, time: string) => {
    const date = formatDate(selectedDate);
    const booking = getBookingForSlot(court, date, time);

    if (booking) {
      if (booking.miembro_id === memberId) {
        // Abrir confirmación de cancelación
        setConfirmDialog({ court, date, time });
      }
      return;
    }

    // Validar horario prime (7pm-9pm)
    if (PRIME_HOURS.includes(time)) {
      const primeBookings = getUserPrimeTimeBookings();
      if (primeBookings.length >= 1) {
        setError('Solo puedes reservar 1 horario entre 7pm-9pm por semana');
        setTimeout(() => setError(''), 4000);
        return;
      }
    }

    // Abrir confirmación de reserva
    setConfirmDialog({ court, date, time });
  };

  const confirmBooking = async () => {
    if (!confirmDialog) return;

    const { court, date, time } = confirmDialog;
    const booking = getBookingForSlot(court, date, time);

    try {
      if (booking && booking.miembro_id === memberId) {
        // Cancelar reserva
        await cancelBooking(booking.id);
        await loadBookings(); // Recargar todas las reservas
        setSelectedSlot({ court, time });
        setTimeout(() => setSelectedSlot(null), 2000);
      } else if (!booking) {
        // Crear nueva reserva
        const isPrime = PRIME_HOURS.includes(time);
        const precio = isPrime ? 0 : 100;
        const tipo = isPrime ? 'prime' : 'regular';

        await createBooking(memberId, court, date, time, precio, tipo as 'prime' | 'regular');
        await loadBookings(); // Recargar todas las reservas
        setSelectedSlot({ court, time });
        setTimeout(() => setSelectedSlot(null), 2000);
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message || 'Error al procesar la reserva');
      setTimeout(() => setError(''), 4000);
    }

    setConfirmDialog(null);
  };

  const getMyBookings = () => {
    return bookings
      .filter((b) => b.miembro_id === memberId && b.estado === 'confirmada')
      .sort((a, b) => {
        const dateCompare = a.fecha.localeCompare(b.fecha);
        if (dateCompare !== 0) return dateCompare;
        return a.hora.localeCompare(b.hora);
      });
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const calculatePrice = (time: string) => {
    return PRIME_HOURS.includes(time) ? 0 : 100;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Reserva tu <span className="text-primary">cancha</span>
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                {memberName}
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMyBookings(!showMyBookings)}
                className="p-4 bg-secondary/10 rounded-2xl hover:bg-secondary/20 transition-colors"
              >
                <List className="w-8 h-8 text-secondary" />
              </motion.button>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="p-4 bg-primary/10 rounded-2xl"
              >
                <Calendar className="w-8 h-8 text-primary" />
              </motion.div>
            </div>
          </div>

          {/* Info banner */}
          <div className="space-y-3">
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">Horarios:</span> 7:00-13:00 y 16:00-23:30 · Solo puedes reservar dentro de la próxima semana
                </p>
              </div>
            </div>
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">Horario prime (7pm-9pm):</span> Solo puedes reservar 1 turno en este horario por semana
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* My Bookings Panel */}
        <AnimatePresence>
          {showMyBookings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <List className="w-6 h-6 text-secondary" />
                  Mis Reservas
                </h2>
                {getMyBookings().length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No tienes reservas activas
                  </p>
                ) : (
                  <div className="space-y-3">
                    {getMyBookings().map((booking) => {
                      const isPrime = PRIME_HOURS.includes(booking.hora);
                      return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`
                            p-4 rounded-xl border-2 flex items-center justify-between
                            ${isPrime
                              ? 'bg-accent/10 border-accent/30'
                              : 'bg-muted border-border'
                            }
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                Cancha {booking.cancha} - {booking.hora}
                              </p>
                              <p className="text-sm text-muted-foreground font-mono">
                                {new Date(booking.fecha).toLocaleDateString('es-ES', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                              {isPrime && (
                                <p className="text-xs text-accent mt-1">⭐ Horario Prime - Gratis</p>
                              )}
                              {!isPrime && (
                                <p className="text-xs text-muted-foreground mt-1">$100</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Week selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, index) => {
                const isSelected = formatDate(date) === formatDate(selectedDate);
                const isPast = isPastDate(date);
                const isToday = formatDate(date) === formatDate(new Date());

                return (
                  <motion.button
                    key={index}
                    whileHover={!isPast ? { scale: 1.05 } : {}}
                    whileTap={!isPast ? { scale: 0.95 } : {}}
                    onClick={() => !isPast && setSelectedDate(date)}
                    disabled={isPast}
                    className={`
                      relative p-4 rounded-xl transition-all
                      ${isSelected
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                        : isPast
                        ? 'bg-muted/30 text-muted-foreground/30 cursor-not-allowed'
                        : 'bg-muted hover:bg-muted/70'
                      }
                    `}
                  >
                    {isToday && !isSelected && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
                    )}
                    <div className="text-xs opacity-70 mb-1">{DAYS[date.getDay()]}</div>
                    <div className="text-xl font-bold">{date.getDate()}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Courts Grid */}
        <div className="space-y-6">
          {COURTS.map((court) => (
            <motion.div
              key={court}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + court * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl">Cancha {court}</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {formatDate(selectedDate)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {ALL_HOURS.map((time) => {
                  const booking = getBookingForSlot(court, formatDate(selectedDate), time);
                  const isBooked = !!booking;
                  const isMyBooking = booking?.miembro_id === memberId;
                  const isJustBooked = selectedSlot?.court === court && selectedSlot?.time === time;
                  const isPrime = PRIME_HOURS.includes(time);

                  return (
                    <motion.button
                      key={time}
                      whileHover={!isBooked || isMyBooking ? { scale: 1.05 } : {}}
                      whileTap={!isBooked || isMyBooking ? { scale: 0.95 } : {}}
                      onClick={() => (!isBooked || isMyBooking) && handleSlotClick(court, time)}
                      disabled={isBooked && !isMyBooking}
                      className={`
                        relative p-3 rounded-lg transition-all font-mono text-sm
                        ${isMyBooking
                          ? 'bg-secondary text-secondary-foreground ring-2 ring-secondary/50'
                          : isBooked
                          ? 'bg-muted/30 text-muted-foreground/30 cursor-not-allowed'
                          : isPrime
                          ? 'bg-accent/20 hover:bg-accent hover:text-accent-foreground border border-accent/40'
                          : 'bg-muted hover:bg-primary hover:text-primary-foreground'
                        }
                      `}
                    >
                      <AnimatePresence>
                        {isJustBooked && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute inset-0 bg-primary rounded-lg flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 text-primary-foreground" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {isPrime && !isBooked && (
                        <div className="absolute -top-1 -right-1 text-xs">⭐</div>
                      )}
                      <div>{time}</div>
                      {isMyBooking && (
                        <div className="text-xs opacity-70 mt-1">Mía</div>
                      )}
                      {isBooked && !isMyBooking && (
                        <div className="text-xs opacity-50 mt-1">Ocupado</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap gap-4 justify-center text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded" />
            <span className="text-muted-foreground">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent/20 border border-accent/40 rounded" />
            <span className="text-muted-foreground">Horario Prime ⭐</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary rounded" />
            <span className="text-muted-foreground">Tu reserva</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted/30 rounded" />
            <span className="text-muted-foreground">Ocupado</span>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmDialog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border-2 border-border rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              {(() => {
                const booking = getBookingForSlot(
                  confirmDialog.court,
                  confirmDialog.date,
                  confirmDialog.time
                );
                const isCancel = booking?.miembro_id === memberId;
                const isPrime = PRIME_HOURS.includes(confirmDialog.time);

                return (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`p-3 rounded-xl ${
                          isCancel ? 'bg-destructive/10' : 'bg-primary/10'
                        }`}
                      >
                        {isCancel ? (
                          <X className="w-6 h-6 text-destructive" />
                        ) : (
                          <Check className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold">
                        {isCancel ? 'Cancelar reserva' : 'Confirmar reserva'}
                      </h3>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Cancha</p>
                          <p className="font-semibold">Cancha {confirmDialog.court}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Clock className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Horario</p>
                          <p className="font-semibold font-mono">
                            {confirmDialog.time}
                            {isPrime && <span className="ml-2 text-accent">⭐ Prime</span>}
                          </p>
                        </div>
                        {!isCancel && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Precio</p>
                            <p className="text-xl font-bold text-primary">
                              {isPrime ? 'GRATIS' : '$100'}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <User className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha</p>
                          <p className="font-semibold">
                            {new Date(confirmDialog.date).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setConfirmDialog(null)}
                        className="flex-1 px-4 py-3 bg-muted hover:bg-muted/70 rounded-xl font-semibold transition-colors"
                      >
                        Cancelar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={confirmBooking}
                        className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors ${
                          isCancel
                            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                        }`}
                      >
                        {isCancel ? 'Sí, cancelar' : 'Confirmar'}
                      </motion.button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
