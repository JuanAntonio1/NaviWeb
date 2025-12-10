# 🚀 Guía de Despliegue - Página Navideña

## 📋 Opciones de Hosting Recomendadas

### 1. 🔶 **Vercel** (Recomendado - Fácil y Gratis)

**Ventajas:**
- ✅ Despliegue automático desde GitHub
- ✅ Dominio HTTPS gratuito
- ✅ Escalabilidad automática
- ✅ CDN global

**Pasos:**
1. Sube tu código a GitHub
2. Conéctate a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. ¡Despliega automáticamente!

**Archivo necesario:** `vercel.json` (ya incluido)

---

### 2. 🟣 **Heroku** (Opción robusta)

**Ventajas:**
- ✅ Base de datos PostgreSQL gratuita
- ✅ Escalabilidad manual
- ✅ Add-ons disponibles

**Pasos:**
```bash
# 1. Instala Heroku CLI
# 2. Inicia sesión
heroku login

# 3. Crea aplicación
heroku create tu-app-navidad

# 4. Agrega PostgreSQL (opcional)
heroku addons:create heroku-postgresql:hobby-dev

# 5. Despliega
git add .
git commit -m "Deploy navidad app"
git push heroku main
```

**Archivo necesario:** `Procfile` (ya incluido)

---

### 3. 🟢 **Railway** (Moderno y simple)

**Ventajas:**
- ✅ Base de datos incluida
- ✅ Despliegue desde GitHub
- ✅ Configuración automática

**Pasos:**
1. Conecta en [railway.app](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Railway detecta Node.js automáticamente
4. ¡Listo!

---

### 4. 🟠 **Netlify + Serverless Functions**

**Para sitio estático con funciones:**
1. Sube archivos estáticos a Netlify
2. Convierte API a Netlify Functions
3. Despliega automáticamente

---

## 🗄️ Base de Datos para Producción

### Migrar de SQLite a PostgreSQL

**Para Heroku:**
```bash
# Instala pg
npm install pg

# Actualiza server.js
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

### Variables de Entorno

Crea archivo `.env`:
```env
NODE_ENV=production
DATABASE_URL=tu_url_de_base_de_datos
PORT=3000
```

---

## 🔒 Configuración de Seguridad

### Variables de Entorno de Producción

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=tu_clave_secreta_aqui
ALLOWED_ORIGINS=https://tu-dominio.com
```

### Headers de Seguridad Adicionales

El servidor ya incluye:
- ✅ Helmet para headers seguros
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Validación de entrada

---

## 📊 Monitoreo y Analytics

### Agregar Google Analytics

En `index.html` antes de `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Logs de Servidor

Para producción, considera agregar:
```bash
npm install winston
```

---

## 🚀 Comandos de Despliegue Rápido

### Vercel
```bash
npx vercel --prod
```

### Heroku
```bash
git push heroku main
```

### Railway
```bash
railway login
railway link
railway up
```

---

## 🧪 Testing Antes del Despliegue

```bash
# Prueba local
npm start

# Verifica endpoints
curl http://localhost:3000/api/wishes
curl http://localhost:3000/api/stats

# Prueba en diferentes dispositivos
# - Móvil
# - Tablet
# - Desktop
```

---

## 📱 PWA (Progressive Web App)

Para hacer tu sitio instalable, agrega en `index.html`:

```html
<link rel="manifest" href="/manifest.json">
```

Y crea `manifest.json`:
```json
{
  "name": "NaviWeb - Página Navideña",
  "short_name": "NaviWeb",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#2d8a47",
  "theme_color": "#c41e3a",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 🔄 CI/CD Automático

### GitHub Actions

Crea `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🎯 Optimizaciones de Rendimiento

### Compresión
```bash
npm install compression
```

### Caché
```javascript
app.use(express.static('public', {
  maxAge: '1d',
  etag: false
}));
```

### Minificación
```bash
npm install terser
npm install clean-css-cli
```

---

## 📞 Soporte y Mantenimiento

- **Logs:** Revisa logs del servidor regularmente
- **Backup:** Haz backup de la base de datos
- **Updates:** Mantén dependencias actualizadas
- **Monitoring:** Usa herramientas como UptimeRobot

---

¡Tu página navideña estará online en minutos! 🎄✨