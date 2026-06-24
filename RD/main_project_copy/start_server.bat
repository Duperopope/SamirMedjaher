@echo off
echo ====================================
echo     Serveur CV - indexRD.html
echo ====================================
echo.
echo Demarrage du serveur local...
echo.

cd /d "%~dp0"

:: Verifier si Node.js est disponible
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe ou n'est pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

:: Demarrer le serveur
echo Serveur demarre sur http://localhost:3000
echo Fichier servi: indexRD.html
echo.
echo CTRL+C pour arreter le serveur
echo.

start http://localhost:3000
node server.js

pause
