import { motion } from 'motion/react';
import { Home, Calendar, LogOut } from 'lucide-react';
import { Logo } from './Logo';

interface NavigationProps {
  currentView: 'home' | 'bookings';
  onViewChange: (view: 'home' | 'bookings') => void;
  onLogout: () => void;
  username: string;
}

export function Navigation({ currentView, onViewChange, onLogout, username }: NavigationProps) {
  return (
    <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="text-xl font-bold">
                Padel<span className="text-primary">Family</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange('home')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium
                  ${currentView === 'home'
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'hover:bg-muted'
                  }
                `}
              >
                <Home className="w-4 h-4" />
                Inicio
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange('bookings')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium
                  ${currentView === 'bookings'
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'hover:bg-muted'
                  }
                `}
              >
                <Calendar className="w-4 h-4" />
                Reservas
              </motion.button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm">{username}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewChange('home')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-medium
              ${currentView === 'home'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'hover:bg-muted'
              }
            `}
          >
            <Home className="w-4 h-4" />
            Inicio
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewChange('bookings')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-medium
              ${currentView === 'bookings'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'hover:bg-muted'
              }
            `}
          >
            <Calendar className="w-4 h-4" />
            Reservas
          </motion.button>
        </nav>
      </div>
    </div>
  );
}
