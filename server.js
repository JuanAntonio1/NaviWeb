const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
            fontSrc: ["'self'", "fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "blob:"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 requests por IP cada 15 minutos
    message: {
        error: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.'
    }
});

const wishLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 10, // máximo 10 deseos por IP cada 5 minutos
    message: {
        error: 'Demasiados deseos enviados. Espera 5 minutos antes de enviar otro.'
    }
});

app.use(limiter);
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Inicializar base de datos
const db = new sqlite3.Database('./wishes.db', (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('✅ Conectado a la base de datos SQLite');
        
        // Crear tabla de deseos si no existe
        db.run(`CREATE TABLE IF NOT EXISTS wishes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            author TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT,
            user_agent TEXT,
            is_approved BOOLEAN DEFAULT 1
        )`, (err) => {
            if (err) {
                console.error('Error creando tabla:', err.message);
            } else {
                console.log('✅ Tabla de deseos lista');
            }
        });

        // Crear tabla de estadísticas
        db.run(`CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total_wishes INTEGER DEFAULT 0,
            total_visitors INTEGER DEFAULT 0,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creando tabla de estadísticas:', err.message);
            } else {
                console.log('✅ Tabla de estadísticas lista');
                
                // Inicializar estadísticas si no existen
                db.run(`INSERT OR IGNORE INTO stats (id, total_wishes, total_visitors) VALUES (1, 0, 0)`);
            }
        });
    }
});

// Función para limpiar y validar texto
function sanitizeText(text) {
    if (typeof text !== 'string') return '';
    return text.trim().substring(0, 500); // Máximo 500 caracteres
}

function sanitizeName(name) {
    if (typeof name !== 'string') return 'Visitante Anónimo';
    return name.trim().substring(0, 50) || 'Visitante Anónimo'; // Máximo 50 caracteres
}

// Función para validar deseo
function validateWish(text, author) {
    const errors = [];
    
    if (!text || text.length < 10) {
        errors.push('El deseo debe tener al menos 10 caracteres');
    }
    
    if (text && text.length > 500) {
        errors.push('El deseo no puede tener más de 500 caracteres');
    }
    
    if (!author || author.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (author && author.length > 50) {
        errors.push('El nombre no puede tener más de 50 caracteres');
    }
    
    // Verificar contenido inapropiado (básico)
    const inappropriateWords = ['spam', 'hack', 'virus', 'malware'];
    const lowercaseText = text.toLowerCase();
    
    for (let word of inappropriateWords) {
        if (lowercaseText.includes(word)) {
            errors.push('El contenido contiene palabras no permitidas');
            break;
        }
    }
    
    return errors;
}

// Rutas API

// Ruta para obtener todos los deseos aprobados
app.get('/api/wishes', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    db.all(
        `SELECT id, text, author, created_at FROM wishes 
         WHERE is_approved = 1 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset],
        (err, rows) => {
            if (err) {
                console.error('Error obteniendo deseos:', err.message);
                res.status(500).json({ error: 'Error interno del servidor' });
                return;
            }
            
            // Obtener total de deseos para paginación
            db.get('SELECT COUNT(*) as total FROM wishes WHERE is_approved = 1', (err, countRow) => {
                if (err) {
                    console.error('Error contando deseos:', err.message);
                    res.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                
                res.json({
                    wishes: rows,
                    pagination: {
                        page: page,
                        limit: limit,
                        total: countRow.total,
                        totalPages: Math.ceil(countRow.total / limit)
                    }
                });
            });
        }
    );
});

// Ruta para agregar un nuevo deseo
app.post('/api/wishes', wishLimiter, (req, res) => {
    const { text, author } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    
    const cleanText = sanitizeText(text);
    const cleanAuthor = sanitizeName(author);
    
    // Validar datos
    const validationErrors = validateWish(cleanText, cleanAuthor);
    if (validationErrors.length > 0) {
        return res.status(400).json({ 
            error: 'Datos inválidos', 
            details: validationErrors 
        });
    }
    
    // Insertar en base de datos
    db.run(
        `INSERT INTO wishes (text, author, ip_address, user_agent) 
         VALUES (?, ?, ?, ?)`,
        [cleanText, cleanAuthor, ip, userAgent],
        function(err) {
            if (err) {
                console.error('Error insertando deseo:', err.message);
                res.status(500).json({ error: 'Error guardando el deseo' });
                return;
            }
            
            // Actualizar estadísticas
            db.run('UPDATE stats SET total_wishes = total_wishes + 1, last_updated = CURRENT_TIMESTAMP WHERE id = 1');
            
            res.status(201).json({
                success: true,
                message: 'Deseo guardado exitosamente',
                wish: {
                    id: this.lastID,
                    text: cleanText,
                    author: cleanAuthor,
                    created_at: new Date().toISOString()
                }
            });
        }
    );
});

// Ruta para obtener estadísticas
app.get('/api/stats', (req, res) => {
    db.get('SELECT * FROM stats WHERE id = 1', (err, row) => {
        if (err) {
            console.error('Error obteniendo estadísticas:', err.message);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        
        res.json({
            totalWishes: row ? row.total_wishes : 0,
            totalVisitors: row ? row.total_visitors : 0,
            lastUpdated: row ? row.last_updated : new Date().toISOString()
        });
    });
});

// Ruta para incrementar contador de visitantes
app.post('/api/visitor', (req, res) => {
    db.run('UPDATE stats SET total_visitors = total_visitors + 1, last_updated = CURRENT_TIMESTAMP WHERE id = 1', (err) => {
        if (err) {
            console.error('Error actualizando visitantes:', err.message);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        
        res.json({ success: true });
    });
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para obtener deseos recientes (para la página)
app.get('/api/recent-wishes', (req, res) => {
    db.all(
        `SELECT id, text, author, datetime(created_at, 'localtime') as created_at 
         FROM wishes 
         WHERE is_approved = 1 
         ORDER BY created_at DESC 
         LIMIT 10`,
        (err, rows) => {
            if (err) {
                console.error('Error obteniendo deseos recientes:', err.message);
                res.status(500).json({ error: 'Error interno del servidor' });
                return;
            }
            
            res.json(rows);
        }
    );
});

// Manejo de errores globales
app.use((err, req, res, next) => {
    console.error('Error no capturado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🎄 Servidor navideño funcionando en http://localhost:${PORT}`);
    console.log(`📊 API disponible en http://localhost:${PORT}/api/wishes`);
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
    console.log('\n🔄 Cerrando servidor...');
    db.close((err) => {
        if (err) {
            console.error('Error cerrando base de datos:', err.message);
        } else {
            console.log('✅ Base de datos cerrada correctamente');
        }
        process.exit(0);
    });
});

module.exports = app;