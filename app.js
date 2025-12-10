
                // Variables globales
let userName = '';
let userLastName = '';
let isPlaying = false;
let wishesData = [];
let scrollAnimationElements = [];
let apiBaseUrl = window.location.origin; // Se ajusta automáticamente al dominio

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startCountdown();
    animateOnScroll();
    loadWishesFromAPI();
    setupNavbarScroll();
    registerVisitor();
    createSnowfall();
});

// Crear efecto de nieve
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

// Registrar visitante en el servidor
async function registerVisitor() {
    try {
        await fetch(`${apiBaseUrl}/api/visitor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.log('No se pudo registrar la visita:', error);
    }
}

// Función principal de inicialización
function initializeApp() {
    console.log('🎄 ¡Bienvenido a NaviWeb! 🎄');
    
    // Configurar saludo inicial
    setTimeout(() => {
        askUserName();
    }, 2000); // Dar tiempo para que cargue la página
    
    // Configurar animaciones iniciales
    setupInitialAnimations();
    
    // Cargar estadísticas
    loadStats();
    
    // Configurar contador de caracteres
    setupCharCounter();
}

// Configurar contador de caracteres
function setupCharCounter() {
    const textarea = document.getElementById('wish-text');
    const charCount = document.getElementById('char-count');
    
    if (textarea && charCount) {
        textarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
            
            // Cambiar color según la longitud
            if (this.value.length > 450) {
                charCount.style.color = 'var(--secondary-color)';
            } else if (this.value.length > 400) {
                charCount.style.color = 'var(--accent-color)';
            } else {
                charCount.style.color = 'var(--gray-500)';
            }
        });
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
}

// Función para scroll suave a sección
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Función para pedir nombre al usuario
function askUserName() {
    // Crear modal personalizado
    const modal = createModal();
    document.body.appendChild(modal);
    
    const firstNameInput = modal.querySelector('#modal-first-name');
    const lastNameInput = modal.querySelector('#modal-last-name');
    const submitBtn = modal.querySelector('#modal-submit');
    const cancelBtn = modal.querySelector('#modal-cancel');
    
    // Prellenar si ya tiene datos
    if (userName) firstNameInput.value = userName;
    if (userLastName) lastNameInput.value = userLastName;
    
    submitBtn.addEventListener('click', () => {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        
        if (firstName) {
            userName = firstName;
            userLastName = lastName || '';
            updateGreeting();
            closeModal(modal);
            showNotification(`¡Hola ${userName}! 🎄 ¡Bienvenido a nuestra página navideña!`, 'success');
        } else {
            showNotification('Por favor ingresa al menos tu primer nombre 😊', 'warning');
        }
    });
    
    cancelBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    // Permitir enviar con Enter
    [firstNameInput, lastNameInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });
    });
    
    // Enfocar en el primer input
    setTimeout(() => firstNameInput.focus(), 100);
}

// Crear modal personalizado
function createModal() {
    const modalHTML = `
        <div class="custom-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        ">
            <div class="modal-content" style="
                background: white;
                padding: 40px;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                transform: translateY(-30px);
                transition: transform 0.3s ease;
            ">
                <h2 style="color: var(--primary-color); margin-bottom: 20px; font-family: 'Dancing Script', cursive; font-size: 2.5rem;">
                    🎄 ¡Personaliza tu Saludo! 🎄
                </h2>
                <p style="color: #6c757d; margin-bottom: 30px; line-height: 1.6;">
                    Para hacer tu experiencia más especial, cuéntanos tu nombre:
                </p>
                <div style="margin-bottom: 20px;">
                    <input type="text" id="modal-first-name" placeholder="Tu primer nombre *" style="
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #e9ecef;
                        border-radius: 10px;
                        font-size: 1rem;
                        margin-bottom: 15px;
                        transition: border-color 0.3s ease;
                    ">
                    <input type="text" id="modal-last-name" placeholder="Tu segundo nombre (opcional)" style="
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #e9ecef;
                        border-radius: 10px;
                        font-size: 1rem;
                        transition: border-color 0.3s ease;
                    ">
                </div>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="modal-submit" style="
                        background: linear-gradient(135deg, #2d8a47, #c41e3a);
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.3s ease;
                    ">✨ Confirmar</button>
                    <button id="modal-cancel" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.3s ease;
                    ">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    const modal = modalElement.firstElementChild;
    
    // Animar entrada
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
    
    // Agregar estilos de focus
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#2d8a47';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = '#e9ecef';
        });
    });
    
    // Efectos hover en botones
    const buttons = modal.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    });
    
    return modal;
}

// Cerrar modal
function closeModal(modal) {
    modal.style.opacity = '0';
    modal.querySelector('.modal-content').style.transform = 'translateY(-30px)';
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Actualizar saludo
function updateGreeting() {
    const greetingElement = document.getElementById('hero-greeting');
    if (greetingElement) {
        let greeting = '';
        if (userName && userLastName) {
            greeting = `🎉 ¡Hola ${userName} ${userLastName}! 🎉`;
        } else if (userName) {
            greeting = `🎉 ¡Hola ${userName}! 🎉`;
        } else {
            greeting = '¡Bienvenido a la magia navideña!';
        }
        
        // Animación de texto
        greetingElement.style.transform = 'scale(0.8)';
        greetingElement.style.opacity = '0';
        
        setTimeout(() => {
            greetingElement.textContent = greeting;
            greetingElement.style.transition = 'all 0.3s ease';
            greetingElement.style.transform = 'scale(1)';
            greetingElement.style.opacity = '1';
        }, 200);
    }
}

// Sistema de música
function toggleMusic() {
    const musicBtn = document.getElementById('music-toggle');
    
    if (!isPlaying) {
        // Simular reproducción de música
        isPlaying = true;
        musicBtn.classList.add('playing');
        musicBtn.textContent = '🎵';
        showNotification('🎵 ¡Música navideña activada!', 'success');
        
        // Crear efectos visuales de música
        createMusicEffects();
    } else {
        // Detener música
        isPlaying = false;
        musicBtn.classList.remove('playing');
        musicBtn.textContent = '🎵';
        showNotification('🔇 Música detenida', 'info');
        
        // Remover efectos visuales
        removeMusicEffects();
    }
}

// Crear efectos visuales de música
function createMusicEffects() {
    const musicNotes = ['🎵', '🎶', '♪', '♫'];
    const container = document.querySelector('.hero');
    
    const musicInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(musicInterval);
            return;
        }
        
        const note = document.createElement('div');
        note.textContent = musicNotes[Math.floor(Math.random() * musicNotes.length)];
        note.style.cssText = `
            position: absolute;
            font-size: 2rem;
            color: #ffd700;
            pointer-events: none;
            z-index: 5;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: musicFloat 3s ease-out forwards;
        `;
        
        // Agregar animación CSS
        if (!document.getElementById('music-animation-style')) {
            const style = document.createElement('style');
            style.id = 'music-animation-style';
            style.textContent = `
                @keyframes musicFloat {
                    0% { opacity: 1; transform: translateY(0) scale(1); }
                    100% { opacity: 0; transform: translateY(-100px) scale(1.5); }
                }
            `;
            document.head.appendChild(style);
        }
        
        container.appendChild(note);
        
        setTimeout(() => {
            if (note.parentNode) {
                note.remove();
            }
        }, 3000);
    }, 1500);
}

// Remover efectos de música
function removeMusicEffects() {
    const musicNotes = document.querySelectorAll('.hero div[style*="musicFloat"]');
    musicNotes.forEach(note => note.remove());
}

// Countdown para Navidad
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    function updateCountdown() {
        const now = new Date().getTime();
        const currentYear = new Date().getFullYear();
        let christmas = new Date(currentYear, 11, 25).getTime(); // 25 de diciembre
        
        // Si ya pasó Navidad este año, calcular para el próximo año
        if (now > christmas) {
            christmas = new Date(currentYear + 1, 11, 25).getTime();
        }
        
        const distance = christmas - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `
            <div class="countdown-item">
                <span class="countdown-number">${days}</span>
                <span class="countdown-label">Días</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${hours}</span>
                <span class="countdown-label">Horas</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${minutes}</span>
                <span class="countdown-label">Minutos</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${seconds}</span>
                <span class="countdown-label">Segundos</span>
            </div>
        `;
        
        // Si llegó Navidad
        if (distance < 0) {
            countdownElement.innerHTML = `
                <div style="font-size: 2rem; color: var(--secondary-color); font-weight: bold;">
                    🎄 ¡FELIZ NAVIDAD! 🎄
                </div>
            `;
            // Crear efecto de celebración
            createCelebration();
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Crear efecto de celebración
function createCelebration() {
    const emojis = ['🎉', '🎊', '🎁', '🎄', '⭐', '✨', '🔔', '🎅'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.cssText = `
                position: fixed;
                font-size: 2rem;
                pointer-events: none;
                z-index: 9999;
                left: ${Math.random() * 100}vw;
                top: -50px;
                animation: celebrate 4s ease-out forwards;
            `;
            
            document.body.appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 4000);
        }, i * 100);
    }
    
    // Agregar animación de celebración
    if (!document.getElementById('celebration-style')) {
        const style = document.createElement('style');
        style.id = 'celebration-style';
        style.textContent = `
            @keyframes celebrate {
                0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Animaciones al hacer scroll
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observar elementos
    const elementsToAnimate = document.querySelectorAll('.card, .message-card, .wish-item');
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Configurar cambios en navbar al scroll
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Función para volver arriba
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Mostrar/ocultar información adicional en tarjetas
function toggleCardInfo(button) {
    const extraInfo = button.parentNode.querySelector('.extra-info');
    
    if (extraInfo.style.display === 'none' || !extraInfo.style.display) {
        extraInfo.style.display = 'block';
        extraInfo.classList.add('show');
        button.textContent = 'Leer menos';
        button.style.background = '#6c757d';
    } else {
        extraInfo.classList.remove('show');
        extraInfo.style.display = 'none';
        button.textContent = 'Leer más';
        button.style.background = 'linear-gradient(135deg, #2d8a47, #c41e3a)';
    }
}

// Sistema de deseos navideños con API
async function addWish() {
    const wishTextarea = document.getElementById('wish-text');
    const addWishBtn = document.getElementById('add-wish');
    const wishText = wishTextarea.value.trim();
    
    if (!wishText) {
        showNotification('Por favor escribe un deseo antes de enviarlo 😊', 'warning');
        return;
    }
    
    if (wishText.length < 10) {
        showNotification('Tu deseo debe tener al menos 10 caracteres ✨', 'warning');
        return;
    }
    
    if (wishText.length > 500) {
        showNotification('Tu deseo no puede tener más de 500 caracteres 📝', 'warning');
        return;
    }
    
    // Mostrar estado de carga
    const originalText = addWishBtn.textContent;
    addWishBtn.textContent = '⏳ Enviando...';
    addWishBtn.disabled = true;
    
    try {
        const response = await fetch(`${apiBaseUrl}/api/wishes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: wishText,
                author: userName || 'Visitante Anónimo'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Éxito
            displayWish(data.wish);
            wishTextarea.value = '';
            showNotification('¡Tu deseo navideño ha sido enviado y guardado! ✨🌟', 'success');
            
            // Scroll suave al deseo
            setTimeout(() => {
                const newWish = document.querySelector(`[data-wish-id="${data.wish.id}"]`);
                if (newWish) {
                    newWish.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
            
            // Actualizar estadísticas
            loadStats();
            
        } else {
            // Error del servidor
            if (data.details && Array.isArray(data.details)) {
                showNotification(data.details.join(', '), 'error');
            } else {
                showNotification(data.error || 'Error enviando el deseo', 'error');
            }
        }
        
    } catch (error) {
        console.error('Error enviando deseo:', error);
        showNotification('Error de conexión. Verifica tu internet e intenta de nuevo 🔄', 'error');
    } finally {
        // Restaurar botón
        addWishBtn.textContent = originalText;
        addWishBtn.disabled = false;
    }
}

// Cargar deseos desde la API
async function loadWishesFromAPI() {
    try {
        const response = await fetch(`${apiBaseUrl}/api/recent-wishes`);
        
        if (response.ok) {
            const wishes = await response.json();
            
            // Limpiar contenedor (excepto el ejemplo)
            const wishesContainer = document.getElementById('wishes-container');
            const existingWishes = wishesContainer.querySelectorAll('.wish-item:not(.sample)');
            existingWishes.forEach(wish => wish.remove());
            
            // Mostrar deseos desde la base de datos
            wishes.forEach(wish => {
                displayWish({
                    id: wish.id,
                    text: wish.text,
                    author: wish.author,
                    date: new Date(wish.created_at).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                });
            });
            
            console.log(`✅ Cargados ${wishes.length} deseos desde la base de datos`);
            
        } else {
            console.log('No se pudieron cargar los deseos desde el servidor');
            // Fallback a localStorage si el servidor no está disponible
            loadWishesFromLocalStorage();
        }
        
    } catch (error) {
        console.log('Error conectando con el servidor:', error);
        // Fallback a localStorage
        loadWishesFromLocalStorage();
    }
}

// Fallback: cargar desde localStorage si la API no está disponible
function loadWishesFromLocalStorage() {
    try {
        const savedWishes = localStorage.getItem('navidad-wishes');
        if (savedWishes) {
            wishesData = JSON.parse(savedWishes);
            const recentWishes = wishesData.slice(-10);
            recentWishes.forEach(wish => displayWish(wish));
            console.log('📱 Cargados deseos desde almacenamiento local (modo offline)');
        }
    } catch (e) {
        console.log('No se pueden cargar los deseos guardados localmente');
    }
}

// Cargar estadísticas del servidor
async function loadStats() {
    try {
        const response = await fetch(`${apiBaseUrl}/api/stats`);
        
        if (response.ok) {
            const stats = await response.json();
            updateStatsDisplay(stats);
        }
        
    } catch (error) {
        console.log('No se pudieron cargar las estadísticas:', error);
    }
}

// Mostrar estadísticas en la página
function updateStatsDisplay(stats) {
    // Agregar sección de estadísticas si no existe
    let statsSection = document.getElementById('stats-section');
    
    if (!statsSection) {
        const wishesSection = document.querySelector('.wishes-section');
        if (wishesSection) {
            statsSection = document.createElement('div');
            statsSection.id = 'stats-section';
            statsSection.innerHTML = `
                <div class="stats-container" style="
                    text-align: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: var(--bg-light);
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                ">
                    <h4 style="color: var(--primary-color); margin-bottom: 15px;">📊 Estadísticas NaviWeb</h4>
                    <div style="display: flex; gap: 30px; justify-content: center; flex-wrap: wrap;">
                        <div class="stat-item">
                            <span style="font-size: 2rem; font-weight: bold; color: var(--secondary-color);" id="total-wishes">0</span>
                            <p style="margin: 0; color: #6c757d;">Deseos Enviados</p>
                        </div>
                        <div class="stat-item">
                            <span style="font-size: 2rem; font-weight: bold; color: var(--primary-color);" id="total-visitors">0</span>
                            <p style="margin: 0; color: #6c757d;">Visitantes</p>
                        </div>
                    </div>
                </div>
            `;
            
            const container = wishesSection.querySelector('.container');
            if (container) {
                container.insertBefore(statsSection, container.firstChild);
            }
        }
    }
    
    // Actualizar números con animación
    if (statsSection) {
        const totalWishesEl = document.getElementById('total-wishes');
        const totalVisitorsEl = document.getElementById('total-visitors');
        
        if (totalWishesEl) {
            animateNumber(totalWishesEl, 0, stats.totalWishes, 2000);
        }
        
        if (totalVisitorsEl) {
            animateNumber(totalVisitorsEl, 0, stats.totalVisitors, 2000);
        }
    }
}

// Animar números
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentNumber = Math.floor(start + (end - start) * progress);
        element.textContent = currentNumber.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Mostrar deseo en pantalla
function displayWish(wish) {
    const wishesContainer = document.getElementById('wishes-container');
    
    const wishElement = document.createElement('div');
    wishElement.className = 'wish-item';
    wishElement.setAttribute('data-wish-id', wish.id);
    wishElement.innerHTML = `
        <p>"${wish.text}"</p>
        <small>- ${wish.author} (${wish.date})</small>
    `;
    
    // Agregar al principio para mostrar los más recientes primero
    const firstChild = wishesContainer.querySelector('.wish-item:not(.sample)') || 
                       wishesContainer.querySelector('.wish-item.sample');
    
    if (firstChild) {
        wishesContainer.insertBefore(wishElement, firstChild.nextSibling || null);
    } else {
        wishesContainer.appendChild(wishElement);
    }
    
    // Animar entrada
    wishElement.style.opacity = '0';
    wishElement.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        wishElement.style.transition = 'all 0.5s ease-out';
        wishElement.style.opacity = '1';
        wishElement.style.transform = 'translateY(0)';
    }, 100);
}

// Guardar deseos en localStorage (backup)
function saveWishes() {
    try {
        localStorage.setItem('navidad-wishes', JSON.stringify(wishesData));
    } catch (e) {
        console.log('No se pueden guardar los deseos en el almacenamiento local');
    }
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Remover notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Colores según tipo
    const colors = {
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 500;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Configurar animaciones iniciales
function setupInitialAnimations() {
    // Animar copos de nieve
    const snowflakes = document.querySelectorAll('.snowflake');
    snowflakes.forEach((snowflake, index) => {
        snowflake.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Animar elementos del hero
    const heroElements = document.querySelectorAll('.main-title, .greeting, .subtitle');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
}

// Función utilitaria para generar número aleatorio
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Efecto de partículas navideñas al hacer clic
document.addEventListener('click', function(e) {
    // Solo en botones y enlaces
    if (e.target.matches('button, .button, .nav-link')) {
        createClickEffect(e.pageX, e.pageY);
    }
});

function createClickEffect(x, y) {
    const particles = ['✨', '⭐', '🌟'];
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: 1rem;
            pointer-events: none;
            z-index: 9999;
            animation: clickParticle 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
    
    // Agregar animación de partículas
    if (!document.getElementById('click-particle-style')) {
        const style = document.createElement('style');
        style.id = 'click-particle-style';
        style.textContent = `
            @keyframes clickParticle {
                0% {
                    opacity: 1;
                    transform: scale(1) translate(0, 0);
                }
                100% {
                    opacity: 0;
                    transform: scale(0.5) translate(${random(-50, 50)}px, ${random(-50, 50)}px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Mensaje de despedida cuando se cierra la página
window.addEventListener('beforeunload', function(e) {
    if (userName) {
        e.returnValue = `¡Hasta pronto ${userName}! 🎄 Esperamos verte de nuevo en NaviWeb ✨`;
    }
});

// Configurar navbar scroll effect
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

// Función para mostrar notificaciones mejorada
function showNotification(message, type = 'success') {
    // Crear el contenedor de notificaciones si no existe
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const bgColor = type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#dc3545';
    const textColor = type === 'warning' ? '#000' : '#fff';
    
    notification.style.cssText = `
        background: ${bgColor};
        color: ${textColor};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: all 0.3s ease;
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        max-width: 350px;
        font-weight: 500;
    `;
    
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentNode.remove()" style="
            background: none;
            border: none;
            color: ${textColor};
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">&times;</button>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

console.log('🎄 NaviWeb cargado completamente - ¡Feliz Navidad! 🎄');