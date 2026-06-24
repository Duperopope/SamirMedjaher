#!/usr/bin/env node
/**
 * 🧠 SYSTÈME AUTO-ÉVOLUTION v1.0
 * 
 * OBJECTIF : Le système apprend de ses erreurs et évolue automatiquement
 * PRINCIPE : Erreur → Analyse → Documentation → Prévention → Évolution
 */

const fs = require('fs');
const path = require('path');

class SystemEvolution {
    constructor() {
        this.errorsLog = path.join(__dirname, 'errors_evolution.json');
        this.rulesFile = path.join(__dirname, 'REGLES_PROJET.md');
        this.journalFile = path.join(__dirname, 'JOURNAL_SYSTEME.md');
    }

    // Enregistrer une nouvelle erreur pour apprentissage
    recordError(error) {
        const errorEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: error.type,
            description: error.description,
            symptom: error.symptom,
            cause: error.cause,
            solution: error.solution,
            prevention: error.prevention,
            status: 'documented'
        };

        let errors = [];
        if (fs.existsSync(this.errorsLog)) {
            errors = JSON.parse(fs.readFileSync(this.errorsLog, 'utf8'));
        }

        errors.push(errorEntry);
        fs.writeFileSync(this.errorsLog, JSON.stringify(errors, null, 2));

        console.log(`📝 Erreur ${errorEntry.id} documentée pour évolution système`);
        return errorEntry.id;
    }

    // Vérifier si une erreur est récurrente
    isRecurrentError(errorType) {
        if (!fs.existsSync(this.errorsLog)) return false;

        const errors = JSON.parse(fs.readFileSync(this.errorsLog, 'utf8'));
        const sameTypeErrors = errors.filter(e => e.type === errorType);
        
        return sameTypeErrors.length > 1;
    }

    // Évoluer les règles automatiquement
    evolveRules(errorType, newRule) {
        if (!fs.existsSync(this.rulesFile)) return false;

        let rules = fs.readFileSync(this.rulesFile, 'utf8');
        
        // Ajouter la nouvelle règle si pas déjà présente
        if (!rules.includes(errorType)) {
            const evolutionSection = `\n\n### 🧠 **ÉVOLUTION AUTO - ${errorType.toUpperCase()}**\n${newRule}\n`;
            rules += evolutionSection;
            
            fs.writeFileSync(this.rulesFile, rules);
            console.log(`✅ Règles évoluées automatiquement pour ${errorType}`);
            return true;
        }

        return false;
    }

    // Générer rapport d'évolution
    generateEvolutionReport() {
        if (!fs.existsSync(this.errorsLog)) {
            return { totalErrors: 0, evolvedRules: 0, status: 'no_data' };
        }

        const errors = JSON.parse(fs.readFileSync(this.errorsLog, 'utf8'));
        const errorTypes = [...new Set(errors.map(e => e.type))];
        
        const report = {
            totalErrors: errors.length,
            uniqueErrorTypes: errorTypes.length,
            errorTypes: errorTypes,
            recurrentErrors: errorTypes.filter(type => this.isRecurrentError(type)),
            lastEvolution: errors[errors.length - 1]?.timestamp,
            status: 'active_learning'
        };

        console.log('📊 RAPPORT ÉVOLUTION SYSTÈME:');
        console.log(`- Erreurs totales documentées: ${report.totalErrors}`);
        console.log(`- Types d'erreurs uniques: ${report.uniqueErrorTypes}`);
        console.log(`- Erreurs récurrentes: ${report.recurrentErrors.length}`);

        return report;
    }
}

// Instance globale du système d'évolution
const evolution = new SystemEvolution();

// Enregistrer l'erreur CMD commit multiline
const cmdCommitError = {
    type: 'cmd_multiline_commit',
    description: 'Messages git commit multiligne sur CMD Windows',
    symptom: "✅ n'est pas reconnu en tant que commande interne",
    cause: 'CMD Windows interprète chaque ligne après git commit -m comme commande séparée',
    solution: 'Utiliser commit_helper.js ou fichiers temporaires pour messages longs',
    prevention: 'Toujours vérifier compatibilité CMD avant commits multiligne'
};

// Auto-évolution du système
if (require.main === module) {
    console.log('🧠 SYSTÈME AUTO-ÉVOLUTION - ANALYSE ET APPRENTISSAGE');
    console.log('====================================================');
    
    // Enregistrer l'erreur pour apprentissage
    const errorId = evolution.recordError(cmdCommitError);
    
    // Vérifier si récurrente et évoluer
    if (evolution.isRecurrentError('cmd_multiline_commit')) {
        console.log('🚨 ERREUR RÉCURRENTE DÉTECTÉE - ÉVOLUTION SYSTÈME');
        
        const newRule = `
#### 🚨 **CMD COMMIT MULTILINE - RÈGLE ÉVOLUÉE**
- **PROBLÈME** : \`git commit -m "ligne1\\n✅ligne2"\` = échec CMD
- **SOLUTION** : Utiliser \`commit_helper.js\` ou fichiers temporaires
- **OUTIL** : \`node commit_helper.js\` pour commits sécurisés
- **STATUS** : Système évolué automatiquement - erreur résolue
        `;
        
        evolution.evolveRules('cmd_multiline_commit', newRule);
    }
    
    // Générer rapport d'évolution
    const report = evolution.generateEvolutionReport();
    
    console.log('\n✅ SYSTÈME ÉVOLUÉ - Prêt pour éviter erreurs futures');
}

module.exports = SystemEvolution;
