# Página Navideña Interactiva 🎄

Una aplicación web navideña completa con backend, base de datos y funcionalidades interactivas.

## 🚀 Características

- ✨ **Interfaz moderna y responsiva**
- 🎄 **Animaciones navideñas interactivas**
- 💾 **Base de datos para guardar deseos navideños**
- 📊 **Sistema de estadísticas en tiempo real**
- 🔒 **Seguridad y rate limiting**
- 📱 **Compatible con dispositivos móviles**
- ⚡ **API RESTful**

## 🛠️ Tecnologías Utilizadas

### Frontend
- HTML5 semántico
- CSS3 con variables y animaciones
- JavaScript ES6+ con APIs modernas
- Google Fonts (Poppins, Dancing Script)

### Backend
- Node.js
- Express.js
- SQLite3
- Helmet (seguridad)
- CORS
- Express Rate Limit

## 📦 Instalación

### Requisitos Previos
- Node.js 16+ instalado
- npm o yarn

### Pasos de Instalación

1. **Clona o descarga el proyecto**
   ```bash
   cd navidad
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor**
   ```bash
   npm start
   ```

4. **Abre tu navegador**
   ```
   http://localhost:3000
   ```

## 🔧 Scripts Disponibles

- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor con nodemon para desarrollo
- `npm test` - Ejecuta las pruebas (por implementar)

## 📁 Estructura del Proyecto

```
navidad/
├── server.js              # Servidor principal
├── package.json           # Dependencias y scripts
├── index.html             # Página principal
├── style.css              # Estilos CSS
├── app.js                 # JavaScript del frontend
├── wishes.db              # Base de datos SQLite (se crea automáticamente)
├── icons/                 # Iconos de redes sociales
├── img/                   # Imágenes del sitio
└── # 🎄 NaviWeb - Sitio Web Navideño Interactivo ✨

![Christmas Website](https://img.shields.io/badge/Christmas-Website-red?style=for-the-badge&logo=javascript)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18+-blue?style=for-the-badge&logo=express)

## 🌟 Descripción

NaviWeb es una página web navideña interactiva que permite a los usuarios personalizar su experiencia, escribir deseos navideños y disfrutar de una hermosa interfaz con temática navideña.

### ✨ Características

- 🎨 **Diseño Moderno**: Interfaz limpia y responsive con gradientes navideños
- 🎯 **Personalización**: Los usuarios pueden ingresar su nombre para una experiencia personalizada
- 📝 **Lista de Deseos**: Sistema completo para agregar y visualizar deseos navideños
- 📊 **Estadísticas**: Contador de visitantes y deseos en tiempo real
- 🎵 **Música Navideña**: Control de audio ambiente (opcional)
- ❄️ **Efectos Visuales**: Animaciones de nieve y efectos de partículas
- 📱 **Responsive**: Optimizado para dispositivos móviles y desktop
- 🔒 **Seguro**: Headers de seguridad y rate limiting implementados

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica moderna
- **CSS3**: Custom properties, Grid, Flexbox, animaciones
- **JavaScript ES6+**: Funcionalidad interactiva y API calls

### Backend
- **Node.js**: Runtime del servidor
- **Express.js**: Framework web
- **SQLite**: Base de datos local
- **CORS**: Manejo de cross-origin requests
- **Helmet**: Headers de seguridad

### Fuentes y Recursos
- **Google Fonts**: Inter (principal), Dancing Script (decorativa)
- **CSS Animations**: Efectos visuales personalizados
- **Responsive Design**: Mobile-first approach

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ instalado
- npm o yarn como package manager

### Instalación Local

1. **Instalar dependencias**
```bash
npm install
```

2. **Ejecutar el servidor**
```bash
npm start
# o
node server.js
```

3. **Abrir en navegador**
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
navidad/
├── index.html              # Página principal
├── style.css              # Estilos principales
├── app.js                 # JavaScript del frontend
├── server.js              # Servidor Express
├── package.json           # Dependencias y scripts
├── netlify.toml           # Configuración de Netlify
├── _redirects             # Reglas de redirección
├── icons/                 # Iconos del sitio
├── img/                   # Imágenes
├── wishes.db              # Base de datos SQLite (se crea automáticamente)
└── README.md              # Este archivo
```

## 🌐 Deployment en Netlify

### Opción 1: Drag & Drop
1. Ve a [netlify.com](https://netlify.com) y crea una cuenta
2. Arrastra la carpeta del proyecto al área de deploy
3. ¡Tu sitio estará en línea en minutos!

### Opción 2: Git Integration
1. Sube tu proyecto a GitHub
2. Conecta tu repositorio con Netlify
3. Deploy automático en cada push

**📖 Para instrucciones detalladas, consulta [NETLIFY_DEPLOYMENT_GUIDE.md](./NETLIFY_DEPLOYMENT_GUIDE.md)**

## 🎄 ¡Feliz Navidad y Próspero Año Nuevo! ✨

**¿Te gusta este proyecto? ¡Dale una ⭐ en GitHub!**.md              # Este archivo
```

## 🌐 API Endpoints

### GET `/api/wishes`
Obtiene todos los deseos aprobados con paginación.

**Parámetros de consulta:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 20)

### POST `/api/wishes`
Crea un nuevo deseo navideño.

**Body:**
```json
{
  "text": "Mi deseo navideño...",
  "author": "Nombre del usuario"
}
```

### GET `/api/recent-wishes`
Obtiene los 10 deseos más recientes.

### GET `/api/stats`
Obtiene estadísticas del sitio.

### POST `/api/visitor`
Registra una nueva visita.

## 🚀 Despliegue

### Heroku

1. **Instala Heroku CLI**
2. **Crea una aplicación**
   ```bash
   heroku create tu-app-navidad
   ```

3. **Despliega**
   ```bash
   git add .
   git commit -m "Deploy navidad app"
   git push heroku main
   ```

### Vercel

1. **Instala Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Despliega**
   ```bash
   vercel
   ```

### Railway

1. **Conecta tu repositorio**
2. **Railway detectará automáticamente Node.js**
3. **La aplicación se desplegará automáticamente**

## 🔒 Seguridad

- Rate limiting para prevenir spam
- Validación de entrada
- Sanitización de datos
- Headers de seguridad con Helmet
- Protección CORS

## 📊 Base de Datos

La aplicación usa SQLite para simplicidad, pero puede migrar fácilmente a PostgreSQL o MySQL para producción.

### Tablas

**wishes**
- `id` - ID único
- `text` - Texto del deseo
- `author` - Nombre del autor
- `created_at` - Fecha de creación
- `ip_address` - IP del usuario
- `user_agent` - Navegador del usuario
- `is_approved` - Estado de aprobación

**stats**
- `id` - ID único
- `total_wishes` - Total de deseos
- `total_visitors` - Total de visitantes
- `last_updated` - Última actualización

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🎄 ¡Feliz Navidad!

Hecho con ❤️ y mucha magia navideña ✨

---

**Contacto:** 
- 📧 Email: tu-email@example.com
- 🐱 GitHub: tu-usuario
- 🌐 Website: tu-website.com