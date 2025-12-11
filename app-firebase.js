// Versión Firebase - Deseos compartidos globalmente
// Configuración de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Tu configuración de Firebase - VALORES ACTUALIZADOS
const firebaseConfig = {
  apiKey: "AIzaSyBt41pgOyliuLmm62Ao2GzQNpdSCoeGEAM",
  authDomain: "naviweb-c101c.firebaseapp.com",
  projectId: "naviweb-c101c",
  storageBucket: "naviweb-c101c.firebasestorage.app",
  messagingSenderId: "923542574150",
  appId: "1:923542574150:web:f7bb623a49927b494ce647"
};

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Variables globales
let userName = '';
let userLastName = '';
let wishesData = [];

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeNaviWebApp();
    setupEventListeners();
    startCountdown();
    animateOnScroll();
    loadWishesFromFirebase(); // Cargar deseos globales
    setupNavbarScroll();
    createSnowfall();
});

// Función principal de inicialización (renombrada para evitar conflictos)
function initializeNaviWebApp() {
    console.log('🎄 ¡Bienvenido a NaviWeb con Firebase! 🎄');
    
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

// Cargar deseos desde Firebase
async function loadWishesFromFirebase() {
    console.log('🔥 Intentando cargar deseos desde Firebase...');
    try {
        const q = query(collection(db, "wishes"), orderBy("timestamp", "desc"));
        console.log('📊 Query creado, obteniendo datos...');
        const querySnapshot = await getDocs(q);
        console.log('📦 Datos obtenidos:', querySnapshot.size, 'documentos');
        
        const wishes = [];
        querySnapshot.forEach((doc) => {
            wishes.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        wishesData = wishes;
        displayWishes(wishes);
        updateGlobalStats();
        
        console.log('✅ Deseos cargados exitosamente:', wishes.length);
        showNotification(`✨ ${wishes.length} deseos cargados de nuestra comunidad`, 'success');
        
    } catch (error) {
        console.error("❌ Error cargando deseos:", error);
        console.log('🔄 Intentando con localStorage como fallback...');
        showNotification('⚠️ Error conectando con Firebase. Usando modo local.', 'warning');
        loadWishesFromLocal(); // Fallback a localStorage
    }
}

// Agregar deseo a Firebase
async function addWish() {
    console.log('🎁 Intentando agregar deseo a Firebase...');
    const wishInput = document.getElementById('wish-text');
    const nameInput = document.getElementById('wish-name');
    
    if (!wishInput || !nameInput) {
        console.error('❌ No se encontraron los campos del formulario');
        return;
    }
    
    const wishText = wishInput.value.trim();
    const wishName = nameInput.value.trim() || 'Anónimo';
    
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
    
    console.log('📦 Objeto del deseo preparado:', newWish);
    
    try {
        console.log('🔥 Enviando a Firebase...');
        // Guardar en Firebase
        const docRef = await addDoc(collection(db, "wishes"), newWish);
        console.log('✅ Deseo guardado con ID:', docRef.id);
        
        // Agregar a la vista local
        newWish.id = docRef.id;
        wishesData.unshift(newWish);
        displayWishes(wishesData);
        updateGlobalStats();
        
        // Limpiar formulario
        wishInput.value = '';
        nameInput.value = '';
        
        showNotification(`🌟 ¡Tu deseo se compartió con el mundo! Visible para todos`, 'success');
        console.log('🎉 Proceso completado exitosamente');
        
        // Scroll a la lista de deseos
        const wishesSection = document.getElementById('wishes-display');
        if (wishesSection) {
            wishesSection.scrollIntoView({ behavior: 'smooth' });
        }
        
    } catch (error) {
        console.error("❌ Error agregando deseo a Firebase:", error);
        console.log('📋 Detalles del error:', error.message);
        
        // Fallback a localStorage
        console.log('🔄 Guardando en localStorage como fallback...');
        let localWishes = JSON.parse(localStorage.getItem('naviweb_wishes') || '[]');
        newWish.id = Date.now();
        localWishes.unshift(newWish);
        localStorage.setItem('naviweb_wishes', JSON.stringify(localWishes));
        
        wishesData = localWishes;
        displayWishes(wishesData);
        
        // Limpiar formulario
        wishInput.value = '';
        nameInput.value = '';
        
        showNotification('❌ Error con Firebase. Deseo guardado localmente.', 'warning');
    }
}

// Obtener IP del cliente (para estadísticas)
async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'unknown';
    }
}

// Actualizar estadísticas globales
async function updateGlobalStats() {
    try {
        // Estadísticas de deseos
        const wishesCount = wishesData.length;
        
        // Estadísticas de visitantes únicos (por IP)
        const uniqueIPs = [...new Set(wishesData.map(w => w.ip))];
        const visitorsCount = Math.max(uniqueIPs.length, wishesCount);
        
        const totalWishesElement = document.getElementById('total-wishes');
        const totalVisitorsElement = document.getElementById('total-visitors');
        
        if (totalWishesElement) {
            animateNumber(totalWishesElement, 0, wishesCount, 1500);
        }
        
        if (totalVisitorsElement) {
            animateNumber(totalVisitorsElement, 0, visitorsCount, 1500);
        }
        
    } catch (error) {
        console.error("Error actualizando estadísticas:", error);
    }
}

// Mostrar deseos (igual que antes pero con datos globales)
function displayWishes(wishes) {
    const wishesContainer = document.getElementById('wishes-list');
    if (!wishesContainer) return;
    
    if (wishes.length === 0) {
        wishesContainer.innerHTML = `
            <div class="no-wishes">
                <p>🎄 Aún no hay deseos navideños...</p>
                <p>¡Sé el primero en compartir tu deseo con el mundo!</p>
            </div>
        `;
        return;
    }
    
    wishesContainer.innerHTML = wishes.map((wish, index) => `
        <div class="wish-card global-wish" style="animation-delay: ${index * 0.1}s">
            <div class="wish-header">
                <span class="wish-author">🌟 ${wish.name}</span>
                <span class="wish-date">${wish.date}</span>
                <span class="wish-global">🌍 Global</span>
            </div>
            <div class="wish-content">
                ${wish.wish}
            </div>
            <div class="wish-footer">
                <small class="wish-community">❤️ Compartido con la comunidad NaviWeb</small>
            </div>
        </div>
    `).join('');
}

// Fallback a localStorage si Firebase falla
function loadWishesFromLocal() {
    try {
        const wishes = JSON.parse(localStorage.getItem('naviweb_wishes') || '[]');
        wishesData = wishes;
        displayWishes(wishes);
        
        // Agregar indicador de modo local
        const wishesContainer = document.getElementById('wishes-list');
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

// Resto de funciones iguales que en app-netlify.js
// (setupEventListeners, updateGreeting, createModal, etc.)

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

// Función para animar números
function animateNumber(element, start, end, duration) {
    if (!element) return;
    
    const startTime = performance.now();
    const startValue = start;
    const endValue = end;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart(progress));
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Función de easing
function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

// Pedir nombre al usuario
function askUserName() {
    const modal = createModal();
    document.body.appendChild(modal);
    
    // Mostrar modal con animación
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
    
    const firstNameInput = modal.querySelector('#modal-first-name');
    const lastNameInput = modal.querySelector('#modal-last-name');
    const submitBtn = modal.querySelector('#modal-submit');
    const cancelBtn = modal.querySelector('#modal-cancel');
    
    // Prellenar si ya hay datos
    if (userName) firstNameInput.value = userName;
    if (userLastName) lastNameInput.value = userLastName;
    
    submitBtn.addEventListener('click', () => {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        
        if (firstName) {
            userName = firstName;
            userLastName = lastName;
            
            // Guardar en localStorage
            localStorage.setItem('naviweb_username', firstName);
            if (lastName) {
                localStorage.setItem('naviweb_userlastname', lastName);
            }
            
            updateGreeting();
            closeModal(modal);
            showNotification(`¡Hola ${userName}! 🎄 ¡Bienvenido a nuestra comunidad navideña global!`, 'success');
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
                    🎄 ¡Únete a la Comunidad! 🎄
                </h2>
                <p style="color: #6c757d; margin-bottom: 30px; line-height: 1.6;">
                    Comparte tu nombre para formar parte de nuestra comunidad navideña global:
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
                    ">🌍 Unirme</button>
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
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML;
    return tempDiv.firstElementChild;
}

// Cerrar modal
function closeModal(modal) {
    modal.style.opacity = '0';
    modal.querySelector('.modal-content').style.transform = 'translateY(-30px)';
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Actualizar saludo
function updateGreeting() {
    const greetingElement = document.getElementById('hero-greeting');
    if (greetingElement) {
        let greeting = '';
        if (userName && userLastName) {
            greeting = `🌍 ¡Hola ${userName} ${userLastName}! 🌍`;
        } else if (userName) {
            greeting = `🌍 ¡Hola ${userName}! 🌍`;
        } else {
            greeting = '¡Únete a la comunidad navideña global!';
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

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
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
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Funciones adicionales necesarias
function setupInitialAnimations() {
    // Animaciones iniciales
}

function animateOnScroll() {
    // Animaciones de scroll
}

function startCountdown() {
    // Countdown navideño
}

function toggleMusic() {
    // Toggle de música
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

console.log('🌍 NaviWeb con Firebase - ¡Deseos compartidos globalmente! 🎄');