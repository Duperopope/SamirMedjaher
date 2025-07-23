// Preview System - Apply changes to main project for testing
const fs = require('fs');
const path = require('path');

class PreviewSystem {
    constructor() {
        this.projectRoot = 'g:/Code/CV';
        this.rdPath = path.join(this.projectRoot, 'RD');
        this.mainIndex = path.join(this.projectRoot, 'index.html');
        this.copyIndex = path.join(this.rdPath, 'main_project_copy', 'index.html');
        this.backupIndex = path.join(this.rdPath, 'backups', `index_backup_${Date.now()}.html`);
    }

    // Apply changes from RD copy to main project
    async applyChangesToMain() {
        console.log('🔄 Application des changements du RD au projet principal...');
        
        try {
            // Create backup of current main file
            if (fs.existsSync(this.mainIndex)) {
                const backupDir = path.dirname(this.backupIndex);
                if (!fs.existsSync(backupDir)) {
                    fs.mkdirSync(backupDir, { recursive: true });
                }
                fs.copyFileSync(this.mainIndex, this.backupIndex);
                console.log(`💾 Backup créé: ${this.backupIndex}`);
            }

            // Copy from RD to main
            if (fs.existsSync(this.copyIndex)) {
                fs.copyFileSync(this.copyIndex, this.mainIndex);
                console.log('✅ Changements appliqués au projet principal');
                console.log('🌐 Vous pouvez maintenant tester: file:///G:/Code/CV/index.html');
                return true;
            } else {
                console.log('❌ Aucune copie RD trouvée');
                return false;
            }
        } catch (error) {
            console.error('❌ Erreur lors de l\'application:', error.message);
            return false;
        }
    }

    // Restore backup if needed
    async restoreBackup() {
        console.log('⏪ Restauration du backup...');
        
        try {
            const backups = fs.readdirSync(path.dirname(this.backupIndex))
                .filter(file => file.startsWith('index_backup_'))
                .sort()
                .reverse();

            if (backups.length === 0) {
                console.log('❌ Aucun backup trouvé');
                return false;
            }

            const latestBackup = path.join(path.dirname(this.backupIndex), backups[0]);
            fs.copyFileSync(latestBackup, this.mainIndex);
            console.log(`✅ Backup restauré: ${backups[0]}`);
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de la restauration:', error.message);
            return false;
        }
    }

    // Sync main changes back to RD copy
    async syncMainToRD() {
        console.log('🔄 Synchronisation du projet principal vers RD...');
        
        try {
            if (fs.existsSync(this.mainIndex)) {
                fs.copyFileSync(this.mainIndex, this.copyIndex);
                console.log('✅ Projet principal synchronisé vers RD');
                return true;
            } else {
                console.log('❌ Fichier principal non trouvé');
                return false;
            }
        } catch (error) {
            console.error('❌ Erreur lors de la synchronisation:', error.message);
            return false;
        }
    }

    // Show current status
    getStatus() {
        const mainExists = fs.existsSync(this.mainIndex);
        const copyExists = fs.existsSync(this.copyIndex);
        
        let mainSize = 0, copySize = 0;
        let mainModified = 'N/A', copyModified = 'N/A';

        if (mainExists) {
            const stats = fs.statSync(this.mainIndex);
            mainSize = stats.size;
            mainModified = stats.mtime.toLocaleString();
        }

        if (copyExists) {
            const stats = fs.statSync(this.copyIndex);
            copySize = stats.size;
            copyModified = stats.mtime.toLocaleString();
        }

        return {
            mainProject: {
                exists: mainExists,
                size: mainSize,
                lastModified: mainModified,
                testUrl: 'file:///G:/Code/CV/index.html'
            },
            rdCopy: {
                exists: copyExists,
                size: copySize,
                lastModified: copyModified
            },
            needsSync: mainExists && copyExists && (mainSize !== copySize)
        };
    }

    displayStatus() {
        const status = this.getStatus();
        
        console.log('📋 STATUS PREVIEW SYSTEM');
        console.log('─'.repeat(30));
        
        console.log('🎯 PROJET PRINCIPAL:');
        if (status.mainProject.exists) {
            console.log(`   ✅ Existe (${Math.round(status.mainProject.size/1024)}KB)`);
            console.log(`   📅 Modifié: ${status.mainProject.lastModified}`);
            console.log(`   🌐 Test URL: ${status.mainProject.testUrl}`);
        } else {
            console.log('   ❌ N\'existe pas');
        }

        console.log('\n🔬 COPIE RD:');
        if (status.rdCopy.exists) {
            console.log(`   ✅ Existe (${Math.round(status.rdCopy.size/1024)}KB)`);
            console.log(`   📅 Modifié: ${status.rdCopy.lastModified}`);
        } else {
            console.log('   ❌ N\'existe pas');
        }

        if (status.needsSync) {
            console.log('\n⚠️ Les fichiers ne sont pas synchronisés');
        } else {
            console.log('\n✅ Fichiers synchronisés');
        }

        console.log('\n🎮 COMMANDES:');
        console.log('   apply    - Appliquer RD → Principal');
        console.log('   sync     - Principal → RD');
        console.log('   restore  - Restaurer backup');
        console.log('   status   - Afficher ce status');
    }
}

// CLI Interface
if (require.main === module) {
    const preview = new PreviewSystem();
    const command = process.argv[2];

    switch (command) {
        case 'apply':
            preview.applyChangesToMain();
            break;
        case 'sync':
            preview.syncMainToRD();
            break;
        case 'restore':
            preview.restoreBackup();
            break;
        case 'status':
            preview.displayStatus();
            break;
        default:
            console.log('Usage: node preview_system.js [apply|sync|restore|status]');
            preview.displayStatus();
    }
}

module.exports = { PreviewSystem };
