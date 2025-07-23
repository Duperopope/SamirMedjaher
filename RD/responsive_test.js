// Test responsive CV mobile
const http = require('http');
const fs = require('fs');

console.log('🧪 Test Responsive CV Mobile');
console.log('================================');

// Test 1: Vérifier ordre CSS mobile
const htmlContent = fs.readFileSync('G:/Code/CV/RD/main_project_copy/indexRD.html', 'utf8');

const mobileOrderTests = [
    { section: '.profile-section', expectedOrder: 1 },
    { section: '.contact-section', expectedOrder: 2 },
    { section: '.objective-section', expectedOrder: 3 },
    { section: '.experience-section', expectedOrder: 4 },
    { section: '.skills-section', expectedOrder: 5 },
    { section: '.formation-section', expectedOrder: 6 },
    { section: '.projects-section', expectedOrder: 7 }
];

console.log('📱 Test ordre sections mobile:');
let orderTestPassed = 0;

mobileOrderTests.forEach(test => {
    const orderRegex = new RegExp(`${test.section.replace('.', '\\.')}\\s*{[^}]*order:\\s*${test.expectedOrder}`);
    const found = orderRegex.test(htmlContent);
    console.log(`${found ? '✅' : '❌'} ${test.section}: order ${test.expectedOrder}`);
    if (found) orderTestPassed++;
});

console.log('');

// Test 2: Vérifier responsive CSS
const responsiveTests = [
    { test: 'Flexbox Mobile', pattern: /display:\s*flex.*flex-direction:\s*column/ },
    { test: 'Classes Sections', pattern: /profile-section[\s\S]*contact-section[\s\S]*objective-section/ },
    { test: 'Order Properties', pattern: /\.profile-section\s*{\s*order:\s*1/ },
    { test: 'Media Query', pattern: /@media\s*\(max-width:\s*968px\)/ }
];

console.log('🎯 Test CSS Responsive:');
let cssTestPassed = 0;

responsiveTests.forEach(test => {
    const found = test.pattern.test(htmlContent);
    console.log(`${found ? '✅' : '❌'} ${test.test}`);
    if (found) cssTestPassed++;
});

console.log('');

// Test 3: Vérifier structure HTML avec classes
const htmlStructureTests = [
    { test: 'Profile Section Class', pattern: /class="[^"]*profile-section[^"]*"/ },
    { test: 'Contact Section Class', pattern: /class="[^"]*contact-section[^"]*"/ },
    { test: 'Objective Section Class', pattern: /class="[^"]*objective-section[^"]*"/ },
    { test: 'Experience Section Class', pattern: /class="[^"]*experience-section[^"]*"/ },
    { test: 'Skills Section Class', pattern: /class="[^"]*skills-section[^"]*"/ }
];

console.log('🏗️  Test Structure HTML:');
let htmlTestPassed = 0;

htmlStructureTests.forEach(test => {
    const found = test.pattern.test(htmlContent);
    console.log(`${found ? '✅' : '❌'} ${test.test}`);
    if (found) htmlTestPassed++;
});

console.log('');

// Résumé
const totalTests = mobileOrderTests.length + responsiveTests.length + htmlStructureTests.length;
const totalPassed = orderTestPassed + cssTestPassed + htmlTestPassed;

console.log('📊 === RÉSUMÉ TEST RESPONSIVE === 📊');
console.log(`🎯 Ordre mobile: ${orderTestPassed}/${mobileOrderTests.length}`);
console.log(`🎯 CSS responsive: ${cssTestPassed}/${responsiveTests.length}`);
console.log(`🎯 Structure HTML: ${htmlTestPassed}/${htmlStructureTests.length}`);
console.log(`📈 Total: ${totalPassed}/${totalTests} tests passés`);

if (totalPassed === totalTests) {
    console.log('🎉 CORRECTION RESPONSIVE RÉUSSIE !');
    console.log('📱 Ordre mobile optimal pour CV:');
    console.log('   1️⃣  Profil + Contact (essentiel)');
    console.log('   2️⃣  Objectif professionnel');
    console.log('   3️⃣  Expérience professionnelle');
    console.log('   4️⃣  Compétences techniques');
    console.log('   5️⃣  Formation');
    console.log('   6️⃣  Projets & International');
    console.log('');
    console.log('🚀 Testez sur: http://localhost:3000');
    console.log('📲 Réduisez la fenêtre ou F12 > Mobile');
} else {
    console.log('⚠️  Des corrections sont nécessaires');
}
