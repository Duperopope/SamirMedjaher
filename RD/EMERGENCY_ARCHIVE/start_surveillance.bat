@echo off
REM 🔄 SCRIPT AUTO-SURVEILLANCE - WINDOWS
REM Lance la surveillance continue du système RD

echo 🚀 DEMARRAGE SURVEILLANCE CONTINUE RD
echo =====================================

cd /d "G:\Code\CV\RD"

echo 📍 Répertoire: %cd%
echo ⏰ Démarrage: %date% %time%

REM Vérification initiale
echo 🔍 Vérification initiale du système...
node continuous_surveillance.js

echo.
echo 🔄 Lancement surveillance automatisée (daemon)...
echo ⚠️  Pour arrêter: Ctrl+C dans cette fenêtre
echo.

REM Lancement mode daemon (surveillance continue)
node automated_surveillance.js --daemon

pause
