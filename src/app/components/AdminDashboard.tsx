import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Calendar,
  UserPlus,
  LogOut,
  Trash2,
  Edit,
  Check,
  X,
  Shield,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import {
  getAllMembers,
  getAllBookings,
  createMember,
  updateMember,
  deleteMember,
  clearAdminSession,
  AdminMember,
  AdminBooking,
} from '../../utils/admin';
import { Logo } from './Logo';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<'members' | 'bookings' | 'create'>('members');
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create member form
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [newMemberNombre, setNewMemberNombre] = useState('');
  const [newMemberTelefono, setNewMemberTelefono] = useState('');
  const [newMemberPlan, setNewMemberPlan] = useState<'semestral' | 'anual'>('anual');
  const [creatingMember, setCreatingMember] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Date filters for bookings
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      if (currentView === 'members' || currentView === 'create') {
        const membersData = await getAllMembers();
        setMembers(membersData);
      }

      if (currentView === 'bookings') {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        const weekAhead = new Date(today);
        weekAhead.setDate(today.getDate() + 7);

        const start = startDate || weekAgo.toISOString().split('T')[0];
        const end = endDate || weekAhead.toISOString().split('T')[0];

        const bookingsData = await getAllBookings(start, end);
        setBookings(bookingsData);
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setCreatingMember(true);

    try {
      if (!newMemberEmail || !newMemberPassword || !newMemberNombre || !newMemberPlan) {
        setError('Por favor completa todos los campos requeridos');
        setCreatingMember(false);
        return;
      }

      if (newMemberPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setCreatingMember(false);
        return;
      }

      await createMember(
        newMemberEmail,
        newMemberPassword,
        newMemberNombre,
        newMemberTelefono,
        newMemberPlan
      );

      setSuccessMessage('Miembro creado exitosamente');
      setNewMemberEmail('');
      setNewMemberPassword('');
      setNewMemberNombre('');
      setNewMemberTelefono('');
      setNewMemberPlan('anual');

      // Recargar miembros
      const membersData = await getAllMembers();
      setMembers(membersData);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Error creating member:', err);
      setError(err.message);
    } finally {
      setCreatingMember(false);
    }
  }

  async function handleDeleteMember(memberId: string, memberName: string) {
    if (!confirm(`¿Estás seguro de eliminar a ${memberName}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteMember(memberId);
      setMembers(members.filter((m) => m.id !== memberId));
      setSuccessMessage('Miembro eliminado exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Error deleting member:', err);
      setError(err.message);
    }
  }

  async function handleToggleActive(member: AdminMember) {
    try {
      await updateMember(member.id, { activo: !member.activo });
      setMembers(
        members.map((m) => (m.id === member.id ? { ...m, activo: !m.activo } : m))
      );
    } catch (err: any) {
      console.error('Error updating member:', err);
      setError(err.message);
    }
  }

  function handleLogout() {
    clearAdminSession();
    onLogout();
  }

  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter((m) => m.activo).length,
    totalBookings: bookings.filter((b) => b.estado === 'confirmada').length,
    revenue: bookings
      .filter((b) => b.estado === 'confirmada')
      .reduce((sum, b) => sum + b.precio, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <div>
                <h1 className="text-2xl font-bold">
                  Panel <span className="text-secondary">Administrativo</span>
                </h1>
                <p className="text-sm text-muted-foreground">PadelFamily</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
                <p className="text-sm text-muted-foreground">Miembros Totales</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeMembers}</p>
                <p className="text-sm text-muted-foreground">Activos</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
                <p className="text-sm text-muted-foreground">Reservas</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Ingresos</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('members')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
              currentView === 'members'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-muted hover:bg-muted/70'
            }`}
          >
            <Users className="w-4 h-4" />
            Miembros
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
              currentView === 'bookings'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-muted hover:bg-muted/70'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Reservas
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('create')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
              currentView === 'create'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-muted hover:bg-muted/70'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Crear Miembro
          </motion.button>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3"
            >
              <X className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3"
            >
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-primary">{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {currentView === 'members' && (
              <MembersView
                key="members"
                members={members}
                onDelete={handleDeleteMember}
                onToggleActive={handleToggleActive}
              />
            )}

            {currentView === 'bookings' && (
              <BookingsView
                key="bookings"
                bookings={bookings}
                onRefresh={loadData}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            )}

            {currentView === 'create' && (
              <CreateMemberView
                key="create"
                email={newMemberEmail}
                password={newMemberPassword}
                nombre={newMemberNombre}
                telefono={newMemberTelefono}
                plan={newMemberPlan}
                loading={creatingMember}
                onEmailChange={setNewMemberEmail}
                onPasswordChange={setNewMemberPassword}
                onNombreChange={setNewMemberNombre}
                onTelefonoChange={setNewMemberTelefono}
                onPlanChange={setNewMemberPlan}
                onSubmit={handleCreateMember}
              />
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// Members View Component
function MembersView({
  members,
  onDelete,
  onToggleActive,
}: {
  members: AdminMember[];
  onDelete: (id: string, name: string) => void;
  onToggleActive: (member: AdminMember) => void;
}) {
  if (!members || members.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-card border border-border rounded-2xl p-12 text-center"
      >
        <p className="text-muted-foreground">No hay miembros registrados</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Teléfono</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Plan</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Vence</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <motion.tr
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-t border-border hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4">{member.nombre}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{member.email}</td>
                <td className="px-6 py-4 text-sm">{member.telefono || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      member.plan === 'anual'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary/10 text-secondary'
                    }`}
                  >
                    {member.plan === 'anual' ? 'Anual' : 'Semestral'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono">
                  {new Date(member.fecha_fin).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleActive(member)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      member.activo
                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
                        : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    }`}
                  >
                    {member.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDelete(member.id, member.nombre)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// Bookings View Component
function BookingsView({
  bookings,
  onRefresh,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: {
  bookings: AdminBooking[];
  onRefresh: () => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}) {
  const hasBookings = bookings && bookings.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Filters */}
      <div className="mb-6 flex gap-4 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-2 text-sm">Fecha Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-2 text-sm">Fecha Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Filtrar
        </button>
      </div>

      {!hasBookings ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">No hay reservas en este período</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Hora</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Cancha</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Miembro</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Precio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-sm">
                    {new Date(booking.fecha).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold">{booking.hora}</td>
                  <td className="px-6 py-4">Cancha {booking.cancha}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{booking.miembros?.nombre}</p>
                      <p className="text-xs text-muted-foreground">{booking.miembros?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        booking.tipo === 'prime'
                          ? 'bg-accent/20 text-accent'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {booking.tipo === 'prime' ? '⭐ Prime' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {booking.precio === 0 ? 'GRATIS' : `$${booking.precio}`}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        booking.estado === 'confirmada'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {booking.estado === 'confirmada' ? 'Confirmada' : 'Cancelada'}
                    </span>
                  </td>
                </motion.tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Create Member View Component
function CreateMemberView({
  email,
  password,
  nombre,
  telefono,
  plan,
  loading,
  onEmailChange,
  onPasswordChange,
  onNombreChange,
  onTelefonoChange,
  onPlanChange,
  onSubmit,
}: {
  email: string;
  password: string;
  nombre: string;
  telefono: string;
  plan: 'semestral' | 'anual';
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onNombreChange: (value: string) => void;
  onTelefonoChange: (value: string) => void;
  onPlanChange: (value: 'semestral' | 'anual') => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-card border border-border rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Crear Nuevo Miembro</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Contraseña *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Nombre Completo *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => onNombreChange(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => onTelefonoChange(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              placeholder="+52 123 456 7890"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Plan de Membresía *</label>
            <select
              value={plan}
              onChange={(e) => onPlanChange(e.target.value as 'semestral' | 'anual')}
              disabled={loading}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              required
            >
              <option value="anual">Plan Anual - $3,000/mes (12 meses)</option>
              <option value="semestral">Plan Semestral - $3,500/mes (6 meses)</option>
            </select>
          </div>

          <motion.button
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando miembro...' : 'Crear Miembro'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
