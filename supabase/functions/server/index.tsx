import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { sendWelcomeEmail } from "./email.tsx";

const app = new Hono();

// Supabase client helper
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
};

const getSupabaseClientWithAuth = (accessToken: string) => {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
};

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-78235a30/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ AUTH ROUTES ============

// Sign up new member (DESHABILITADO - solo admin puede crear usuarios)
app.post("/make-server-78235a30/signup", async (c) => {
  return c.json({ error: "El registro público está deshabilitado. Contacta al administrador." }, 403);

  /* CÓDIGO ORIGINAL COMENTADO
  try {
    const { email, password, nombre, telefono, plan } = await c.req.json();

    if (!email || !password || !nombre || !plan) {
      return c.json({ error: "Faltan campos requeridos" }, 400);
    }

    const supabase = getSupabaseClient();

    // Verificar si el usuario ya existe en la tabla miembros
    const { data: existingMember } = await supabase
      .from("miembros")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (existingMember) {
      return c.json({ error: "Este email ya está registrado. Por favor inicia sesión." }, 400);
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nombre, telefono, plan },
    });

    if (authError) {
      console.log("Auth error during signup:", authError);

      // Si el usuario ya existe en Auth, dar un mensaje más claro
      if (authError.message.includes("already been registered")) {
        return c.json({ error: "Este email ya está registrado. Por favor inicia sesión." }, 400);
      }

      return c.json({ error: authError.message }, 400);
    }

    // Calcular fecha fin según el plan
    const fechaInicio = new Date();
    const fechaFin = new Date();
    if (plan === 'semestral') {
      fechaFin.setMonth(fechaFin.getMonth() + 6);
    } else {
      fechaFin.setFullYear(fechaFin.getFullYear() + 1);
    }

    // Crear miembro en la tabla miembros
    const { data: miembroData, error: miembroError } = await supabase
      .from("miembros")
      .insert({
        id: authData.user.id,
        email,
        nombre,
        telefono,
        plan,
        fecha_inicio: fechaInicio.toISOString().split('T')[0],
        fecha_fin: fechaFin.toISOString().split('T')[0],
        activo: true,
      })
      .select()
      .single();

    if (miembroError) {
      console.log("Member creation error:", miembroError);

      // Si falla crear el miembro, eliminar el usuario de Auth para mantener consistencia
      await supabase.auth.admin.deleteUser(authData.user.id);

      return c.json({ error: "Error al crear el perfil: " + miembroError.message }, 400);
    }

    return c.json({
      user: authData.user,
      miembro: miembroData,
      message: "Usuario creado exitosamente"
    });

  } catch (error) {
    console.log("Signup error:", error);
    return c.json({ error: "Error al crear usuario. Por favor intenta de nuevo." }, 500);
  }
  */
});

// Admin login
app.post("/make-server-78235a30/admin/login", async (c) => {
  try {
    const { username, password } = await c.req.json();

    // Hardcoded admin credentials (change these!)
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "padel2026admin";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return c.json({
        success: true,
        role: "admin",
        username: ADMIN_USERNAME
      });
    }

    return c.json({ error: "Credenciales incorrectas" }, 401);
  } catch (error) {
    console.log("Admin login error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Get all members (admin only)
app.get("/make-server-78235a30/admin/members", async (c) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("miembros")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Get all members error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.log("Get all members error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Get all bookings (admin only)
app.get("/make-server-78235a30/admin/bookings", async (c) => {
  try {
    const startDate = c.req.query("start_date");
    const endDate = c.req.query("end_date");

    const supabase = getSupabaseClient();

    let query = supabase
      .from("reservas")
      .select(`
        *,
        miembros (
          nombre,
          email
        )
      `)
      .order("fecha", { ascending: true })
      .order("hora", { ascending: true });

    if (startDate) {
      query = query.gte("fecha", startDate);
    }
    if (endDate) {
      query = query.lte("fecha", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.log("Get all bookings error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.log("Get all bookings error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Create member (admin only)
app.post("/make-server-78235a30/admin/members", async (c) => {
  try {
    const { email, password, nombre, telefono, plan } = await c.req.json();

    if (!email || !password || !nombre || !plan) {
      return c.json({ error: "Faltan campos requeridos" }, 400);
    }

    const supabase = getSupabaseClient();

    // Verificar si el usuario ya existe
    const { data: existingMember } = await supabase
      .from("miembros")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (existingMember) {
      return c.json({ error: "Este email ya está registrado" }, 400);
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nombre, telefono },
    });

    if (authError) {
      console.log("Auth error during member creation:", authError);
      return c.json({ error: authError.message }, 400);
    }

    // Calcular fecha fin según el plan
    const fechaInicio = new Date();
    const fechaFin = new Date();
    if (plan === 'semestral') {
      fechaFin.setMonth(fechaFin.getMonth() + 6);
    } else {
      fechaFin.setFullYear(fechaFin.getFullYear() + 1);
    }

    // Crear miembro en la tabla miembros
    const { data: miembroData, error: miembroError } = await supabase
      .from("miembros")
      .insert({
        id: authData.user.id,
        email,
        nombre,
        telefono,
        plan,
        fecha_inicio: fechaInicio.toISOString().split('T')[0],
        fecha_fin: fechaFin.toISOString().split('T')[0],
        activo: true,
      })
      .select()
      .single();

    if (miembroError) {
      console.log("Member creation error:", miembroError);
      await supabase.auth.admin.deleteUser(authData.user.id);
      return c.json({ error: "Error al crear el perfil: " + miembroError.message }, 400);
    }

    // Enviar email de bienvenida (opcional - requiere configurar RESEND_API_KEY)
    try {
      await sendWelcomeEmail({
        email,
        nombre,
        password,
        plan,
        fechaFin: fechaFin.toISOString().split('T')[0],
      });
    } catch (emailError) {
      console.error('Error enviando email de bienvenida:', emailError);
      // No fallar la creación del usuario si el email falla
    }

    return c.json({
      user: authData.user,
      miembro: miembroData,
      message: "Miembro creado exitosamente. Se ha enviado un email con las credenciales."
    });

  } catch (error) {
    console.log("Create member error:", error);
    return c.json({ error: "Error al crear miembro: " + error.message }, 500);
  }
});

// Update member (admin only)
app.put("/make-server-78235a30/admin/members/:id", async (c) => {
  try {
    const memberId = c.req.param("id");
    const updates = await c.req.json();

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("miembros")
      .update(updates)
      .eq("id", memberId)
      .select()
      .single();

    if (error) {
      console.log("Update member error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.log("Update member error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete member (admin only)
app.delete("/make-server-78235a30/admin/members/:id", async (c) => {
  try {
    const memberId = c.req.param("id");
    const supabase = getSupabaseClient();

    // Eliminar de auth
    const { error: authError } = await supabase.auth.admin.deleteUser(memberId);
    if (authError) {
      console.log("Delete user from auth error:", authError);
    }

    // Eliminar de miembros (cascade eliminará reservas)
    const { error } = await supabase
      .from("miembros")
      .delete()
      .eq("id", memberId);

    if (error) {
      console.log("Delete member error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: "Miembro eliminado exitosamente" });
  } catch (error) {
    console.log("Delete member error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Get member info
app.get("/make-server-78235a30/member/:id", async (c) => {
  try {
    const memberId = c.req.param("id");
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("miembros")
      .select("*")
      .eq("id", memberId)
      .single();

    if (error) {
      console.log("Get member error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.log("Get member error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ============ BOOKING ROUTES ============

// Get bookings for a date range
app.get("/make-server-78235a30/bookings", async (c) => {
  try {
    const startDate = c.req.query("start_date");
    const endDate = c.req.query("end_date");

    if (!startDate || !endDate) {
      return c.json({ error: "start_date y end_date son requeridos" }, 400);
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("reservas")
      .select(`
        *,
        miembros (
          nombre,
          email
        )
      `)
      .gte("fecha", startDate)
      .lte("fecha", endDate)
      .eq("estado", "confirmada")
      .order("fecha", { ascending: true })
      .order("hora", { ascending: true });

    if (error) {
      console.log("Get bookings error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.log("Get bookings error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Get member's bookings
app.get("/make-server-78235a30/bookings/member/:memberId", async (c) => {
  try {
    const memberId = c.req.param("memberId");
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("reservas")
      .select("*")
      .eq("miembro_id", memberId)
      .eq("estado", "confirmada")
      .gte("fecha", new Date().toISOString().split('T')[0])
      .order("fecha", { ascending: true })
      .order("hora", { ascending: true });

    if (error) {
      console.log("Get member bookings error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.log("Get member bookings error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Create booking
app.post("/make-server-78235a30/bookings", async (c) => {
  try {
    const { miembro_id, cancha, fecha, hora, precio, tipo } = await c.req.json();

    if (!miembro_id || !cancha || !fecha || !hora || precio === undefined || !tipo) {
      return c.json({ error: "Faltan campos requeridos" }, 400);
    }

    const supabase = getSupabaseClient();

    // Verificar si el slot ya está ocupado
    const { data: existing, error: checkError } = await supabase
      .from("reservas")
      .select("*")
      .eq("cancha", cancha)
      .eq("fecha", fecha)
      .eq("hora", hora)
      .eq("estado", "confirmada")
      .maybeSingle();

    if (checkError) {
      console.log("Check booking error:", checkError);
      return c.json({ error: checkError.message }, 400);
    }

    if (existing) {
      return c.json({ error: "Este horario ya está reservado" }, 400);
    }

    // Verificar límite de horarios prime (solo 1 por semana)
    if (tipo === 'prime') {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const { data: primeBookings, error: primeError } = await supabase
        .from("reservas")
        .select("*")
        .eq("miembro_id", miembro_id)
        .eq("tipo", "prime")
        .eq("estado", "confirmada")
        .gte("fecha", weekStart.toISOString().split('T')[0])
        .lte("fecha", weekEnd.toISOString().split('T')[0]);

      if (primeError) {
        console.log("Check prime bookings error:", primeError);
        return c.json({ error: primeError.message }, 400);
      }

      if (primeBookings && primeBookings.length >= 1) {
        return c.json({ error: "Solo puedes reservar 1 horario prime por semana" }, 400);
      }
    }

    // Crear la reserva
    const { data, error } = await supabase
      .from("reservas")
      .insert({
        miembro_id,
        cancha,
        fecha,
        hora,
        precio,
        tipo,
        estado: "confirmada",
      })
      .select()
      .single();

    if (error) {
      console.log("Create booking error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.log("Create booking error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Cancel booking
app.delete("/make-server-78235a30/bookings/:id", async (c) => {
  try {
    const bookingId = c.req.param("id");
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("reservas")
      .update({ estado: "cancelada" })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) {
      console.log("Cancel booking error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.log("Cancel booking error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ============ SCHEDULE ROUTES ============

// Get available slots for a date
app.get("/make-server-78235a30/schedule/:fecha", async (c) => {
  try {
    const fecha = c.req.param("fecha");
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("horarios_disponibles")
      .select("*")
      .eq("fecha", fecha);

    if (error) {
      console.log("Get schedule error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || []);
  } catch (error) {
    console.log("Get schedule error:", error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);