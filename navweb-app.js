// NaviWeb - Versión con Firebase para deseos globales
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBt41pgOyliuLmm62Ao2GzQNpdSCoeGEAM",
  authDomain: "naviweb-c101c.firebaseapp.com",
  projectId: "naviweb-c101c",
  storageBucket: "naviweb-c101c.firebasestorage.app",
  messagingSenderId: "923542574150",
  appId: "1:923542574150:web:f7bb623a49927b494ce647"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let userName = '';
let wishesData = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando NaviWeb con Firebase...');
    initializeApp();
    setupEventListeners();
    loadWishesFromFirebase();
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

async function addWish() {
    const wishInput = document.getElementById('wish-text');
    const nameInput = document.getElementById('wish-name');

    if (!wishInput) return;

    const wishText = wishInput.value.trim();
    const wishName = nameInput ? nameInput.value.trim() || 'Anónimo' : 'Anónimo';

    if (!wishText) {
        alert('Por favor escribe tu deseo');
        return;
    }

    try {
        const newWish = {
            name: wishName,
            wish: wishText,
            timestamp: new Date(),
            date: new Date().toLocaleDateString('es-ES')
        };

        console.log('📤 Enviando deseo a Firebase...');
        const docRef = await addDoc(collection(db, "wishes"), newWish);
        console.log('✅ Deseo guardado con ID:', docRef.id);

        wishInput.value = '';
        if (nameInput) nameInput.value = '';

        alert('¡Deseo compartido globalmente! ✨');
        loadWishesFromFirebase(); // Recargar para mostrar el nuevo deseo

    } catch (error) {
        console.error('❌ Error guardando en Firebase:', error);

        // Fallback a localStorage
        alert('Error conectando con Firebase. Guardando localmente.');
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
        loadWishesFromLocal();
    }
}

async function loadWishesFromFirebase() {
    try {
        console.log('🔥 Cargando deseos desde Firebase...');
        const q = query(collection(db, "wishes"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        console.log('📦 Encontrados', querySnapshot.size, 'deseos');

        const wishes = [];
        querySnapshot.forEach((doc) => {
            wishes.push({
                id: doc.id,
                ...doc.data()
            });
        });

        wishesData = wishes;
        displayWishes(wishes);

        if (wishes.length > 0) {
            console.log('✅ Deseos cargados de Firebase');
        }

    } catch (error) {
        console.error('❌ Error cargando de Firebase:', error);
        console.log('🔄 Usando localStorage como respaldo');
        loadWishesFromLocal();
    }
}

function loadWishesFromLocal() {
    const wishes = JSON.parse(localStorage.getItem('naviweb_wishes') || '[]');
    wishesData = wishes;
    displayWishes(wishes);
}

function displayWishes(wishes) {
    const container = document.getElementById('wishes-container');
    if (!container) return;

    if (wishes.length === 0) {
        container.innerHTML = '<p>🎄 ¡Sé el primero en compartir un deseo navideño!</p>';
        return;
    }

    container.innerHTML = wishes.map(wish => `
        <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #0f766e; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="margin: 0 0 8px 0; font-style: italic;">${wish.wish}</p>
            <small style="color: #666;">🌟 ${wish.name} - ${wish.date}</small>
        </div>
    `).join('');
}

function updateGreeting() {
    const greeting = document.getElementById('greeting');
    if (greeting) {
        greeting.textContent = userName ? `¡Hola ${userName}!` : '¡Feliz Navidad!';
    }
}

console.log('✅ NaviWeb con Firebase listo');