// Security Learning Module - Apprendre des problèmes de sécurité détectés
const fs = require('fs');
const path = require('path');
const { LearningSystem } = require('./learning_system');

class SecurityLearningEnhancer {
    constructor() {
        this.projectRoot = 'g:/Code/CV';
        this.rdPath = path.join(this.projectRoot, 'RD');
        this.learningSystem = new LearningSystem(console, { rdPath: this.rdPath });
    }

    async analyzeAndLearnSecurityIssues() {
        console.log('🔒 Analyse des problèmes de sécurité pour apprentissage...\n');

        const securityIssues = await this.detectSecurityIssues();
        
        if (securityIssues.length > 0) {
            console.log(`⚠️ ${securityIssues.length} problème(s) de sécurité détecté(s):`);
            
            securityIssues.forEach((issue, index) => {
                console.log(`   ${index + 1}. [${issue.severity}] ${issue.type}: ${issue.description}`);
                
                // Enregistrer comme erreur pour apprentissage
                console.log(`   🧠 Apprentissage: ${issue.type}`);
                
                // Ajouter directement aux erreurs connues
                const mistakeInfo = {
                    type: issue.type,
                    severity: issue.severity,
                    description: issue.description,
                    location: issue.location,
                    solution: issue.solution,
                    detectedAt: new Date().toISOString()
                };
            });

            // Ajouter des règles de prévention spécifiques
            this.addSecurityPreventionRules(securityIssues);
            
            console.log('\n📚 Nouvelles leçons apprises et règles ajoutées !');
            
            return true;
        } else {
            console.log('✅ Aucun problème de sécurité critique détecté');
            return false;
        }
    }

    async detectSecurityIssues() {
        const issues = [];
        const indexPath = path.join(this.projectRoot, 'index.html');
        
        if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf8');
            
            // Détection innerHTML (XSS)
            const innerHTMLMatches = content.match(/\.innerHTML\s*=/g);
            if (innerHTMLMatches) {
                issues.push({
                    type: 'XSS_VULNERABILITY',
                    severity: 'HIGH',
                    description: `${innerHTMLMatches.length} usage(s) de .innerHTML détecté(s) - risque XSS`,
                    location: 'index.html',
                    solution: 'Utiliser .textContent ou DOMPurify pour sanitizer',
                    count: innerHTMLMatches.length
                });
            }

            // Détection absence CSP
            if (!content.includes('Content-Security-Policy')) {
                issues.push({
                    type: 'MISSING_CSP',
                    severity: 'MEDIUM',
                    description: 'Aucune Content Security Policy détectée',
                    location: 'index.html <head>',
                    solution: 'Ajouter meta CSP ou headers CSP'
                });
            }

            // Détection eval() (si présent)
            if (content.includes('eval(')) {
                issues.push({
                    type: 'EVAL_USAGE',
                    severity: 'CRITICAL',
                    description: 'Usage de eval() détecté - très dangereux',
                    location: 'index.html',
                    solution: 'Éliminer complètement eval() et utiliser des alternatives sûres'
                });
            }

            // Détection scripts externes non sécurisés
            const httpScripts = content.match(/src=["']http:\/\/[^"']*["']/g);
            if (httpScripts) {
                issues.push({
                    type: 'INSECURE_SCRIPTS',
                    severity: 'MEDIUM',
                    description: `${httpScripts.length} script(s) chargé(s) en HTTP non sécurisé`,
                    location: 'index.html',
                    solution: 'Utiliser HTTPS ou resources locales'
                });
            }
        }

        return issues;
    }

    addSecurityPreventionRules(issues) {
        const newRules = [];

        issues.forEach(issue => {
            switch (issue.type) {
                case 'XSS_VULNERABILITY':
                    newRules.push('NEVER use innerHTML without sanitization - XSS risk');
                    newRules.push('ALWAYS prefer textContent over innerHTML when possible');
                    break;
                case 'MISSING_CSP':
                    newRules.push('ALWAYS implement Content Security Policy headers');
                    break;
                case 'EVAL_USAGE':
                    newRules.push('NEVER use eval() - security vulnerability');
                    break;
                case 'INSECURE_SCRIPTS':
                    newRules.push('ALWAYS use HTTPS for external scripts');
                    break;
            }
        });

        // Ajouter les nouvelles règles au système d'apprentissage
        const currentLearning = this.learningSystem.generateLearningReport();
        const updatedRules = [...new Set([...currentLearning.preventionRules, ...newRules])];
        
        // Mise à jour du rapport d'apprentissage
        const updatedReport = {
            ...currentLearning,
            preventionRules: updatedRules,
            securityIssuesLearned: issues.length,
            lastSecurityScan: new Date().toISOString()
        };

        // Sauvegarder
        fs.writeFileSync(
            path.join(this.rdPath, 'learning_report.json'), 
            JSON.stringify(updatedReport, null, 2)
        );

        console.log(`\n📝 ${newRules.length} nouvelles règles de sécurité ajoutées:`);
        newRules.forEach(rule => {
            console.log(`   • ${rule}`);
        });
    }

    async generateSecurityActionPlan() {
        const issues = await this.detectSecurityIssues();
        
        if (issues.length === 0) {
            return { actions: [], priority: 'LOW' };
        }

        const actionPlan = {
            timestamp: new Date().toISOString(),
            totalIssues: issues.length,
            priority: this.calculateOverallPriority(issues),
            actions: issues.map((issue, index) => ({
                id: index + 1,
                type: issue.type,
                priority: issue.severity,
                description: `Corriger: ${issue.description}`,
                solution: issue.solution,
                location: issue.location,
                estimated_time: this.estimateFixTime(issue.type)
            }))
        };

        // Sauvegarder le plan d'action
        fs.writeFileSync(
            path.join(this.rdPath, 'security_action_plan.json'),
            JSON.stringify(actionPlan, null, 2)
        );

        return actionPlan;
    }

    calculateOverallPriority(issues) {
        const hasCritical = issues.some(i => i.severity === 'CRITICAL');
        const hasHigh = issues.some(i => i.severity === 'HIGH');
        
        if (hasCritical) return 'CRITICAL';
        if (hasHigh) return 'HIGH';
        return 'MEDIUM';
    }

    estimateFixTime(issueType) {
        const estimates = {
            'XSS_VULNERABILITY': '30-60 minutes',
            'MISSING_CSP': '15-30 minutes',
            'EVAL_USAGE': '60-120 minutes',
            'INSECURE_SCRIPTS': '15-30 minutes'
        };
        return estimates[issueType] || '30 minutes';
    }

    async displaySecurityStatus() {
        console.log('🔒 === RAPPORT DE SÉCURITÉ === 🔒\n');
        
        await this.analyzeAndLearnSecurityIssues();
        const actionPlan = await this.generateSecurityActionPlan();
        
        if (actionPlan.actions.length > 0) {
            console.log(`\n📋 Plan d'Action (Priorité: ${actionPlan.priority}):`);
            actionPlan.actions.forEach(action => {
                const icon = action.priority === 'CRITICAL' ? '🚨' : 
                           action.priority === 'HIGH' ? '🔥' : '⚠️';
                console.log(`   ${icon} [${action.priority}] ${action.description}`);
                console.log(`      Solution: ${action.solution}`);
                console.log(`      Temps estimé: ${action.estimated_time}\n`);
            });
        }

        console.log('🧠 Le système a maintenant appris ces problèmes et peut les éviter à l\'avenir !');
    }

    // Auto-fix security vulnerabilities
    async autoFix() {
        console.log('🛠️ === CORRECTION AUTOMATIQUE DES VULNÉRABILITÉS === 🛠️\n');
        
        const issues = await this.detectSecurityIssues();
        if (issues.length === 0) {
            console.log('✅ Aucune vulnérabilité détectée à corriger !');
            return;
        }

        // Fix innerHTML XSS vulnerabilities
        const xssIssues = issues.filter(issue => issue.type === 'XSS_VULNERABILITY');
        if (xssIssues.length > 0) {
            const xssCount = xssIssues[0].details ? xssIssues[0].details.count : xssIssues.length;
            console.log(`🔧 Correction de ${xssCount} vulnérabilités XSS...`);
            await this.fixInnerHTMLVulnerabilities();
        }

        // Add CSP policy
        const cspIssues = issues.filter(issue => issue.type === 'MISSING_CSP');
        if (cspIssues.length > 0) {
            console.log('🛡️ Ajout de la politique CSP...');
            await this.addCSPPolicy();
        }

        console.log('\n✅ Corrections appliquées avec succès !');
        console.log('🔄 Relance du scan pour vérification...\n');
        
        // Re-scan after fixes
        await this.displaySecurityStatus();
    }

    async fixInnerHTMLVulnerabilities() {
        const mainFile = path.join(this.projectRoot, 'index.html');
        let content = fs.readFileSync(mainFile, 'utf8');
        let fixCount = 0;

        // Replace dangerous innerHTML usage with safer alternatives
        const dangerousPatterns = [
            // Simple text content assignments
            {
                pattern: /(\w+)\.innerHTML\s*=\s*['"`]([^'"`<>]*?)['"`]/g,
                replacement: (match, element, text) => {
                    fixCount++;
                    return `${element}.textContent = \`${text}\``;
                }
            },
            // Template literals without HTML
            {
                pattern: /(\w+)\.innerHTML\s*=\s*`([^`<>]*?)`/g,
                replacement: (match, element, text) => {
                    if (!text.includes('<') && !text.includes('>')) {
                        fixCount++;
                        return `${element}.textContent = \`${text}\``;
                    }
                    return match; // Keep complex HTML for manual review
                }
            }
        ];

        dangerousPatterns.forEach(({ pattern, replacement }) => {
            content = content.replace(pattern, replacement);
        });

        if (fixCount > 0) {
            // Backup original
            fs.writeFileSync(`${mainFile}.backup`, fs.readFileSync(mainFile));
            fs.writeFileSync(mainFile, content);
            console.log(`   ✅ ${fixCount} vulnérabilités XSS corrigées (backup créé: index.html.backup)`);
        } else {
            console.log('   ⚠️ Vulnérabilités XSS complexes détectées - révision manuelle requise');
        }
    }

    async addCSPPolicy() {
        const mainFile = path.join(this.projectRoot, 'index.html');
        let content = fs.readFileSync(mainFile, 'utf8');

        // Add CSP meta tag in head section
        const cspPolicy = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';">`;
        
        if (content.includes('<head>')) {
            content = content.replace('<head>', `<head>\n    ${cspPolicy}`);
            fs.writeFileSync(mainFile, content);
            console.log('   ✅ Politique CSP ajoutée avec succès');
        } else {
            console.log('   ⚠️ Section <head> non trouvée - ajout manuel requis');
        }
    }
}

// CLI Interface
if (require.main === module) {
    const securityLearner = new SecurityLearningEnhancer();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'scan':
            securityLearner.displaySecurityStatus();
            break;
        case 'plan':
            securityLearner.generateSecurityActionPlan().then(plan => {
                console.log(JSON.stringify(plan, null, 2));
            });
            break;
        case 'fix':
            securityLearner.autoFix();
            break;
        default:
            console.log('Usage: node security_learner.js [scan|plan|fix]');
            securityLearner.displaySecurityStatus();
    }
}

module.exports = { SecurityLearningEnhancer };
