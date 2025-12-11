// NaviWeb - Versión simplificada con localStorage
let userName = '';
let wishesData = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando NaviWeb...');
    initializeApp();
    setupEventListeners();
    loadWishes();
});

function initializeApp() {
    userName = localStorage.getItem('naviweb_username') || '';
    updateGreeting();
}

function setupEventListeners() {
    const addWishBtn = document.getElementById('add-wish');
    if (addWishBtn) {
        addWishBtn.addEventListener('click', addWish);
    }
}

function addWish() {
    const wishInput = document.getElementById('wish-text');
    const nameInput = document.getElementById('wish-name');

    if (!wishInput) return;

    const wishText = wishInput.value.trim();
    const wishName = nameInput ? nameInput.value.trim() || 'Anónimo' : 'Anónimo';

    if (!wishText) {
        alert('Por favor escribe tu deseo');
        return;
    }

    const newWish = {
        name: wishName,
        wish: wishText,
        date: new Date().toLocaleDateString('es-ES')
    };

    let wishes = JSON.parse(localStorage.getItem('naviweb_wishes') || '[]');
    wishes.unshift(newWish);
    localStorage.setItem('naviweb_wishes', JSON.stringify(wishes));

    wishInput.value = '';
    if (nameInput) nameInput.value = '';

    loadWishes();
    alert('¡Deseo guardado!');
}

function loadWishes() {
    const wishes = JSON.parse(localStorage.getItem('naviweb_wishes') || '[]');
    const container = document.getElementById('wishes-container');

    if (!container) return;

    if (wishes.length === 0) {
        container.innerHTML = '<p>¡Sé el primero en compartir un deseo!</p>';
        return;
    }

    container.innerHTML = wishes.map(wish => `
        <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #0f766e;">
            <p>${wish.wish}</p>
            <small>🌟 ${wish.name} - ${wish.date}</small>
        </div>
    `).join('');
}

function updateGreeting() {
    const greeting = document.getElementById('greeting');
    if (greeting) {
        greeting.textContent = userName ? `¡Hola ${userName}!` : '¡Feliz Navidad!';
    }
}

console.log('✅ NaviWeb cargado correctamente');