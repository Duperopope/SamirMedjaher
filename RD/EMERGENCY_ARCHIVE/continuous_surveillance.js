#!/usr/bin/env node
/**
 * 🔍 SYSTÈME SURVEILLANCE CONTINUE v1.0
 * 
 * MISSION : Vérifier régulièrement que le système reste sous contrôle
 * OBJECTIF : Détecter le chaos AVANT qu'il devienne critique
 * PRÉVENTION : Auto-nettoyage et alertes précoces
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ContinuousSurveillance {
    constructor() {
        this.rdPath = __dirname;
        this.logFile = path.join(this.rdPath, 'surveillance.log');
        
        // SEUILS DE CONTRÔLE
        this.maxFiles = 20; // Plus de 20 fichiers = ALERTE
        this.criticalFiles = 30; // Plus de 30 = CHAOS CRITIQUE
        
        // FICHIERS ESSENTIELS (ne doivent PAS disparaître)
        this.essentialFiles = [
            'auto_check.js',
            'JOURNAL_SYSTEME.md',
            'REGLES_PROJET.md',
            'system_tester.js',
            'main_project_copy',
            'README_RD.md'
        ];
        
        // PATTERNS DE POLLUTION (à surveiller)
        this.pollutionPatterns = [
            /.*backup.*/i,
            /.*temp.*/i,
            /.*old.*/i,
            /.*copy.*/i,
            /.*test_.*\.json$/i,
            /.*_report\.json$/i,
            /.*\.log$/i,
            /.*pristine.*/i
        ];
    }

    checkSystemHealth() {
        const timestamp = new Date().toISOString();
        const report = {
            timestamp,
            status: 'OK',
            alerts: [],
            files: [],
            recommendations: []
        };

        try {
            // 1. COMPTER LES FICHIERS
            const files = fs.readdirSync(this.rdPath);
            report.files = files;
            report.fileCount = files.length;

            // 2. VÉRIFIER SEUILS
            if (report.fileCount > this.criticalFiles) {
                report.status = 'CHAOS_CRITIQUE';
                report.alerts.push(`🚨 CHAOS CRITIQUE: ${report.fileCount} fichiers (limite: ${this.criticalFiles})`);
                report.recommendations.push('LANCER EMERGENCY CLEANUP IMMÉDIATEMENT');
            } else if (report.fileCount > this.maxFiles) {
                report.status = 'ALERTE';
                report.alerts.push(`⚠️ ALERTE: ${report.fileCount} fichiers (limite: ${this.maxFiles})`);
                report.recommendations.push('Prévoir nettoyage préventif');
            }

            // 3. VÉRIFIER FICHIERS ESSENTIELS
            const missingEssentials = this.essentialFiles.filter(file => !files.includes(file));
            if (missingEssentials.length > 0) {
                report.status = 'CORRUPTION';
                report.alerts.push(`💥 FICHIERS ESSENTIELS MANQUANTS: ${missingEssentials.join(', ')}`);
                report.recommendations.push('RESTAURER FICHIERS ESSENTIELS URGENCE');
            }

            // 4. DÉTECTER POLLUTION
            const pollutionFiles = files.filter(file => 
                this.pollutionPatterns.some(pattern => pattern.test(file))
            );
            
            if (pollutionFiles.length > 5) {
                if (report.status === 'OK') report.status = 'POLLUTION';
                report.alerts.push(`🗑️ POLLUTION DÉTECTÉE: ${pollutionFiles.length} fichiers suspects`);
                report.recommendations.push('Nettoyage pollution recommandé');
            }

            // 5. VÉRIFIER GIT STATUS
            try {
                const gitStatus = execSync('git status --porcelain', { 
                    cwd: path.dirname(this.rdPath), 
                    encoding: 'utf8' 
                }).trim();
                
                if (gitStatus) {
                    const modifiedFiles = gitStatus.split('\n').length;
                    if (modifiedFiles > 10) {
                        report.alerts.push(`📝 NOMBREUX FICHIERS MODIFIÉS: ${modifiedFiles}`);
                        report.recommendations.push('Commit recommandé pour stabilité');
                    }
                }
            } catch (gitError) {
                report.alerts.push('⚠️ Impossible de vérifier statut Git');
            }

            this.logSurveilance(report);
            return report;

        } catch (error) {
            report.status = 'ERREUR';
            report.alerts.push(`💥 ERREUR SURVEILLANCE: ${error.message}`);
            this.logSurveilance(report);
            return report;
        }
    }

    logSurveilance(report) {
        const logEntry = `${report.timestamp} | ${report.status} | ${report.fileCount} fichiers | ${report.alerts.length} alertes\n`;
        fs.appendFileSync(this.logFile, logEntry);
    }

    autoCleanupIfNeeded(report) {
        if (report.status === 'CHAOS_CRITIQUE') {
            console.log('🆘 CHAOS CRITIQUE DÉTECTÉ - LANCEMENT AUTO-CLEANUP');
            try {
                // Lancer emergency cleanup
                const EmergencyCleanup = require('./emergency_cleanup.js');
                const cleanup = new EmergencyCleanup();
                cleanup.analyzeChoas();
                cleanup.emergencyCleanup();
                
                console.log('✅ AUTO-CLEANUP TERMINÉ - SYSTÈME SAUVÉ');
                return true;
            } catch (error) {
                console.error('❌ ÉCHEC AUTO-CLEANUP:', error.message);
                return false;
            }
        }
        return false;
    }

    generateDashboard() {
        const report = this.checkSystemHealth();
        
        console.log('\n🔍 SURVEILLANCE SYSTÈME RD - RAPPORT TEMPS RÉEL');
        console.log('================================================');
        console.log(`📅 Date: ${new Date().toLocaleString()}`);
        console.log(`🎯 Statut: ${this.getStatusIcon(report.status)} ${report.status}`);
        console.log(`📊 Fichiers: ${report.fileCount}/${this.maxFiles} (limite)`);
        
        if (report.alerts.length > 0) {
            console.log('\n🚨 ALERTES:');
            report.alerts.forEach(alert => console.log(`   ${alert}`));
        }
        
        if (report.recommendations.length > 0) {
            console.log('\n💡 RECOMMANDATIONS:');
            report.recommendations.forEach(rec => console.log(`   - ${rec}`));
        }

        // AUTO-ACTIONS
        if (report.status === 'CHAOS_CRITIQUE') {
            console.log('\n🆘 LANCEMENT AUTO-CLEANUP...');
            this.autoCleanupIfNeeded(report);
        }

        console.log(`\n📈 Historique: ${this.logFile}`);
        return report;
    }

    getStatusIcon(status) {
        const icons = {
            'OK': '✅',
            'ALERTE': '⚠️',
            'POLLUTION': '🗑️',
            'CHAOS_CRITIQUE': '🚨',
            'CORRUPTION': '💥',
            'ERREUR': '❌'
        };
        return icons[status] || '❓';
    }

    setupContinuousMonitoring(intervalMinutes = 30) {
        console.log(`🔄 SURVEILLANCE CONTINUE ACTIVÉE (${intervalMinutes} min)`);
        
        // Surveillance initiale
        this.generateDashboard();
        
        // Surveillance périodique
        setInterval(() => {
            console.log('\n🔍 VÉRIFICATION PÉRIODIQUE...');
            const report = this.checkSystemHealth();
            
            if (report.status !== 'OK') {
                console.log(`\n⚠️ CHANGEMENT STATUT: ${report.status}`);
                this.generateDashboard();
            }
            
        }, intervalMinutes * 60 * 1000);
    }
}

// UTILISATION DIRECTE
if (require.main === module) {
    const surveillance = new ContinuousSurveillance();
    
    // Mode dashboard unique
    if (process.argv.includes('--dashboard')) {
        surveillance.generateDashboard();
    }
    // Mode surveillance continue
    else if (process.argv.includes('--monitor')) {
        surveillance.setupContinuousMonitoring(15); // Toutes les 15 min
    }
    // Mode check unique (par défaut)
    else {
        surveillance.generateDashboard();
    }
}

module.exports = ContinuousSurveillance;
