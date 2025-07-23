// Test automatisé du système CV avec serveur HTTP
const http = require('http');
const fs = require('fs');

class CVSystemTester {
    constructor() {
        this.serverUrl = 'http://localhost:3000';
        this.testResults = [];
    }

    async testServerResponse() {
        console.log('🧪 Test 1: Réponse du serveur HTTP...');
        
        return new Promise((resolve, reject) => {
            const req = http.get(this.serverUrl, (res) => {
                let data = '';
                
                res.on('data', chunk => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    const success = res.statusCode === 200 && data.includes('Samir Medjaher');
                    this.testResults.push({
                        test: 'Server Response',
                        success: success,
                        details: `Status: ${res.statusCode}, Content-Type: ${res.headers['content-type']}`
                    });
                    
                    console.log(success ? '✅ Serveur OK' : '❌ Serveur KO');
                    resolve(success);
                });
            });
            
            req.on('error', (error) => {
                console.log('❌ Erreur serveur:', error.message);
                this.testResults.push({
                    test: 'Server Response',
                    success: false,
                    details: error.message
                });
                resolve(false);
            });
            
            req.setTimeout(5000, () => {
                console.log('❌ Timeout serveur');
                req.destroy();
                resolve(false);
            });
        });
    }

    testFileStructure() {
        console.log('🧪 Test 2: Structure des fichiers...');
        
        const requiredFiles = [
            'indexRD.html',
            'server.js',
            'test-simple.html'
        ];
        
        const basePath = 'g:/Code/CV/RD/main_project_copy/';
        let allExists = true;
        
        requiredFiles.forEach(file => {
            const exists = fs.existsSync(basePath + file);
            if (!exists) allExists = false;
            console.log(exists ? `✅ ${file}` : `❌ ${file} manquant`);
        });
        
        this.testResults.push({
            test: 'File Structure',
            success: allExists,
            details: `${requiredFiles.length} fichiers vérifiés`
        });
        
        return allExists;
    }

    testHTMLContent() {
        console.log('🧪 Test 3: Contenu HTML...');
        
        const filePath = 'g:/Code/CV/RD/main_project_copy/indexRD.html';
        const content = fs.readFileSync(filePath, 'utf8');
        
        const checks = [
            { name: 'DOCTYPE', test: content.includes('<!DOCTYPE html>') },
            { name: 'Title Samir', test: content.includes('Samir Medjaher') },
            { name: 'JavaScript Init', test: content.includes('initializeCV') },
            { name: 'CSS Styles', test: content.includes('background:linear-gradient') },
            { name: 'Gaming Mode', test: content.includes('gamingMode') },
            { name: 'No CSP Block', test: !content.includes('Content-Security-Policy') || content.includes('<!-- CSP temporarily disabled') }
        ];
        
        const passed = checks.filter(check => check.test).length;
        const success = passed === checks.length;
        
        checks.forEach(check => {
            console.log(check.test ? `✅ ${check.name}` : `❌ ${check.name}`);
        });
        
        this.testResults.push({
            test: 'HTML Content',
            success: success,
            details: `${passed}/${checks.length} vérifications passées`
        });
        
        return success;
    }

    generateReport() {
        console.log('\n📊 === RAPPORT DE TEST === 📊');
        console.log('================================');
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(result => result.success).length;
        const success = passedTests === totalTests;
        
        this.testResults.forEach((result, index) => {
            const status = result.success ? '✅ PASS' : '❌ FAIL';
            console.log(`${index + 1}. ${result.test}: ${status}`);
            console.log(`   ${result.details}`);
        });
        
        console.log('================================');
        console.log(`📈 Résultat Global: ${passedTests}/${totalTests} tests passés`);
        console.log(success ? '🎉 TOUS LES TESTS PASSENT !' : '⚠️  Des tests ont échoué');
        
        if (success) {
            console.log('\n🚀 SYSTÈME PRÊT POUR L\'INTÉGRATION !');
            console.log('🌐 URL de test: http://localhost:3000');
            console.log('📁 Fichier de travail: indexRD.html');
        }
        
        return success;
    }

    async runAllTests() {
        console.log('🎯 === DÉMARRAGE DES TESTS CV === 🎯\n');
        
        // Test 1: Serveur
        await this.testServerResponse();
        
        // Test 2: Fichiers
        this.testFileStructure();
        
        // Test 3: Contenu HTML
        this.testHTMLContent();
        
        // Rapport final
        return this.generateReport();
    }
}

// Exécuter les tests
const tester = new CVSystemTester();
tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
});
