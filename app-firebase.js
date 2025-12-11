// Versión simplificada - Solo localStorage
// Variables globales
let userName = '';
let userLastName = '';
let wishesData = [];

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando NaviWeb...');
    initializeNaviWebApp();
    setupEventListeners();
    startCountdown();
    animateOnScroll();
    loadWishesFromLocal(); // Usar localStorage
    setupNavbarScroll();
    createSnowfall();
});

// Función principal de inicialización
function initializeNaviWebApp() {
    console.log('🎄 ¡Bienvenido a NaviWeb! 🎄');

    // Cargar nombre guardado del localStorage
    userName = localStorage.getItem('naviweb_username') || '';
    userLastName = localStorage.getItem('naviweb_userlastname') || '';

    // Configurar saludo inicial
    updateGreeting();

    setTimeout(() => {
        if (!userName) {
            askUserName();
        }
    }, 2000);

    // Configurar animaciones iniciales
    setupInitialAnimations();

    // Configurar contador de caracteres
    setupCharCounter();
}

// Agregar deseo (versión simplificada con localStorage)
function addWish() {
    console.log('🎁 Intentando agregar deseo...');
    const wishInput = document.getElementById('wish-text');
    const nameInput = document.getElementById('wish-name');

    if (!wishInput) {
        console.error('❌ No se encontró el campo del deseo');
        return;
    }

    const wishText = wishInput.value.trim();
    const wishName = nameInput ? nameInput.value.trim() || 'Anónimo' : 'Anónimo';

    console.log('📝 Datos del deseo:', { wishName, wishText: wishText.substring(0, 50) + '...' });

    if (!wishText) {
        showNotification('Por favor escribe tu deseo 🎄', 'warning');
        return;
    }

    if (wishText.length > 500) {
        showNotification('El deseo es muy largo. Máximo 500 caracteres 📝', 'warning');
        return;
    }

    const newWish = {
        name: wishName,
        wish: wishText,
        timestamp: new Date(),
        date: new Date().toLocaleDateString('es-ES')
    };

    console.log('📦 Guardando en localStorage...');

    // Guardar en localStorage
    let localWishes = JSON.parse(localStorage.getItem('naviweb_wishes') || '[]');
    newWish.id = Date.now();
    localWishes.unshift(newWish);
    localStorage.setItem('naviweb_wishes', JSON.stringify(localWishes));

    wishesData = localWishes;
    displayWishes(wishesData);

    // Limpiar formulario
    wishInput.value = '';
    if (nameInput) nameInput.value = '';

    showNotification(`🌟 ¡Tu deseo se guardó! Visible para todos en este dispositivo`, 'success');
    console.log('🎉 Proceso completado exitosamente');
}

// Mostrar deseos
function displayWishes(wishes) {
    console.log('🎨 Intentando mostrar deseos:', wishes.length);
    const wishesContainer = document.getElementById('wishes-container');
    console.log('📦 Contenedor encontrado:', !!wishesContainer);

    if (!wishesContainer) {
        console.error('❌ No se encontró el contenedor de deseos');
        return;
    }

    if (wishes.length === 0) {
        console.log('📭 No hay deseos para mostrar');
        wishesContainer.innerHTML = `
            <div class="no-wishes">
                <p>🎄 Aún no hay deseos navideños...</p>
                <p>¡Sé el primero en compartir tu deseo con el mundo!</p>
            </div>
        `;
        return;
    }

    console.log('📝 Generando HTML para', wishes.length, 'deseos');
    const html = wishes.map((wish, index) => `
        <div class="wish-item" style="animation-delay: ${index * 0.1}s">
            <p>${wish.wish}</p>
            <small>🌟 ${wish.name} - ${wish.date} 🌍 Local</small>
        </div>
    `).join('');

    console.log('📄 HTML generado, asignando al contenedor');
    wishesContainer.innerHTML = html;
    console.log('✅ Deseos mostrados en la página');
}

// Cargar deseos desde localStorage
function loadWishesFromLocal() {
    try {
        const wishes = JSON.parse(localStorage.getItem('naviweb_wishes') || '[]');
        wishesData = wishes;
        displayWishes(wishes);

        // Agregar indicador de modo local
        const wishesContainer = document.getElementById('wishes-container');
        if (wishesContainer && wishes.length > 0) {
            wishesContainer.insertAdjacentHTML('afterbegin', `
                <div class="local-mode-notice">
                    <p>📱 Modo Local: Solo tus deseos son visibles</p>
                    <p>Para ver deseos de otros usuarios, se necesita conexión a base de datos</p>
                </div>
            `);
        }
    } catch (error) {
        console.log('Error cargando deseos locales:', error);
        wishesData = [];
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Botón para cambiar nombre
    const personalizeBtn = document.getElementById('personalize-btn');
    if (personalizeBtn) {
        personalizeBtn.addEventListener('click', askUserName);
    }

    // Botón de música
    const musicBtn = document.getElementById('music-toggle');
    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }

    // Hamburger menu para móviles
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }

            // Actualizar enlace activo
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Botón agregar deseo
    const addWishBtn = document.getElementById('add-wish');
    if (addWishBtn) {
        addWishBtn.addEventListener('click', addWish);
    }

    // Enter en textarea para enviar deseo
    const wishTextarea = document.getElementById('wish-text');
    if (wishTextarea) {
        wishTextarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                addWish();
            }
        });
    }

    // Botón volver arriba
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }
}

// Función para actualizar el saludo
function updateGreeting() {
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        if (userName) {
            greetingElement.textContent = `¡Hola ${userName}!`;
        } else {
            greetingElement.textContent = '¡Feliz Navidad!';
        }
    }
}

// Función para pedir el nombre del usuario
function askUserName() {
    const modal = createModal(`
        <h2>🎄 ¡Personaliza tu experiencia!</h2>
        <p>¿Cómo te llamas?</p>
        <input type="text" id="user-name-input" placeholder="Tu nombre" maxlength="20">
        <div class="modal-buttons">
            <button id="save-name" class="btn btn-primary">Guardar</button>
            <button id="skip-name" class="btn btn-secondary">Omitir</button>
        </div>
    `);

    document.getElementById('save-name').addEventListener('click', () => {
        const nameInput = document.getElementById('user-name-input');
        if (nameInput && nameInput.value.trim()) {
            userName = nameInput.value.trim();
            localStorage.setItem('naviweb_username', userName);
            updateGreeting();
        }
        modal.remove();
    });

    document.getElementById('skip-name').addEventListener('click', () => {
        modal.remove();
    });
}

// Función para crear modal
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">
            ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <span class="notification-text">${message}</span>
        <button class="notification-close">×</button>
    `;

    // Agregar al DOM
    document.body.appendChild(notification);

    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Botón de cerrar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Función para countdown
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    function updateCountdown() {
        const now = new Date();
        const christmas = new Date(now.getFullYear(), 11, 25); // Diciembre 25

        if (now > christmas) {
            christmas.setFullYear(christmas.getFullYear() + 1);
        }

        const diff = christmas - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `
            <div class="countdown-item">
                <span class="countdown-number">${days}</span>
                <span class="countdown-label">días</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${hours}</span>
                <span class="countdown-label">horas</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${minutes}</span>
                <span class="countdown-label">min</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${seconds}</span>
                <span class="countdown-label">seg</span>
            </div>
        `;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Función para animaciones al hacer scroll
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos con clase 'animate-on-scroll'
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Función para configurar animaciones iniciales
function setupInitialAnimations() {
    // Agregar clase de animación a elementos iniciales
    setTimeout(() => {
        document.querySelectorAll('.hero-content, .hero-image, .section-header').forEach(el => {
            el.classList.add('animate-in');
        });
    }, 500);
}

// Función para configurar contador de caracteres
function setupCharCounter() {
    const textarea = document.getElementById('wish-text');
    const charCount = document.getElementById('char-count');

    if (textarea && charCount) {
        textarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;

            // Cambiar color según la longitud
            if (this.value.length > 450) {
                charCount.style.color = 'var(--secondary-color)';
            } else {
                charCount.style.color = 'var(--gray-500)';
            }
        });
    }
}

// Función para toggle de música
function toggleMusic() {
    // Implementación básica - puedes expandir esto
    showNotification('🎵 Función de música próximamente', 'info');
}

// Función para scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Función para configurar navbar scroll
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Función para crear nieve
function createSnowfall() {
    const snowContainer = document.getElementById('snow-container');
    if (!snowContainer) return;

    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = ['❄', '❅', '❆'][Math.floor(Math.random() * 3)];

        // Posición aleatoria
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
        snowflake.style.animationDelay = Math.random() * 2 + 's';

        snowContainer.appendChild(snowflake);
    }
}

console.log('🌍 NaviWeb - ¡Feliz Navidad! 🎄');