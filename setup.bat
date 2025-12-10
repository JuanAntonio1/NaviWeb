@echo off
echo 🎄 ===== NAVIDAD WEB APP SETUP ===== 🎄
echo.

:: Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version
echo ✅ npm encontrado
npm --version
echo.

:: Instalar dependencias si no existen
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
) else (
    echo ✅ Dependencias ya instaladas
)

echo.
echo 🎄 ===== SERVIDOR LISTO ===== 🎄
echo.
echo Para iniciar el servidor:
echo   🚀 Desarrollo: npm run dev
echo   🌟 Producción: npm start
echo.
echo URLs disponibles:
echo   🌐 Web: http://localhost:3000
echo   📊 API: http://localhost:3000/api/wishes
echo   📈 Stats: http://localhost:3000/api/stats
echo.
echo ¡Feliz Navidad! 🎅✨
pause