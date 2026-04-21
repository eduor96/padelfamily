import { projectId, publicAnonKey } from './supabase/info';

const SUPABASE_URL = `https://${projectId}.supabase.co`;
const API_BASE = `${SUPABASE_URL}/functions/v1/make-server-78235a30`;

export interface Member {
  id: string;
  email: string;
  nombre: string;
  telefono?: string;
  plan: 'semestral' | 'anual';
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export interface Booking {
  id: string;
  miembro_id: string;
  cancha: number;
  fecha: string;
  hora: string;
  precio: number;
  tipo: 'prime' | 'regular';
  estado: 'confirmada' | 'cancelada';
  miembros?: {
    nombre: string;
    email: string;
  };
}

// Auth functions
export async function signUp(email: string, password: string, nombre: string, telefono: string, plan: 'semestral' | 'anual') {
  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ email, password, nombre, telefono, plan }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear usuario');
  }

  return response.json();
}

export async function signIn(email: string, password: string) {
  // Usar Supabase Auth directamente desde el cliente
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': publicAnonKey,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Error al iniciar sesión');
  }

  return response.json();
}

export async function getMember(memberId: string) {
  const response = await fetch(`${API_BASE}/member/${memberId}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener miembro');
  }

  return response.json() as Promise<Member>;
}

// Booking functions
export async function getBookings(startDate: string, endDate: string): Promise<Booking[]> {
  const response = await fetch(`${API_BASE}/bookings?start_date=${startDate}&end_date=${endDate}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener reservas');
  }

  return response.json();
}

export async function getMemberBookings(memberId: string): Promise<Booking[]> {
  const response = await fetch(`${API_BASE}/bookings/member/${memberId}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener reservas del miembro');
  }

  return response.json();
}

export async function createBooking(
  miembro_id: string,
  cancha: number,
  fecha: string,
  hora: string,
  precio: number,
  tipo: 'prime' | 'regular'
): Promise<Booking> {
  const response = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ miembro_id, cancha, fecha, hora, precio, tipo }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear reserva');
  }

  return response.json();
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al cancelar reserva');
  }

  return response.json();
}

// Session management
export function saveSession(userId: string, accessToken: string, member: Member) {
  localStorage.setItem('padel_user_id', userId);
  localStorage.setItem('padel_access_token', accessToken);
  localStorage.setItem('padel_member', JSON.stringify(member));
}

export function getSession() {
  const userId = localStorage.getItem('padel_user_id');
  const accessToken = localStorage.getItem('padel_access_token');
  const memberData = localStorage.getItem('padel_member');

  if (!userId || !accessToken || !memberData) {
    return null;
  }

  return {
    userId,
    accessToken,
    member: JSON.parse(memberData) as Member,
  };
}

export function clearSession() {
  localStorage.removeItem('padel_user_id');
  localStorage.removeItem('padel_access_token');
  localStorage.removeItem('padel_member');
}
