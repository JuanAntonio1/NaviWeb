# 🚀 Guía Completa para Subir tu Sitio de Navidad a Netlify

## 📋 Índice
1. [Preparación del Proyecto](#preparación-del-proyecto)
2. [Configuración de Netlify](#configuración-de-netlify)
3. [Deployment Manual](#deployment-manual)
4. [Configuración de Base de Datos](#configuración-de-base-de-datos)
5. [Variables de Entorno](#variables-de-entorno)
6. [Dominio Personalizado (Opcional)](#dominio-personalizado)
7. [Troubleshooting](#troubleshooting)

---

## 📦 Preparación del Proyecto

### 1. Archivos Necesarios para Netlify

Tu proyecto ya está casi listo. Solo necesitas crear algunos archivos adicionales:

#### **netlify.toml** (Configuración de Netlify)
```toml
[build]
  publish = "."
  
[dev]
  command = "node server.js"
  port = 3000

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

#### **_redirects** (Para Single Page Applications)
```
/api/* /.netlify/functions/:splat 200
/* /index.html 200
```

### 2. Estructura Final del Proyecto
```
navidad/
├── index.html
├── style.css
├── app.js
├── server.js
├── package.json
├── netlify.toml
├── _redirects
├── icons/
├── img/
└── README.md
```

---

## 🔧 Configuración de Netlify

### Paso 1: Crear una Cuenta en Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en "Sign up" 
3. Regístrate con GitHub, GitLab, Bitbucket o email

### Paso 2: Subir tu Proyecto

#### **Opción A: Drag & Drop (Más Fácil)**

1. **Preparar archivos:**
   - Comprime toda tu carpeta `navidad` en un archivo ZIP
   - O simplemente selecciona todos los archivos de la carpeta

2. **Subir a Netlify:**
   - En el dashboard de Netlify, encuentra la sección "Deploy"
   - Arrastra tu archivo ZIP o carpeta al área que dice "Drag and drop your site output folder here"
   - Netlify automáticamente subirá y desplegará tu sitio

3. **¡Listo!**
   - En unos minutos tendrás una URL como: `https://amazing-name-123456.netlify.app`

#### **Opción B: Con Git (Más Profesional)**

1. **Crear repositorio en GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Christmas website"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/navidad-website.git
   git push -u origin main
   ```

2. **Conectar con Netlify:**
   - En Netlify, click "New site from Git"
   - Autoriza GitHub
   - Selecciona tu repositorio
   - Configuración automática detectada

---

## 🗄️ Configuración de Base de Datos

### Problema: SQLite no funciona en Netlify
Netlify es un servicio de hosting estático, por lo que no puede ejecutar SQLite. Necesitamos usar una base de datos en línea.

### Solución: MongoDB Atlas (Gratis)

#### 1. Crear cuenta en MongoDB Atlas
1. Ve a [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (M0 Sandbox - Free)

#### 2. Obtener URL de conexión
1. En Atlas, ve a "Connect" > "Connect your application"
2. Copia la URL que se ve así: `mongodb+srv://usuario:<password>@cluster.mongodb.net/navidad`

#### 3. Actualizar server.js para MongoDB
```javascript
// Reemplazar SQLite con MongoDB
const mongoose = require('mongoose');

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI || 'tu-url-de-mongodb');

// Esquemas
const wishSchema = new mongoose.Schema({
    name: String,
    wish: String,
    timestamp: { type: Date, default: Date.now }
});

const visitorSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    ip: String
});

const Wish = mongoose.model('Wish', wishSchema);
const Visitor = mongoose.model('Visitor', visitorSchema);

// Actualizar endpoints para usar MongoDB
app.post('/api/wishes', async (req, res) => {
    try {
        const wish = new Wish(req.body);
        await wish.save();
        res.json({ success: true, wish });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/wishes', async (req, res) => {
    try {
        const wishes = await Wish.find().sort({ timestamp: -1 });
        res.json({ success: true, wishes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
```

#### 4. Actualizar package.json
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.7.0",
    "mongoose": "^7.5.0"
  }
}
```

---

## 🔐 Variables de Entorno

### En Netlify Dashboard:
1. Ve a tu sitio > "Site settings" > "Environment variables"
2. Agrega:
   - `MONGODB_URI`: `mongodb+srv://usuario:password@cluster.mongodb.net/navidad`
   - `NODE_ENV`: `production`

---

## 🌐 Dominio Personalizado (Opcional)

### Si tienes un dominio propio:
1. En Netlify: "Domain settings" > "Add custom domain"
2. Ingresa tu dominio: `tu-sitio-navidad.com`
3. Configura DNS en tu proveedor de dominio:
   ```
   Type: CNAME
   Name: www
   Value: tu-sitio.netlify.app
   
   Type: A
   Name: @
   Value: 104.198.14.52
   ```

---

## 🛠️ Troubleshooting

### Problemas Comunes:

#### 1. **"Site not loading"**
- Verifica que `index.html` esté en la raíz
- Revisa que no haya errores en la consola del navegador

#### 2. **"API endpoints not working"**
- Netlify no ejecuta Node.js automáticamente
- Necesitas convertir a Netlify Functions o usar un servicio externo

#### 3. **"Database errors"**
- SQLite no funciona en Netlify
- Usa MongoDB Atlas como se explicó arriba

#### 4. **"Build failed"**
- Revisa los logs en Netlify Dashboard > Deploy logs
- Asegúrate que `package.json` esté completo

---

## 📱 Versión Simplificada (Solo Frontend)

### Si quieres algo súper rápido sin base de datos:

1. **Modifica app.js** para usar localStorage solamente:
```javascript
// Comentar todas las llamadas a API
// Usar solo localStorage para los deseos
function addWish() {
    const wishText = document.getElementById('wish-text').value;
    if (wishText.trim()) {
        const wishes = JSON.parse(localStorage.getItem('wishes') || '[]');
        wishes.push({
            text: wishText,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('wishes', JSON.stringify(wishes));
        showNotification('¡Deseo agregado! 🎄', 'success');
        document.getElementById('wish-text').value = '';
    }
}
```

2. **Sube solo los archivos frontend:**
   - index.html
   - style.css  
   - app.js (modificado)
   - icons/
   - img/

---

## 🎉 ¡Resultado Final!

Una vez completado, tendrás:
- ✅ Sitio web completamente funcional
- ✅ URL pública accesible desde cualquier lugar
- ✅ Diseño responsive para móviles
- ✅ Base de datos en línea (si usaste MongoDB)
- ✅ SSL automático (HTTPS)
- ✅ CDN global para carga rápida

### Tu sitio estará disponible en una URL como:
`https://magical-christmas-site-123.netlify.app`

---

## 📞 Necesitas Ayuda?

Si tienes problemas:
1. Revisa los logs de deploy en Netlify
2. Usa la consola del navegador para ver errores
3. Verifica que todos los archivos estén subidos correctamente

**¡Tu sitio navideño estará en línea y listo para compartir con el mundo! 🎄✨**