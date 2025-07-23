#!/usr/bin/env node
/**
 * 🧠 SMART CLEANUP v2.0 - SYSTÈME ADAPTATIF
 * 
 * ÉVOLUTION : Apprentissage automatique des fichiers utiles
 * PRINCIPE : Analyse usage + journal + règles pour décider
 */

const fs = require('fs');
const path = require('path');

class SmartCleanup {
    constructor() {
        this.rdPath = __dirname;
        
        // CORE INTOUCHABLES
        this.coreFiles = new Set([
            'auto_check.js',
            'JOURNAL_SYSTEME.md', 
            'REGLES_PROJET.md',
            'main_project_copy'
        ]);
        
        // CATÉGORIES ADAPTATIVES
        this.categories = {
            testing: { pattern: /_test\.js$|test_.*\.js$/, keepIfUsed: true },
            helpers: { pattern: /_helper\.js$|helper_.*\.js$/, adaptToUsage: true },
            evolution: { pattern: /evolution|system_.*\.js$/, learnFromJournal: true },
            cleanup: { pattern: /cleanup|emergency/, temporaryByDefault: true },
            surveillance: { pattern: /surveillance|monitoring/, smartDecision: true },
            documentation: { pattern: /\.md$|GUIDE/, keepIfReferenced: true }
        };
    }

    async analyzeSystemAdaptively() {
        console.log('🧠 ANALYSE ADAPTATIVE EN COURS...');
        
        const files = fs.readdirSync(this.rdPath);
        const analysisResults = {
            core: [],
            useful: [],
            temporary: [],
            unknown: []
        };

        for (const file of files) {
            if (this.coreFiles.has(file)) {
                analysisResults.core.push(file);
                continue;
            }

            const analysis = await this.analyzeFileIntelligence(file);
            analysisResults[analysis.category].push({
                file: file,
                reason: analysis.reason,
                confidence: analysis.confidence
            });
        }

        return analysisResults;
    }

    async analyzeFileIntelligence(file) {
        // 1. ANALYSE USAGE RÉCENT
        const recentUsage = await this.checkRecentUsage(file);
        
        // 2. CONSULTATION JOURNAL
        const journalMentions = await this.checkJournalMentions(file);
        
        // 3. RÉFÉRENCES DANS CODE
        const codeReferences = await this.checkCodeReferences(file);
        
        // 4. ANALYSE CONTENU
        const contentAnalysis = await this.analyzeFileContent(file);
        
        // 5. DÉCISION INTELLIGENTE
        return this.makeIntelligentDecision(file, {
            recentUsage,
            journalMentions, 
            codeReferences,
            contentAnalysis
        });
    }

    async checkRecentUsage(file) {
        try {
            const stat = fs.statSync(path.join(this.rdPath, file));
            const daysSinceModified = (Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24);
            
            return {
                lastModified: daysSinceModified,
                recentlyUsed: daysSinceModified < 7,
                confidence: daysSinceModified < 1 ? 0.9 : daysSinceModified < 7 ? 0.7 : 0.3
            };
        } catch (error) {
            return { recentlyUsed: false, confidence: 0.1 };
        }
    }

    async checkJournalMentions(file) {
        try {
            const journalPath = path.join(this.rdPath, 'JOURNAL_SYSTEME.md');
            const journalContent = fs.readFileSync(journalPath, 'utf8');
            
            const mentions = (journalContent.match(new RegExp(file, 'g')) || []).length;
            const recentMention = journalContent.includes(`2025-07-23`) && journalContent.includes(file);
            
            return {
                mentionCount: mentions,
                recentlyMentioned: recentMention,
                confidence: mentions > 3 ? 0.8 : mentions > 0 ? 0.6 : 0.2
            };
        } catch (error) {
            return { mentionCount: 0, confidence: 0.2 };
        }
    }

    async checkCodeReferences(file) {
        try {
            const files = fs.readdirSync(this.rdPath).filter(f => f.endsWith('.js') && f !== file);
            let referenceCount = 0;
            
            for (const checkFile of files) {
                const content = fs.readFileSync(path.join(this.rdPath, checkFile), 'utf8');
                if (content.includes(file) || content.includes(file.replace('.js', ''))) {
                    referenceCount++;
                }
            }
            
            return {
                referenceCount,
                isReferenced: referenceCount > 0,
                confidence: referenceCount > 2 ? 0.9 : referenceCount > 0 ? 0.7 : 0.1
            };
        } catch (error) {
            return { referenceCount: 0, confidence: 0.1 };
        }
    }

    async analyzeFileContent(file) {
        try {
            const filePath = path.join(this.rdPath, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                return { type: 'directory', confidence: 0.8 };
            }
            
            const content = fs.readFileSync(filePath, 'utf8');
            
            // PATTERNS DE FICHIERS UTILES
            const patterns = {
                helper: /function|module\.exports|class.*Helper/i,
                system: /system|évolution|evolution/i,
                test: /test|describe|it\(|assert/i,
                documentation: /##|###|\*\*|\[.*\]/,
                temporary: /temp|tmp|emergency|cleanup/i,
                evolution: /PROBLÈME RÉSOLU|ERREUR|SOLUTION/i
            };
            
            const matches = {};
            let maxConfidence = 0;
            let detectedType = 'unknown';
            
            for (const [type, pattern] of Object.entries(patterns)) {
                if (pattern.test(content)) {
                    matches[type] = true;
                    const confidence = this.getTypeConfidence(type, content);
                    if (confidence > maxConfidence) {
                        maxConfidence = confidence;
                        detectedType = type;
                    }
                }
            }
            
            return {
                detectedType,
                patterns: matches,
                confidence: maxConfidence,
                size: stat.size
            };
            
        } catch (error) {
            return { detectedType: 'unknown', confidence: 0.1 };
        }
    }

    getTypeConfidence(type, content) {
        const confidenceMap = {
            helper: 0.8,
            system: 0.7,
            test: 0.9,
            documentation: 0.6,
            temporary: 0.2,
            evolution: 0.7
        };
        
        return confidenceMap[type] || 0.5;
    }

    makeIntelligentDecision(file, analysis) {
        let totalConfidence = 0;
        let decision = 'unknown';
        let reasons = [];

        // CALCUL PONDÉRÉ
        if (analysis.recentUsage.recentlyUsed) {
            totalConfidence += analysis.recentUsage.confidence * 0.3;
            reasons.push('Usage récent');
        }
        
        if (analysis.journalMentions.recentlyMentioned) {
            totalConfidence += analysis.journalMentions.confidence * 0.3;
            reasons.push('Mentionné dans journal');
        }
        
        if (analysis.codeReferences.isReferenced) {
            totalConfidence += analysis.codeReferences.confidence * 0.4;
            reasons.push('Référencé dans code');
        }

        // ANALYSE CONTENU
        const contentWeight = 0.2;
        totalConfidence += analysis.contentAnalysis.confidence * contentWeight;
        
        if (analysis.contentAnalysis.detectedType === 'helper') {
            reasons.push('Helper détecté');
        }

        // DÉCISION FINALE
        if (totalConfidence > 0.7) {
            decision = 'useful';
        } else if (totalConfidence > 0.4) {
            decision = 'temporary';
        } else {
            decision = 'unknown';
        }

        return {
            category: decision,
            confidence: totalConfidence,
            reason: reasons.join(', ') || 'Analyse automatique'
        };
    }

    async smartCleanup() {
        console.log('🧠 SMART CLEANUP v2.0 - SYSTÈME ADAPTATIF');
        console.log('==========================================');
        
        const analysis = await this.analyzeSystemAdaptively();
        
        console.log('\n📊 ANALYSE INTELLIGENTE:');
        console.log(`✅ CORE INTOUCHABLES: ${analysis.core.length}`);
        console.log(`💎 FICHIERS UTILES: ${analysis.useful.length}`);
        console.log(`🗑️ FICHIERS TEMPORAIRES: ${analysis.temporary.length}`);
        console.log(`❓ INCONNUS: ${analysis.unknown.length}`);

        // AFFICHER DÉTAILS
        if (analysis.useful.length > 0) {
            console.log('\n💎 FICHIERS GARDÉS (UTILES):');
            analysis.useful.forEach(item => {
                console.log(`  ✅ ${item.file} - ${item.reason} (${Math.round(item.confidence * 100)}%)`);
            });
        }

        if (analysis.temporary.length > 0) {
            console.log('\n🗑️ CANDIDATS NETTOYAGE:');
            analysis.temporary.forEach(item => {
                console.log(`  🗑️ ${item.file} - ${item.reason} (${Math.round(item.confidence * 100)}%)`);
            });
        }

        return analysis;
    }

    // MISE À JOUR RÈGLES AUTOMATIQUE
    async updateCleanupRules(analysis) {
        const rules = {
            lastUpdate: new Date().toISOString(),
            learnedPatterns: {
                helpers: analysis.useful.filter(f => f.file.includes('helper')).map(f => f.file),
                systems: analysis.useful.filter(f => f.file.includes('system')).map(f => f.file),
                tests: analysis.useful.filter(f => f.file.includes('test')).map(f => f.file)
            },
            confidenceThreshold: 0.7,
            version: '2.0'
        };

        fs.writeFileSync(
            path.join(this.rdPath, 'cleanup_rules.json'), 
            JSON.stringify(rules, null, 2)
        );

        console.log('📚 RÈGLES MISES À JOUR AUTOMATIQUEMENT');
    }
}

// EXÉCUTION SI APPELÉ DIRECTEMENT
if (require.main === module) {
    const cleanup = new SmartCleanup();
    cleanup.smartCleanup().then(analysis => {
        console.log('\n🎯 ANALYSE TERMINÉE - SYSTÈME ADAPTATIF PRÊT!');
        cleanup.updateCleanupRules(analysis);
    });
}

module.exports = SmartCleanup;
