@echo off
REM Script rapide pour appliquer les changements et permettre les tests
echo 🔄 Application des changements au projet principal...

cd g:\Code\CV\RD
node preview_system.js apply

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ SUCCESS! Vous pouvez maintenant tester:
    echo 🌐 file:///G:/Code/CV/index.html
    echo.
    echo 🎮 Commandes utiles:
    echo    - node preview_system.js status   ^(statut^)
    echo    - node preview_system.js restore  ^(annuler^)
    echo    - node supervision.js dashboard   ^(surveillance^)
    echo.
) else (
    echo ❌ Erreur lors de l'application des changements
)

pause
