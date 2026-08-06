// AUTO-CHECK OBLIGATOIRE - À exécuter AVANT toute action
const fs = require('fs');

console.log('🔍 AUTO-CHECK SYSTÈME - VÉRIFICATION OBLIGATOIRE');
console.log('=================================================');

// 1. Lire le journal
const journalPath = 'G:/Code/CV/RD/JOURNAL_SYSTEME.md';
let journalExists = false;

try {
    const journalContent = fs.readFileSync(journalPath, 'utf8');
    console.log('✅ Journal système trouvé');
    journalExists = true;
    
    // Extraire la date de dernière mise à jour
    const dateMatch = journalContent.match(/SESSION (\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
        const lastUpdate = dateMatch[1];
        const today = new Date().toISOString().split('T')[0];
        console.log(`📅 Dernière MAJ journal: ${lastUpdate}`);
        console.log(`📅 Date aujourd'hui: ${today}`);
        
        if (lastUpdate !== today) {
            console.log('⚠️  JOURNAL PAS À JOUR!');
        }
    }
} catch (error) {
    console.log('❌ Journal système MANQUANT!');
}

// 2. Compter les fichiers RD
const rdFiles = fs.readdirSync('G:/Code/CV/RD');
console.log(`📊 Fichiers RD actuels: ${rdFiles.length}`);

// 3. Vérifier les fichiers légitimes
const legitimateFiles = [
    'main_project_copy',
    'system_tester.js',
    'responsive_test.js', 
    'integration_test.js',
    'REGLES_PROJET.md',
    'README_RD.md',
    'JOURNAL_SYSTEME.md'
];

const missing = legitimateFiles.filter(file => !rdFiles.includes(file));
if (missing.length > 0) {
    console.log('❌ FICHIERS LÉGITIMES MANQUANTS:');
    missing.forEach(file => console.log(`   - ${file}`));
}

// 4. QUESTION OBLIGATOIRE
console.log('\n🎯 QUESTIONS OBLIGATOIRES AVANT ACTION:');
console.log('=====================================');
console.log('1. Ai-je consulté JOURNAL_SYSTEME.md?');
console.log('2. Ai-je vérifié si le fichier que je veux créer existe?');
console.log('3. Vais-je documenter cette action dans le journal?');
console.log('4. Cette action est-elle dans REGLES_PROJET.md?');

console.log('\n🚨 SI UNE RÉPONSE EST NON → STOP!');
console.log('\n💾 Auto-check terminé. Journal à consulter avant action.');

// 5. Générer commande de consultation forcée
console.log('\n🔧 COMMANDES OBLIGATOIRES:');
console.log('type "G:\\Code\\CV\\RD\\JOURNAL_SYSTEME.md" | more');
console.log('type "G:\\Code\\CV\\RD\\REGLES_PROJET.md" | more');
