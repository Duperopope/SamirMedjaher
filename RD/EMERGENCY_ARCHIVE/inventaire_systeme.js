// Inventaire automatique fichiers RD avec évaluation
const fs = require('fs');
const path = require('path');

console.log('🔍 INVENTAIRE SYSTÈME - Fichiers RD/');
console.log('=====================================');

const rdPath = 'G:/Code/CV/RD';
const files = fs.readdirSync(rdPath);

const categories = {
    legitimate: [],
    pollution: [], 
    unknown: []
};

// Fichiers légitimes identifiés
const legitimateFiles = [
    'main_project_copy',
    'system_tester.js',
    'responsive_test.js', 
    'integration_test.js',
    'REGLES_PROJET.md',
    'README_RD.md',
    'JOURNAL_SYSTEME.md'
];

// Patterns pollution
const pollutionPatterns = [
    /\.backup_/,
    /SECURITY_FINAL_REPORT/,
    /tools\.md$/
];

files.forEach(file => {
    const fullPath = path.join(rdPath, file);
    const stats = fs.statSync(fullPath);
    const isDir = stats.isDirectory();
    const size = isDir ? 'DIR' : `${stats.size} bytes`;
    
    // Catégoriser
    if (legitimateFiles.includes(file)) {
        categories.legitimate.push({ file, size, type: isDir ? 'DIR' : 'FILE' });
    } else if (pollutionPatterns.some(pattern => pattern.test(file))) {
        categories.pollution.push({ file, size, type: isDir ? 'DIR' : 'FILE' });
    } else {
        categories.unknown.push({ file, size, type: isDir ? 'DIR' : 'FILE' });
    }
});

console.log('✅ FICHIERS LÉGITIMES:');
categories.legitimate.forEach(item => {
    console.log(`   ${item.file} (${item.type}: ${item.size})`);
});

console.log('\n❌ POLLUTION IDENTIFIÉE:');
categories.pollution.forEach(item => {
    console.log(`   ${item.file} (${item.type}: ${item.size})`);
});

console.log('\n❓ FICHIERS À ÉVALUER:');
categories.unknown.forEach(item => {
    console.log(`   ${item.file} (${item.type}: ${item.size})`);
});

console.log('\n📊 RÉSUMÉ:');
console.log(`   Légitimes: ${categories.legitimate.length}`);
console.log(`   Pollution: ${categories.pollution.length}`);
console.log(`   À évaluer: ${categories.unknown.length}`);

if (categories.pollution.length > 0) {
    console.log('\n🧹 COMMANDES NETTOYAGE:');
    categories.pollution.forEach(item => {
        const fullPath = path.join(rdPath, item.file);
        if (item.type === 'DIR') {
            console.log(`   rmdir /S /Q "${fullPath}"`);
        } else {
            console.log(`   del "${fullPath}"`);
        }
    });
}

console.log('\n⚠️  ÉVALUATION MANUELLE REQUISE POUR FICHIERS INCONNUS');
