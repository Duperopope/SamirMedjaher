#!/usr/bin/env node
/**
 * 📊 RAPPORT D'ÉTAT v1.3 - Bilan Dynamique
 * 
 * MISSION : Analyser l'état complet du projet v1.3 RD
 * OBJECTIF : Apprentissage dynamique et bilan transparent
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProjectStatusReport {
    constructor() {
        this.rdPath = __dirname;
        this.rootPath = path.dirname(this.rdPath);
        this.reportData = {
            version: '1.3',
            codename: 'Mobile First Revolution',
            timestamp: new Date().toISOString(),
            status: {},
            github: {},
            tests: {},
            architecture: {},
            learning: {}
        };
    }

    analyzeGitHubStatus() {
        console.log('🌐 ANALYSE GITHUB STATUS...');
        
        try {
            // Vérifier le README racine
            const readmeRoot = path.join(this.rootPath, 'README.md');
            const readmeRD = path.join(this.rdPath, 'README_RD.md');
            
            const rootContent = fs.readFileSync(readmeRoot, 'utf8');
            const rdContent = fs.readFileSync(readmeRD, 'utf8');
            
            // Analyser si le README racine contient le bon contenu RD
            const hasRDContent = rootContent.includes('v1.3 RD-development') || 
                               rootContent.includes('Mobile First Revolution');
            
            this.reportData.github = {
                readmeStatus: hasRDContent ? 'CORRECT' : 'INCORRECT',
                hasRDVersion: rootContent.includes('v1.3'),
                hasMobileFirst: rootContent.includes('Mobile First'),
                contentLength: rootContent.length,
                lastUpdate: fs.statSync(readmeRoot).mtime.toISOString()
            };
            
            console.log(`📖 README GitHub: ${this.reportData.github.readmeStatus}`);
            
        } catch (error) {
            this.reportData.github = {
                error: error.message,
                status: 'ERROR'
            };
            console.log('❌ Erreur analyse GitHub');
        }
    }

    analyzeTestsStatus() {
        console.log('🧪 ANALYSE TESTS STATUS...');
        
        try {
            // Lancer system_tester.js et capturer résultat
            const testOutput = execSync('node system_tester.js', { 
                cwd: this.rdPath, 
                encoding: 'utf8' 
            });
            
            // Parser les résultats
            const passTests = (testOutput.match(/✅ PASS/g) || []).length;
            const totalTests = (testOutput.match(/Test \d+:/g) || []).length;
            const allPassed = testOutput.includes('TOUS LES TESTS PASSENT');
            
            this.reportData.tests = {
                total: totalTests,
                passed: passTests,
                success: allPassed,
                score: totalTests > 0 ? Math.round((passTests / totalTests) * 100) : 0,
                output: testOutput.split('\n').slice(-5).join('\n') // Dernières lignes
            };
            
            console.log(`🧪 Tests: ${passTests}/${totalTests} (${this.reportData.tests.score}%)`);
            
        } catch (error) {
            this.reportData.tests = {
                error: error.message,
                status: 'ERROR'
            };
            console.log('❌ Erreur tests');
        }
    }

    analyzeArchitecture() {
        console.log('🏗️ ANALYSE ARCHITECTURE...');
        
        try {
            const files = fs.readdirSync(this.rdPath);
            
            // Catégoriser les fichiers
            const categories = {
                core: files.filter(f => ['auto_check.js', 'JOURNAL_SYSTEME.md', 'REGLES_PROJET.md'].includes(f)),
                tests: files.filter(f => f.includes('test')),
                surveillance: files.filter(f => f.includes('surveillance') || f.includes('emergency')),
                project: files.filter(f => f === 'main_project_copy' || f.includes('README')),
                evolution: files.filter(f => f.includes('evolution') || f.includes('helper')),
                archived: files.filter(f => f.includes('ARCHIVE') || f === 'backups')
            };
            
            this.reportData.architecture = {
                totalFiles: files.length,
                categories,
                isClean: files.length <= 20,
                hasEssentials: categories.core.length >= 3,
                hasSurveillance: categories.surveillance.length >= 2
            };
            
            console.log(`🏗️ Architecture: ${files.length} fichiers`);
            
        } catch (error) {
            this.reportData.architecture = {
                error: error.message
            };
        }
    }

    analyzeV13Progress() {
        console.log('🎯 ANALYSE PROGRÈS v1.3...');
        
        try {
            // Vérifier les commits v1.3
            const gitLog = execSync('git log --oneline --grep="v1.3\\|Mobile First\\|RD"', { 
                cwd: this.rootPath, 
                encoding: 'utf8' 
            });
            
            const v13Commits = gitLog.trim().split('\n').filter(line => line.trim());
            
            // Vérifier les fonctionnalités v1.3
            const indexRD = path.join(this.rdPath, 'main_project_copy', 'indexRD.html');
            let hasResponsive = false;
            
            if (fs.existsSync(indexRD)) {
                const content = fs.readFileSync(indexRD, 'utf8');
                hasResponsive = content.includes('order:') && 
                              content.includes('@media') && 
                              content.includes('max-width: 968px');
            }
            
            this.reportData.v13Progress = {
                commits: v13Commits.length,
                latestCommit: v13Commits[0] || 'Aucun',
                hasResponsiveCode: hasResponsive,
                mobileFirstImplemented: hasResponsive,
                testsWorking: this.reportData.tests.success || false,
                architectureClean: this.reportData.architecture.isClean || false
            };
            
            console.log(`🎯 v1.3: ${v13Commits.length} commits`);
            
        } catch (error) {
            this.reportData.v13Progress = {
                error: error.message
            };
        }
    }

    generateLearningInsights() {
        console.log('🧠 GÉNÉRATION INSIGHTS APPRENTISSAGE...');
        
        const insights = [];
        
        // GitHub README
        if (this.reportData.github.readmeStatus === 'INCORRECT') {
            insights.push({
                issue: 'README GitHub incorrect',
                solution: 'Copier README_RD.md vers README.md racine',
                priority: 'HIGH'
            });
        }
        
        // Tests
        if (this.reportData.tests.score < 100) {
            insights.push({
                issue: `Tests incomplets (${this.reportData.tests.score}%)`,
                solution: 'Corriger les tests en échec',
                priority: 'MEDIUM'
            });
        }
        
        // Architecture
        if (!this.reportData.architecture.isClean) {
            insights.push({
                issue: `Trop de fichiers (${this.reportData.architecture.totalFiles})`,
                solution: 'Lancer emergency cleanup',
                priority: 'LOW'
            });
        }
        
        // v1.3 Progress
        if (!this.reportData.v13Progress?.mobileFirstImplemented) {
            insights.push({
                issue: 'Mobile First pas complètement implémenté',
                solution: 'Finaliser CSS responsive avec order',
                priority: 'HIGH'
            });
        }
        
        this.reportData.learning = {
            totalInsights: insights.length,
            insights,
            overallStatus: insights.length === 0 ? 'EXCELLENT' : 
                          insights.filter(i => i.priority === 'HIGH').length > 0 ? 'NEEDS_WORK' : 'GOOD'
        };
        
        console.log(`🧠 Insights: ${insights.length} identifiés`);
    }

    generateReport() {
        console.log('\n📊 GÉNÉRATION RAPPORT FINAL...');
        
        this.analyzeGitHubStatus();
        this.analyzeTestsStatus();
        this.analyzeArchitecture();
        this.analyzeV13Progress();
        this.generateLearningInsights();
        
        // Calculer score global
        let globalScore = 0;
        let maxScore = 0;
        
        // GitHub (25 points)
        if (this.reportData.github.readmeStatus === 'CORRECT') globalScore += 25;
        maxScore += 25;
        
        // Tests (35 points)
        globalScore += Math.round((this.reportData.tests.score || 0) * 0.35);
        maxScore += 35;
        
        // Architecture (20 points)
        if (this.reportData.architecture.isClean) globalScore += 20;
        maxScore += 20;
        
        // v1.3 Features (20 points)
        if (this.reportData.v13Progress?.mobileFirstImplemented) globalScore += 20;
        maxScore += 20;
        
        this.reportData.globalScore = {
            score: globalScore,
            maxScore,
            percentage: Math.round((globalScore / maxScore) * 100),
            grade: globalScore >= 85 ? 'A' : globalScore >= 70 ? 'B' : globalScore >= 55 ? 'C' : 'D'
        };
        
        this.displayReport();
        this.saveReport();
        
        return this.reportData;
    }

    displayReport() {
        console.clear();
        console.log('📊 RAPPORT D\'ÉTAT PROJET v1.3 - MOBILE FIRST REVOLUTION');
        console.log('=========================================================');
        console.log(`📅 Date: ${new Date().toLocaleString()}`);
        console.log(`🎯 Version: ${this.reportData.version} - ${this.reportData.codename}`);
        console.log(`📊 Score Global: ${this.reportData.globalScore.score}/${this.reportData.globalScore.maxScore} (${this.reportData.globalScore.percentage}%) - Grade ${this.reportData.globalScore.grade}`);
        console.log();
        
        // GitHub Status
        console.log('🌐 GITHUB STATUS:');
        console.log(`   README: ${this.reportData.github.readmeStatus === 'CORRECT' ? '✅' : '❌'} ${this.reportData.github.readmeStatus}`);
        console.log(`   Contenu v1.3: ${this.reportData.github.hasRDVersion ? '✅' : '❌'}`);
        console.log(`   Mobile First: ${this.reportData.github.hasMobileFirst ? '✅' : '❌'}`);
        console.log();
        
        // Tests Status
        console.log('🧪 TESTS STATUS:');
        console.log(`   Résultats: ${this.reportData.tests.passed || 0}/${this.reportData.tests.total || 0} (${this.reportData.tests.score || 0}%)`);
        console.log(`   Status: ${this.reportData.tests.success ? '✅ TOUS PASSENT' : '❌ ÉCHECS'}`);
        console.log();
        
        // Architecture
        console.log('🏗️ ARCHITECTURE:');
        console.log(`   Fichiers: ${this.reportData.architecture.totalFiles || 0}/20 ${this.reportData.architecture.isClean ? '✅' : '⚠️'}`);
        console.log(`   Essentiels: ${this.reportData.architecture.hasEssentials ? '✅' : '❌'}`);
        console.log(`   Surveillance: ${this.reportData.architecture.hasSurveillance ? '✅' : '❌'}`);
        console.log();
        
        // v1.3 Progress
        console.log('🎯 PROGRÈS v1.3:');
        console.log(`   Commits: ${this.reportData.v13Progress?.commits || 0}`);
        console.log(`   Mobile First: ${this.reportData.v13Progress?.mobileFirstImplemented ? '✅ IMPLÉMENTÉ' : '❌ INCOMPLET'}`);
        console.log(`   Responsive CSS: ${this.reportData.v13Progress?.hasResponsiveCode ? '✅' : '❌'}`);
        console.log();
        
        // Learning Insights
        console.log('🧠 APPRENTISSAGE DYNAMIQUE:');
        console.log(`   Status: ${this.reportData.learning.overallStatus}`);
        
        if (this.reportData.learning.insights.length > 0) {
            console.log('   Actions Recommandées:');
            this.reportData.learning.insights.forEach((insight, i) => {
                const priority = insight.priority === 'HIGH' ? '🔴' : insight.priority === 'MEDIUM' ? '🟡' : '🟢';
                console.log(`   ${i+1}. ${priority} ${insight.issue}`);
                console.log(`      → ${insight.solution}`);
            });
        } else {
            console.log('   ✅ Aucune action requise - Projet optimal');
        }
        
        console.log('\n📈 HISTORIQUE: status_reports/');
    }

    saveReport() {
        const reportsDir = path.join(this.rdPath, 'status_reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir);
        }
        
        const filename = `status_${Date.now()}.json`;
        const filepath = path.join(reportsDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(this.reportData, null, 2));
        console.log(`\n💾 Rapport sauvé: ${filename}`);
    }
}

// LANCEMENT
if (require.main === module) {
    const reporter = new ProjectStatusReport();
    reporter.generateReport();
}

module.exports = ProjectStatusReport;
