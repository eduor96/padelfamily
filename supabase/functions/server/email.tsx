// Email service usando Resend API (opcional)
// Instala Resend: npm install resend

interface WelcomeEmailData {
  email: string;
  nombre: string;
  password: string;
  plan: 'semestral' | 'anual';
  fechaFin: string;
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY no configurada. Email no enviado.');
    return;
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0a0f0d 0%, #1e2822 100%); color: #9dff00; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials { background: white; padding: 20px; border-left: 4px solid #9dff00; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #9dff00; color: #0a0f0d; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .highlight { color: #9dff00; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a PadelFamily! 🎾</h1>
          </div>
          <div class="content">
            <h2>Hola ${data.nombre},</h2>

            <p>¡Felicidades! Tu membresía en <strong>PadelFamily</strong> ha sido activada exitosamente.</p>

            <div class="credentials">
              <h3>Tus Credenciales de Acceso:</h3>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Contraseña:</strong> ${data.password}</p>
              <p><strong>Plan:</strong> ${data.plan === 'anual' ? 'Anual - $3,000/mes' : 'Semestral - $3,500/mes'}</p>
              <p><strong>Membresía válida hasta:</strong> ${new Date(data.fechaFin).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>

            <h3>Beneficios de tu Membresía:</h3>
            <ul>
              <li>✅ Acceso exclusivo a 2 canchas privadas</li>
              <li>✅ 1 horario prime (7pm-9pm) GRATIS por semana</li>
              <li>✅ Reservas regulares a solo $100/hora</li>
              <li>✅ Inscripción gratuita a la Liga de los Miércoles</li>
              <li>✅ 50% OFF en eventos privados</li>
              <li>✅ Instructores sin comisión del club</li>
            </ul>

            <p style="text-align: center;">
              <a href="TU_URL_DE_PRODUCCION" class="button">Acceder al Sistema</a>
            </p>

            <p><strong>Horarios:</strong> Lunes a Domingo de 7:00-13:00 y 16:00-23:30</p>

            <p style="color: #ff6b35; font-weight: bold;">
              ⚠️ Por seguridad, te recomendamos cambiar tu contraseña después del primer inicio de sesión.
            </p>
          </div>

          <div class="footer">
            <p>© 2026 PadelFamily - Club Privado de Padel</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PadelFamily <noreply@tudominio.com>', // Cambia esto
        to: [data.email],
        subject: '¡Bienvenido a PadelFamily! 🎾 - Tus credenciales de acceso',
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error enviando email:', error);
      throw new Error('Error al enviar email');
    }

    const result = await response.json();
    console.log('Email enviado exitosamente:', result);
    return result;
  } catch (error) {
    console.error('Error en sendWelcomeEmail:', error);
    throw error;
  }
}

// Función alternativa usando Supabase Edge Functions + nodemailer
export async function sendEmailWithNodemailer(data: WelcomeEmailData) {
  // Requiere configurar SMTP en variables de entorno
  const SMTP_HOST = Deno.env.get('SMTP_HOST');
  const SMTP_USER = Deno.env.get('SMTP_USER');
  const SMTP_PASS = Deno.env.get('SMTP_PASS');

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log('Configuración SMTP incompleta. Email no enviado.');
    return;
  }

  // Implementar con tu servicio SMTP preferido
  console.log('Implementar envío con nodemailer o servicio SMTP');
}
