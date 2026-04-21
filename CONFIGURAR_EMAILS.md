# 📧 Configurar Emails Automáticos

## Opción 1: Resend (Recomendado - Más fácil)

### Paso 1: Crear cuenta en Resend
1. Ve a https://resend.com
2. Crea una cuenta gratuita (100 emails/día gratis)
3. Verifica tu dominio o usa el dominio de prueba

### Paso 2: Obtener API Key
1. Dashboard → API Keys
2. Copia tu API Key

### Paso 3: Agregar en Supabase
1. Ve a tu proyecto Supabase
2. Settings → Edge Functions → Secrets
3. Agrega: `RESEND_API_KEY` con tu API key

### Paso 4: Actualizar el email
En `/supabase/functions/server/email.tsx` línea 75:
```typescript
from: 'PadelFamily <noreply@tudominio.com>', // Cambia a tu dominio
```

### Paso 5: Desplegar
- Despliega la Edge Function desde Make
- ¡Listo! Los emails se enviarán automáticamente

---

## Opción 2: SMTP (Gmail, Outlook, etc.)

### Para Gmail:
1. Habilita "Contraseñas de aplicaciones" en tu cuenta Google
2. Genera una contraseña de aplicación

### Agregar en Supabase Secrets:
```
SMTP_HOST=smtp.gmail.com
SMTP_USER=tu@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
```

---

## Opción 3: Usar emails de Supabase (Más limitado)

### Configurar plantillas:
1. Supabase Dashboard → Authentication → Email Templates
2. Personaliza "Invite user" para cuando creas usuarios
3. En el código, usa:

```typescript
const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
  data: { nombre, telefono, plan }
});
```

---

## 📝 Contenido del Email

El email incluye:
- ✅ Mensaje de bienvenida personalizado
- ✅ Credenciales de acceso (email + contraseña)
- ✅ Detalles del plan (Anual/Semestral)
- ✅ Fecha de vencimiento
- ✅ Lista de beneficios
- ✅ Botón para acceder al sistema
- ✅ Recordatorio de cambiar contraseña

---

## 🧪 Probar

1. Configura RESEND_API_KEY en Supabase
2. Despliega la Edge Function
3. Crea un miembro desde el panel admin
4. Verifica que llegue el email

---

## ⚠️ Notas Importantes

- El envío de email es **opcional** - si falla, el usuario se crea igual
- Por defecto está comentado hasta que configures la API key
- Puedes personalizar el diseño del email en `email.tsx`
- Para producción, usa un dominio verificado en Resend
