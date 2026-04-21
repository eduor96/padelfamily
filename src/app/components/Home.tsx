import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  DollarSign,
  Trophy,
  Users,
  Zap,
  Bell,
  Award,
  Target,
} from 'lucide-react';

export function Home() {
  const announcements = [
    {
      id: 1,
      title: 'Torneo de Padel - Mayo 2026',
      description: 'Inscripciones abiertas para el torneo mensual. Categorías: Amateur y Profesional.',
      date: '2026-05-15',
      type: 'tournament',
    },
    {
      id: 2,
      title: 'Clases Grupales Disponibles',
      description: 'Nuevos horarios para clases grupales los martes y jueves. Cupos limitados.',
      date: '2026-04-20',
      type: 'class',
    },
    {
      id: 3,
      title: 'Mantenimiento Programado',
      description: 'Las canchas estarán en mantenimiento el 25 de abril. Disculpe las molestias.',
      date: '2026-04-25',
      type: 'maintenance',
    },
  ];

  const classes = [
    {
      title: 'Clases Principiantes',
      schedule: 'Lunes y Miércoles 9:00-10:30',
      price: '$500/mes',
      icon: Users,
    },
    {
      title: 'Clases Intermedias',
      schedule: 'Martes y Jueves 18:00-19:30',
      price: '$600/mes',
      icon: Target,
    },
    {
      title: 'Clases Avanzadas',
      schedule: 'Viernes 17:00-19:00',
      price: '$700/mes',
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 p-8 md:p-12 border border-border"
        >
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
            >
              Bienvenido a{' '}
              <span className="text-primary">Padel Family</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-2xl mb-6"
            >
              Reserva tus canchas, únete a clases y participa en torneos. Todo en un solo lugar.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm">Lun-Dom: 7:00-13:00 y 16:00-23:30</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                <DollarSign className="w-5 h-5 text-accent" />
                <span className="text-sm">Horario Prime GRATIS · Otros $100</span>
              </div>
            </motion.div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </motion.div>

        {/* Pricing Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-accent" />
            Tarifas de Reserva
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-accent/20 rounded-xl">
                  <Zap className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Horario Prime</h3>
                  <p className="text-sm text-muted-foreground">7pm - 9pm</p>
                </div>
              </div>
              <div className="text-5xl font-bold text-accent mb-2">GRATIS ⭐</div>
              <p className="text-muted-foreground mb-4">
                Solo 1 reserva por semana en este horario
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>Horarios: 19:00, 20:00, 21:00</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card border-2 border-border rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Horario Regular</h3>
                  <p className="text-sm text-muted-foreground">Resto del día</p>
                </div>
              </div>
              <div className="text-5xl font-bold text-primary mb-2">$100</div>
              <p className="text-muted-foreground mb-4">Por hora de cancha</p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Reservas ilimitadas</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Bell className="w-8 h-8 text-secondary" />
            Avisos y Eventos
          </h2>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl flex-shrink-0 ${
                      announcement.type === 'tournament'
                        ? 'bg-secondary/10'
                        : announcement.type === 'class'
                        ? 'bg-primary/10'
                        : 'bg-accent/10'
                    }`}
                  >
                    {announcement.type === 'tournament' && (
                      <Trophy className="w-6 h-6 text-secondary" />
                    )}
                    {announcement.type === 'class' && (
                      <Users className="w-6 h-6 text-primary" />
                    )}
                    {announcement.type === 'maintenance' && (
                      <Zap className="w-6 h-6 text-accent" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
                    <p className="text-muted-foreground mb-3">{announcement.description}</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {new Date(announcement.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-8 h-8 text-primary" />
            Clases y Entrenamientos
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {classes.map((classItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all"
              >
                <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
                  <classItem.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{classItem.title}</h3>
                <p className="text-muted-foreground mb-3">{classItem.schedule}</p>
                <p className="text-2xl font-bold text-primary">{classItem.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info League */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-border rounded-2xl p-8"
        >
          <div className="flex items-start gap-6">
            <div className="p-4 bg-card rounded-2xl">
              <Trophy className="w-12 h-12 text-secondary" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Liga PadelFamily 2026</h2>
              <p className="text-muted-foreground mb-6">
                Únete a nuestra liga oficial de Padel. Compite con los mejores jugadores, sube en el
                ranking y gana premios increíbles. Inscripciones abiertas hasta el 30 de abril.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-4">
                  <p className="text-3xl font-bold text-primary mb-1">150+</p>
                  <p className="text-sm text-muted-foreground">Jugadores activos</p>
                </div>
                <div className="bg-card rounded-xl p-4">
                  <p className="text-3xl font-bold text-secondary mb-1">12</p>
                  <p className="text-sm text-muted-foreground">Torneos al año</p>
                </div>
                <div className="bg-card rounded-xl p-4">
                  <p className="text-3xl font-bold text-accent mb-1">$50K</p>
                  <p className="text-sm text-muted-foreground">En premios</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
