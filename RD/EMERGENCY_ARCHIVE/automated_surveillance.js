#!/usr/bin/env node
/**
 * ⏰ SYSTÈME SURVEILLANCE AUTOMATISÉE v1.0
 * 
 * MISSION : Surveillance continue en arrière-plan
 * OBJECTIF : Vérifications automatiques régulières 24/7
 * PRÉVENTION : Détection précoce + alertes + auto-correction
 */

const ContinuousSurveillance = require('./continuous_surveillance.js');

class AutomatedSurveillance {
    constructor() {
        this.surveillance = new ContinuousSurveillance();
        this.isRunning = false;
        this.intervals = [];
        
        // CALENDRIER DE SURVEILLANCE
        this.schedule = {
            // Surveillance rapide toutes les 5 minutes
            rapid: { interval: 5, active: true },
            // Surveillance complète toutes les 30 minutes  
            complete: { interval: 30, active: true },
            // Maintenance quotidienne à 3h du matin
            daily: { interval: 24 * 60, active: true }
        };
    }

    startSurveillance() {
        if (this.isRunning) {
            console.log('⚠️ Surveillance déjà active');
            return;
        }

        console.log('🚀 DÉMARRAGE SURVEILLANCE AUTOMATISÉE');
        console.log('====================================');
        this.isRunning = true;

        // 1. SURVEILLANCE RAPIDE (5 min)
        if (this.schedule.rapid.active) {
            const rapidInterval = setInterval(() => {
                this.rapidCheck();
            }, this.schedule.rapid.interval * 60 * 1000);
            
            this.intervals.push(rapidInterval);
            console.log(`✅ Surveillance rapide: ${this.schedule.rapid.interval} min`);
        }

        // 2. SURVEILLANCE COMPLÈTE (30 min)
        if (this.schedule.complete.active) {
            const completeInterval = setInterval(() => {
                this.completeCheck();
            }, this.schedule.complete.interval * 60 * 1000);
            
            this.intervals.push(completeInterval);
            console.log(`✅ Surveillance complète: ${this.schedule.complete.interval} min`);
        }

        // 3. CHECK INITIAL
        this.initialCheck();
        
        console.log('\n🔄 SURVEILLANCE CONTINUE ACTIVE - Arrêt avec Ctrl+C');
    }

    rapidCheck() {
        try {
            const report = this.surveillance.checkSystemHealth();
            
            // Alerte seulement si problème
            if (report.status !== 'OK') {
                console.log(`\n⚠️ [${new Date().toLocaleTimeString()}] ALERTE RAPIDE: ${report.status}`);
                console.log(`📊 ${report.fileCount} fichiers | ${report.alerts.length} alertes`);
                
                // Auto-correction si chaos critique
                if (report.status === 'CHAOS_CRITIQUE') {
                    this.surveillance.autoCleanupIfNeeded(report);
                }
            }
        } catch (error) {
            console.error(`❌ Erreur surveillance rapide: ${error.message}`);
        }
    }

    completeCheck() {
        console.log(`\n🔍 [${new Date().toLocaleTimeString()}] VÉRIFICATION COMPLÈTE`);
        this.surveillance.generateDashboard();
    }

    initialCheck() {
        console.log('\n🔍 VÉRIFICATION INITIALE:');
        this.surveillance.generateDashboard();
    }

    stopSurveillance() {
        console.log('\n🛑 ARRÊT SURVEILLANCE AUTOMATISÉE');
        
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
        this.isRunning = false;
        
        console.log('✅ Surveillance arrêtée');
    }

    getStatus() {
        return {
            running: this.isRunning,
            activeIntervals: this.intervals.length,
            schedule: this.schedule
        };
    }
}

// GESTION SIGNAUX SYSTÈME
process.on('SIGINT', () => {
    console.log('\n⚠️ Signal SIGINT reçu - Arrêt propre...');
    if (global.automatedSurveillance) {
        global.automatedSurveillance.stopSurveillance();
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n⚠️ Signal SIGTERM reçu - Arrêt propre...');
    if (global.automatedSurveillance) {
        global.automatedSurveillance.stopSurveillance();
    }
    process.exit(0);
});

// LANCEMENT AUTO
if (require.main === module) {
    global.automatedSurveillance = new AutomatedSurveillance();
    
    if (process.argv.includes('--daemon')) {
        // Mode daemon - surveillance continue
        global.automatedSurveillance.startSurveillance();
        
        // Empêcher l'arrêt du script
        process.stdin.resume();
    } else {
        // Mode test - juste une vérification
        console.log('🧪 MODE TEST - Surveillance unique');
        const surveillance = new ContinuousSurveillance();
        surveillance.generateDashboard();
        console.log('\n💡 Pour surveillance continue: node automated_surveillance.js --daemon');
    }
}

module.exports = AutomatedSurveillance;
