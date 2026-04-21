import { motion } from 'motion/react';
import {
  Check,
  Users,
  Zap,
  Trophy,
  DollarSign,
  Calendar,
  PartyPopper,
  GraduationCap,
  ChevronRight,
  Star,
  Lock,
  CreditCard,
} from 'lucide-react';
import { Logo } from './Logo';

interface LandingPageProps {
  onGetStarted: () => void;
  onAdminClick: () => void;
}

export function LandingPage({ onGetStarted, onAdminClick }: LandingPageProps) {
  const benefits = [
    {
      icon: Users,
      title: 'Tu Crew, Tu Cancha',
      description: 'Solo 40 personas como tú. Sin desconocidos, solo familia que comparte tu pasión.',
    },
    {
      icon: Zap,
      title: 'Prime Time Es Tuyo',
      description: 'Cada semana, un turno gratis en el mejor horario (7-9pm). Porque te lo mereces.',
    },
    {
      icon: Calendar,
      title: 'Juega Sin Límites',
      description: 'Reserva cuando quieras, cuanto quieras. Solo $100 por hora. Tu cancha, tu horario.',
    },
    {
      icon: Trophy,
      title: 'La Liga Es Nuestra',
      description: 'Todos los miércoles, competimos juntos. Ya estás dentro, sin pagar extra.',
    },
    {
      icon: PartyPopper,
      title: 'Tus Eventos, Tu Casa',
      description: '50% OFF para que celebres lo que quieras. Cumpleaños, terrazas, lo que se te ocurra.',
    },
    {
      icon: GraduationCap,
      title: 'Entrena Como Pro',
      description: 'Instructores de élite directo para ti. Sin intermediarios, sin sobrecostos.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Plan Semestral',
      price: '3,500',
      period: 'al mes',
      commitment: '6 meses mínimo',
      savings: null,
      popular: false,
      features: [
        'Acceso a 2 canchas privadas',
        '1 horario prime gratis/semana',
        'Reservas regulares a $100',
        'Liga de miércoles incluida',
        '50% OFF eventos privados',
        'Instructores sin comisión',
      ],
    },
    {
      name: 'Plan Anual',
      price: '3,000',
      period: 'al mes',
      commitment: '12 meses',
      savings: 'Ahorras $6,000 al año',
      popular: true,
      features: [
        'Todos los beneficios del plan semestral',
        '$500 menos al mes',
        'Prioridad en eventos especiales',
        'Acceso a torneos exclusivos',
        'Descuento acumulable',
        '1 mes gratis al renovar',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center p-4">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-8">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Tu spot te está esperando - Solo 40 lugares</span>
            </div>

            <Logo size="xl" className="mx-auto mb-6" />

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
              Esto es para ti,
              <br />
              <span className="text-primary">eres parte de la Family</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Sabemos que vives por el padel tanto como nosotros. Por eso creamos este espacio solo para quienes
              respiran, sienten y viven este deporte. <span className="text-primary">Bienvenido a casa.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-2xl shadow-primary/30 flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                Iniciar Sesión
                <ChevronRight className="w-5 h-5" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#pricing"
                className="px-8 py-4 bg-card border-2 border-border rounded-xl font-bold text-lg hover:border-primary/50 transition-colors"
              >
                Ver Planes
              </motion.a>
            </div>

            <div className="flex flex-wrap gap-8 justify-center text-center">
              <div>
                <p className="text-4xl font-bold text-primary">40</p>
                <p className="text-sm text-muted-foreground">De nosotros</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-secondary">2</p>
                <p className="text-sm text-muted-foreground">Canchas solo tuyas</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent">7-23</p>
                <p className="text-sm text-muted-foreground">Todos los días</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Lo que es tuyo cuando entras a la <span className="text-primary">Family</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              No son beneficios, es tu estilo de vida
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all"
              >
                <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Elige tu <span className="text-primary">Compromiso</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Sabemos que cuando encuentras tu lugar, te quedas. Por eso te premiamos por quedarte más tiempo.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
              <CreditCard className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">Págalo como te acomode - 6 MSI disponibles</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative rounded-3xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-2 border-primary shadow-2xl shadow-primary/20'
                    : 'bg-card border-2 border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 px-4 py-1.5 bg-primary text-primary-foreground rounded-full font-bold text-sm">
                      <Star className="w-4 h-4" />
                      Más Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-black text-primary">${plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{plan.commitment}</p>
                  {plan.savings && (
                    <div className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold">
                      {plan.savings}
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="p-1 bg-primary/10 rounded-full flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onGetStarted}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90'
                      : 'bg-muted hover:bg-muted/70'
                  }`}
                >
                  {plan.popular ? '🔥 Este es el bueno' : 'Quiero este'}
                </motion.button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-block bg-card border border-border rounded-2xl p-6 max-w-2xl">
              <div className="flex items-center gap-3 justify-center mb-4">
                <CreditCard className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-bold">Pago Flexible</h3>
              </div>
              <p className="text-muted-foreground">
                Acepta todas las tarjetas de crédito y débito. Opción de{' '}
                <span className="text-accent font-semibold">6 meses sin intereses</span> disponible.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ya sabes que este es{' '}
              <span className="text-primary">tu lugar</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              No esperes a que se llenen los 40 spots. La familia te está esperando, pero el cupo no dura para siempre.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-12 py-5 bg-primary text-primary-foreground rounded-xl font-bold text-xl shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-colors inline-flex items-center gap-3"
            >
              Sí, quiero mi lugar
              <ChevronRight className="w-6 h-6" />
            </motion.button>
            <p className="mt-4 text-sm text-muted-foreground">
              🔥 Solo 40 lugares disponibles
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Logo size="sm" />
            
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            © 2026 PadelFamily. Hecho por jugadores, para jugadores.
          </p>
          <button
            onClick={onAdminClick}
            className="text-xs text-muted-foreground/50 hover:text-primary transition-colors"
          >
            Acceso Administrativo
          </button>
        </div>
      </footer>

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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
