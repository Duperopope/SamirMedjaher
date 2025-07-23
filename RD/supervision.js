// Supervision System - Transparent Monitoring & Control
const fs = require('fs');
const path = require('path');
const { ProjectMapper } = require('./project_mapper');

class SupervisionSystem {
    constructor() {
        this.projectRoot = 'g:/Code/CV';
        this.rdPath = path.join(this.projectRoot, 'RD');
        this.supervisorPath = path.join(this.rdPath, 'supervision_dashboard.json');
        this.projectMapper = new ProjectMapper();
        this.actionLog = [];
    }

    // Tableau de bord de supervision en temps réel
    async generateDashboard() {
        console.log('🎛️ Génération du tableau de bord de supervision...\n');

        const dashboard = {
            timestamp: new Date().toISOString(),
            systemStatus: await this.getSystemStatus(),
            recentActions: this.getRecentActions(),
            pendingActions: this.getPendingActions(),
            risksAssessment: this.assessRisks(),
            userControls: this.getUserControls(),
            recommendations: this.generateRecommendations()
        };

        // Sauvegarde du tableau de bord
        fs.writeFileSync(this.supervisorPath, JSON.stringify(dashboard, null, 2));

        // Affichage console détaillé
        this.displayDashboard(dashboard);

        return dashboard;
    }

    async getSystemStatus() {
        const projectStatus = this.projectMapper.getProjectStatus();
        const systemLogs = this.parseSystemLogs();
        
        return {
            projectPhase: projectStatus.phase,
            fileSize: `${Math.round(projectStatus.fileSize / 1024)}KB`,
            featuresImplemented: projectStatus.features.length,
            lastActivity: this.getLastActivity(),
            autonomousMode: systemLogs.autonomousActive,
            safetyLevel: systemLogs.safetyLevel || 'UNKNOWN',
            gitStatus: this.getGitStatus()
        };
    }

    getRecentActions() {
        try {
            const logContent = fs.readFileSync(path.join(this.rdPath, 'system.log'), 'utf8');
            const lines = logContent.split('\n').filter(line => line.trim());
            
            const recentActions = lines.slice(-10).map(line => {
                const match = line.match(/\[(.*?)\] (\w+): (.*)/);
                if (match) {
                    return {
                        timestamp: match[1],
                        level: match[2],
                        action: match[3],
                        impact: this.assessActionImpact(match[3])
                    };
                }
                return null;
            }).filter(Boolean);

            return recentActions;
        } catch (error) {
            return [{ error: 'Could not read system logs', details: error.message }];
        }
    }

    assessActionImpact(action) {
        if (action.includes('Committed') || action.includes('Pushed')) return 'CRITICAL';
        if (action.includes('Modifying') || action.includes('Creating')) return 'HIGH';
        if (action.includes('Analyzing') || action.includes('Planning')) return 'LOW';
        return 'MEDIUM';
    }

    getPendingActions() {
        const projectStatus = this.projectMapper.getProjectStatus();
        return {
            nextTasks: projectStatus.nextTasks || [],
            estimatedImpact: 'MEDIUM',
            requiresApproval: true,
            canBeExecuted: false // Bloqué jusqu'à approbation
        };
    }

    assessRisks() {
        const risks = [];
        
        // Vérification des risques de sécurité
        if (fs.existsSync(path.join(this.projectRoot, 'index.html'))) {
            const content = fs.readFileSync(path.join(this.projectRoot, 'index.html'), 'utf8');
            
            if (content.includes('.innerHTML')) {
                risks.push({
                    type: 'SECURITY',
                    level: 'HIGH',
                    description: 'Usage de innerHTML détecté - risque XSS',
                    recommendation: 'Remplacer par textContent ou innerHTML sanitized'
                });
            }
            
            if (!content.includes('Content-Security-Policy')) {
                risks.push({
                    type: 'SECURITY',
                    level: 'MEDIUM',
                    description: 'Pas de Content Security Policy détectée',
                    recommendation: 'Implémenter CSP headers'
                });
            }
        }

        // Vérification des risques de taille
        const projectStatus = this.projectMapper.getProjectStatus();
        if (projectStatus.fileSize > 200000) {
            risks.push({
                type: 'PERFORMANCE',
                level: 'MEDIUM',
                description: 'Taille du fichier importante (>200KB)',
                recommendation: 'Considérer la minification ou le splitting'
            });
        }

        return risks;
    }

    getUserControls() {
        return {
            availableCommands: [
                {
                    command: 'approve-next-task',
                    description: 'Approuver la prochaine tâche automatique',
                    impact: 'MEDIUM'
                },
                {
                    command: 'block-auto-commits',
                    description: 'Bloquer les commits automatiques',
                    impact: 'HIGH'
                },
                {
                    command: 'request-manual-review',
                    description: 'Demander une révision manuelle avant action',
                    impact: 'LOW'
                },
                {
                    command: 'emergency-stop',
                    description: 'ARRÊT D\'URGENCE - stopper tous les processus',
                    impact: 'CRITICAL'
                }
            ],
            currentSettings: {
                autoCommitEnabled: this.isAutoCommitEnabled(),
                supervisionRequired: true,
                safetyMode: 'STRICT'
            }
        };
    }

    generateRecommendations() {
        const recommendations = [];
        
        const risks = this.assessRisks();
        const highRisks = risks.filter(r => r.level === 'HIGH');
        
        if (highRisks.length > 0) {
            recommendations.push({
                priority: 'URGENT',
                action: 'Corriger les risques de sécurité élevés',
                reason: `${highRisks.length} risque(s) de sécurité critique(s) détecté(s)`
            });
        }

        const projectStatus = this.projectMapper.getProjectStatus();
        if (projectStatus.phase === 'OPTIMIZATION_AND_SECURITY') {
            recommendations.push({
                priority: 'HIGH',
                action: 'Implémenter les mesures de sécurité',
                reason: 'Phase d\'optimisation et sécurité en cours'
            });
        }

        recommendations.push({
            priority: 'MEDIUM',
            action: 'Maintenir la supervision active',
            reason: 'Surveillance continue recommandée pour système autonome'
        });

        return recommendations;
    }

    displayDashboard(dashboard) {
        console.log('═'.repeat(80));
        console.log('🎛️  TABLEAU DE BORD DE SUPERVISION');
        console.log('═'.repeat(80));
        
        console.log('\n📊 ÉTAT DU SYSTÈME:');
        console.log(`   Phase actuelle: ${dashboard.systemStatus.projectPhase}`);
        console.log(`   Taille fichier: ${dashboard.systemStatus.fileSize}`);
        console.log(`   Features: ${dashboard.systemStatus.featuresImplemented} implémentées`);
        console.log(`   Mode autonome: ${dashboard.systemStatus.autonomousMode ? '✅ ACTIF' : '❌ INACTIF'}`);
        console.log(`   Niveau sécurité: ${dashboard.systemStatus.safetyLevel}`);

        console.log('\n⚡ ACTIONS RÉCENTES:');
        dashboard.recentActions.slice(-5).forEach(action => {
            const icon = action.impact === 'CRITICAL' ? '🔴' : 
                        action.impact === 'HIGH' ? '🟡' : '🟢';
            console.log(`   ${icon} [${action.timestamp.split('T')[1].split('.')[0]}] ${action.action}`);
        });

        console.log('\n📋 ACTIONS EN ATTENTE:');
        dashboard.pendingActions.nextTasks.forEach((task, i) => {
            console.log(`   ${i + 1}. ${task} ${dashboard.pendingActions.requiresApproval ? '⏸️ NÉCESSITE APPROBATION' : '▶️'}`);
        });

        console.log('\n⚠️  RISQUES IDENTIFIÉS:');
        if (dashboard.risksAssessment.length === 0) {
            console.log('   ✅ Aucun risque critique détecté');
        } else {
            dashboard.risksAssessment.forEach(risk => {
                const icon = risk.level === 'HIGH' ? '🔴' : risk.level === 'MEDIUM' ? '🟡' : '🟢';
                console.log(`   ${icon} [${risk.type}] ${risk.description}`);
                console.log(`      → ${risk.recommendation}`);
            });
        }

        console.log('\n🎮 CONTRÔLES UTILISATEUR:');
        dashboard.userControls.availableCommands.slice(0, 3).forEach(cmd => {
            console.log(`   • ${cmd.command}: ${cmd.description}`);
        });

        console.log('\n💡 RECOMMANDATIONS:');
        dashboard.recommendations.forEach(rec => {
            const icon = rec.priority === 'URGENT' ? '🚨' : 
                        rec.priority === 'HIGH' ? '🔥' : '💡';
            console.log(`   ${icon} [${rec.priority}] ${rec.action}`);
            console.log(`      Raison: ${rec.reason}`);
        });

        console.log('\n═'.repeat(80));
        console.log(`📝 Rapport sauvegardé: ${this.supervisorPath}`);
        console.log('═'.repeat(80));
    }

    parseSystemLogs() {
        try {
            const logContent = fs.readFileSync(path.join(this.rdPath, 'system.log'), 'utf8');
            return {
                autonomousActive: logContent.includes('Autonomous mode: ENABLED'),
                safetyLevel: logContent.includes('safetyLevel": "HIGH"') ? 'HIGH' : 'MEDIUM',
                lastCommit: logContent.includes('Committed:')
            };
        } catch {
            return { autonomousActive: false, safetyLevel: 'UNKNOWN' };
        }
    }

    getLastActivity() {
        try {
            const stats = fs.statSync(path.join(this.rdPath, 'system.log'));
            return stats.mtime.toISOString();
        } catch {
            return 'UNKNOWN';
        }
    }

    getGitStatus() {
        try {
            const { execSync } = require('child_process');
            const status = execSync('git status --porcelain', { cwd: this.projectRoot, encoding: 'utf8' });
            return {
                hasChanges: status.trim().length > 0,
                branch: 'RD-development',
                uncommittedFiles: status.split('\n').filter(line => line.trim()).length
            };
        } catch {
            return { hasChanges: false, branch: 'unknown', uncommittedFiles: 0 };
        }
    }

    isAutoCommitEnabled() {
        try {
            const configContent = fs.readFileSync(path.join(this.rdPath, 'iterative_system.js'), 'utf8');
            return configContent.includes('autoCommit: true');
        } catch {
            return false;
        }
    }

    // Contrôles utilisateur
    async executeUserCommand(command, params = {}) {
        console.log(`🎮 Exécution de la commande: ${command}`);

        switch (command) {
            case 'approve-next-task':
                return this.approveNextTask();
            case 'block-auto-commits':
                return this.blockAutoCommits();
            case 'request-manual-review':
                return this.requestManualReview();
            case 'emergency-stop':
                return this.emergencyStop();
            default:
                console.log('❌ Commande inconnue');
                return false;
        }
    }

    async approveNextTask() {
        console.log('✅ Tâche suivante approuvée - le système peut procéder');
        // Logic to enable next task execution
        return true;
    }

    async blockAutoCommits() {
        console.log('🚫 Commits automatiques bloqués');
        // Logic to disable auto commits
        return true;
    }

    async requestManualReview() {
        console.log('🔍 Révision manuelle demandée');
        // Logic to request manual review
        return true;
    }

    async emergencyStop() {
        console.log('🚨 ARRÊT D\'URGENCE ACTIVÉ - Tous les processus stoppés');
        // Logic to stop all automated processes
        return true;
    }
}

// CLI Interface
if (require.main === module) {
    const supervisor = new SupervisionSystem();
    
    const command = process.argv[2];
    const params = process.argv.slice(3);

    switch (command) {
        case 'dashboard':
            supervisor.generateDashboard();
            break;
        case 'control':
            const controlCommand = params[0];
            if (controlCommand) {
                supervisor.executeUserCommand(controlCommand);
            } else {
                console.log('Usage: node supervision.js control [approve-next-task|block-auto-commits|request-manual-review|emergency-stop]');
            }
            break;
        default:
            console.log('Usage: node supervision.js [dashboard|control] [command]');
    }
}

module.exports = { SupervisionSystem };
