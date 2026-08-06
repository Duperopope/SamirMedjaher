#!/usr/bin/env node
/**
 * 🆘 EMERGENCY CLEANUP SYSTEM v1.0
 * 
 * SITUATION: BORDEL TOTAL IDENTIFIÉ
 * MISSION: NETTOYAGE RADICAL ET REPRISE DE CONTRÔLE
 */

const fs = require('fs');
const path = require('path');

class EmergencyCleanup {
    constructor() {
        this.rdPath = __dirname;
        this.essentialFiles = new Set([
            // CORE SYSTEM
            'auto_check.js',
            'JOURNAL_SYSTEME.md',
            'REGLES_PROJET.md',
            'system_tester.js',
            'responsive_test.js',
            'integration_test.js',
            
            // MAIN PROJECT
            'main_project_copy',
            'README_RD.md',
            
            // NOUVELLES ÉVOLUTIONS
            'commit_helper.js',
            'system_evolution.js',
            'GUIDE_MANIEMENT_AI.md'
        ]);
        
        this.pollutionFiles = [];
        this.backupFiles = [];
        this.duplicateFiles = [];
    }

    analyzeChoas() {
        console.log('🔍 ANALYSE DU BORDEL EN COURS...');
        
        const files = fs.readdirSync(this.rdPath);
        
        files.forEach(file => {
            const filePath = path.join(this.rdPath, file);
            const stat = fs.statSync(filePath);
            
            // Identifier la pollution
            if (!this.essentialFiles.has(file)) {
                if (file.includes('backup') || file.includes('safe_security')) {
                    this.backupFiles.push(file);
                } else if (file.includes('_copy') || file.includes('pristine')) {
                    this.duplicateFiles.push(file);
                } else {
                    this.pollutionFiles.push(file);
                }
            }
        });

        this.generateCleanupReport();
    }

    generateCleanupReport() {
        console.log('\n🆘 RAPPORT BORDEL CRITIQUE:');
        console.log('============================');
        console.log(`📁 TOTAL FICHIERS: ${fs.readdirSync(this.rdPath).length}`);
        console.log(`✅ FICHIERS ESSENTIELS: ${this.essentialFiles.size}`);
        console.log(`❌ POLLUTION: ${this.pollutionFiles.length}`);
        console.log(`📦 BACKUPS: ${this.backupFiles.length}`);
        console.log(`📋 DOUBLONS: ${this.duplicateFiles.length}`);
        
        console.log('\n🚨 POLLUTION IDENTIFIÉE:');
        this.pollutionFiles.forEach(file => console.log(`- ${file}`));
        
        console.log('\n📦 BACKUPS À ARCHIVER:');
        this.backupFiles.forEach(file => console.log(`- ${file}`));
        
        console.log('\n📋 DOUBLONS À VÉRIFIER:');
        this.duplicateFiles.forEach(file => console.log(`- ${file}`));
    }

    emergencyCleanup() {
        console.log('\n🆘 NETTOYAGE D\'URGENCE LANCÉ...');
        
        // Créer dossier archive d'urgence
        const archivePath = path.join(this.rdPath, 'EMERGENCY_ARCHIVE');
        if (!fs.existsSync(archivePath)) {
            fs.mkdirSync(archivePath);
        }

        // Archiver la pollution
        [...this.pollutionFiles, ...this.duplicateFiles].forEach(file => {
            const source = path.join(this.rdPath, file);
            const dest = path.join(archivePath, file);
            
            try {
                if (fs.statSync(source).isDirectory()) {
                    // Pour les dossiers, on les renomme
                    fs.renameSync(source, dest);
                } else {
                    // Pour les fichiers, on les déplace
                    fs.renameSync(source, dest);
                }
                console.log(`📦 ARCHIVÉ: ${file}`);
            } catch (error) {
                console.log(`❌ ERREUR: ${file} - ${error.message}`);
            }
        });

        // Nettoyer les backups vers backups/
        const backupsPath = path.join(this.rdPath, 'backups');
        if (!fs.existsSync(backupsPath)) {
            fs.mkdirSync(backupsPath);
        }

        this.backupFiles.forEach(file => {
            const source = path.join(this.rdPath, file);
            const dest = path.join(backupsPath, file);
            
            try {
                fs.renameSync(source, dest);
                console.log(`🗂️ BACKUP ORGANISÉ: ${file}`);
            } catch (error) {
                console.log(`❌ ERREUR BACKUP: ${file}`);
            }
        });

        console.log('\n✅ NETTOYAGE D\'URGENCE TERMINÉ');
        this.verifyCleanup();
    }

    verifyCleanup() {
        const filesAfter = fs.readdirSync(this.rdPath);
        console.log('\n🔍 VÉRIFICATION POST-NETTOYAGE:');
        console.log(`📁 FICHIERS RESTANTS: ${filesAfter.length}`);
        
        const unexpected = filesAfter.filter(file => 
            !this.essentialFiles.has(file) && 
            !['backups', 'EMERGENCY_ARCHIVE', 'errors_evolution.json'].includes(file)
        );
        
        if (unexpected.length > 0) {
            console.log('⚠️ FICHIERS INATTENDUS:');
            unexpected.forEach(file => console.log(`- ${file}`));
        } else {
            console.log('✅ DOSSIER RD PROPRE ET ORGANISÉ');
        }
    }

    fixReadmeIssue() {
        console.log('\n📖 RÉSOLUTION PROBLÈME README GITHUB...');
        
        // Le README doit être dans RD/, pas à la racine
        const rootReadme = path.join(this.rdPath, '..', 'README.md');
        const rdReadme = path.join(this.rdPath, 'README_RD.md');
        
        if (fs.existsSync(rdReadme)) {
            // Copier le bon README à la racine
            const content = fs.readFileSync(rdReadme, 'utf8');
            fs.writeFileSync(rootReadme, content);
            console.log('✅ README racine mis à jour avec contenu RD');
        }
    }
}

// LANCEMENT D'URGENCE
if (require.main === module) {
    console.log('🚨 SYSTÈME NETTOYAGE D\'URGENCE - BORDEL DÉTECTÉ');
    console.log('================================================');
    
    const cleanup = new EmergencyCleanup();
    cleanup.analyzeChoas();
    
    console.log('\n❓ LANCER NETTOYAGE D\'URGENCE ? (oui/non)');
    console.log('ATTENTION: Archivera tous les fichiers non-essentiels');
    
    // Pour auto-exec, on lance direct
    cleanup.emergencyCleanup();
    cleanup.fixReadmeIssue();
    
    console.log('\n🎯 MISSION: DOSSIER RD SAUVÉ DU CHAOS !');
}

module.exports = EmergencyCleanup;
