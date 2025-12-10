#!/bin/bash

echo "🎄 ===== NAVIDAD WEB APP SETUP ===== 🎄"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo "✅ npm encontrado: $(npm --version)"
echo ""

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
else
    echo "✅ Dependencias ya instaladas"
fi

echo ""
echo "🎄 ===== SERVIDOR LISTO ===== 🎄"
echo ""
echo "Para iniciar el servidor:"
echo "  🚀 Desarrollo: npm run dev"
echo "  🌟 Producción: npm start"
echo ""
echo "URLs disponibles:"
echo "  🌐 Web: http://localhost:3000"
echo "  📊 API: http://localhost:3000/api/wishes"
echo "  📈 Stats: http://localhost:3000/api/stats"
echo ""
echo "¡Feliz Navidad! 🎅✨"