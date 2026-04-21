import { projectId, publicAnonKey } from './supabase/info';

const SUPABASE_URL = `https://${projectId}.supabase.co`;
const API_BASE = `${SUPABASE_URL}/functions/v1/make-server-78235a30`;

export interface AdminMember {
  id: string;
  email: string;
  nombre: string;
  telefono?: string;
  plan: 'semestral' | 'anual';
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminBooking {
  id: string;
  miembro_id: string;
  cancha: number;
  fecha: string;
  hora: string;
  precio: number;
  tipo: 'prime' | 'regular';
  estado: 'confirmada' | 'cancelada';
  created_at: string;
  miembros?: {
    nombre: string;
    email: string;
  };
}

// Admin auth
export async function adminLogin(username: string, password: string) {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al iniciar sesión como administrador');
  }

  return response.json();
}

// Get all members
export async function getAllMembers(): Promise<AdminMember[]> {
  const response = await fetch(`${API_BASE}/admin/members`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener miembros');
  }

  return response.json();
}

// Get all bookings
export async function getAllBookings(startDate?: string, endDate?: string): Promise<AdminBooking[]> {
  let url = `${API_BASE}/admin/bookings`;
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (params.toString()) url += `?${params.toString()}`;

  const response = await fetch(url, {
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

// Create member
export async function createMember(
  email: string,
  password: string,
  nombre: string,
  telefono: string,
  plan: 'semestral' | 'anual'
): Promise<AdminMember> {
  const response = await fetch(`${API_BASE}/admin/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ email, password, nombre, telefono, plan }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear miembro');
  }

  const result = await response.json();
  return result.miembro;
}

// Update member
export async function updateMember(memberId: string, updates: Partial<AdminMember>): Promise<AdminMember> {
  const response = await fetch(`${API_BASE}/admin/members/${memberId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar miembro');
  }

  return response.json();
}

// Delete member
export async function deleteMember(memberId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/admin/members/${memberId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al eliminar miembro');
  }
}

// Admin session management
export function saveAdminSession(username: string) {
  localStorage.setItem('padel_admin', username);
}

export function getAdminSession() {
  return localStorage.getItem('padel_admin');
}

export function clearAdminSession() {
  localStorage.removeItem('padel_admin');
}
