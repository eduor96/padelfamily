-- ====================================
-- SCRIPT DE CONFIGURACIÓN SUPABASE
-- Club Privado de Padel
-- ====================================

-- Tabla de miembros del club
CREATE TABLE IF NOT EXISTS miembros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT,
  plan TEXT CHECK (plan IN ('semestral', 'anual')) NOT NULL,
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_fin DATE NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de reservas realizadas
CREATE TABLE IF NOT EXISTS reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  miembro_id UUID REFERENCES miembros(id) ON DELETE CASCADE NOT NULL,
  cancha INTEGER CHECK (cancha IN (1, 2)) NOT NULL,
  fecha DATE NOT NULL,
  hora TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  tipo TEXT CHECK (tipo IN ('prime', 'regular')) NOT NULL,
  estado TEXT CHECK (estado IN ('confirmada', 'cancelada')) DEFAULT 'confirmada',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cancha, fecha, hora, estado)
);

-- Tabla de horarios disponibles por día
CREATE TABLE IF NOT EXISTS horarios_disponibles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha DATE NOT NULL,
  cancha INTEGER CHECK (cancha IN (1, 2)) NOT NULL,
  hora TEXT NOT NULL,
  disponible BOOLEAN DEFAULT true,
  motivo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(fecha, cancha, hora)
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_reservas_miembro ON reservas(miembro_id);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_cancha_fecha ON reservas(cancha, fecha);
CREATE INDEX IF NOT EXISTS idx_horarios_fecha ON horarios_disponibles(fecha);
CREATE INDEX IF NOT EXISTS idx_horarios_cancha_fecha ON horarios_disponibles(cancha, fecha);
CREATE INDEX IF NOT EXISTS idx_miembros_email ON miembros(email);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_miembros_updated_at BEFORE UPDATE ON miembros
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON reservas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_horarios_updated_at BEFORE UPDATE ON horarios_disponibles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE miembros IS 'Miembros del club privado de Padel';
COMMENT ON TABLE reservas IS 'Reservas realizadas por los miembros';
COMMENT ON TABLE horarios_disponibles IS 'Control de disponibilidad de horarios por día';

-- ====================================
-- INSTRUCCIONES:
-- 1. Abre el SQL Editor de Supabase: https://supabase.com/dashboard/project/ochjzjphfzukebmsykkh/sql/new
-- 2. Copia TODO el contenido de este archivo
-- 3. Pégalo en el editor SQL
-- 4. Haz clic en "RUN" o presiona Ctrl+Enter
-- 5. Verifica las tablas en: https://supabase.com/dashboard/project/ochjzjphfzukebmsykkh/database/tables
-- ====================================
