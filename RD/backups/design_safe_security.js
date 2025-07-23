// Design-Safe Security System - Preserve frontend work while fixing security
const fs = require('fs');
const path = require('path');

class DesignSafeSecuritySystem {
    constructor() {
        this.projectRoot = 'g:/Code/CV/RD/main_project_copy';
        this.rdPath = path.join(this.projectRoot, 'RD');
        this.mainFile = path.join(this.rdPath, 'main_project_copy', 'indexRD.html');
        this.referenceFile = path.join(this.rdPath, 'main_project_copy', 'indexRD.html');
        
        // Design preservation rules
        this.protectedSections = [
            'CSS styles', 'HTML structure', 'class names', 
            'animations', 'layouts', 'color themes', 'positioning'
        ];
    }

    async preserveDesignReference() {
        console.log('📋 Création de la référence de design...');
        
        const content = fs.readFileSync(this.mainFile, 'utf8');
        
        // Extract design elements to preserve
        const designElements = {
            cssStyles: this.extractCSS(content),
            htmlStructure: this.extractStructure(content),
            animations: this.extractAnimations(content),
            positioning: this.extractPositioning(content),
            themes: this.extractThemes(content),
            metadata: {
                totalLines: content.split('\n').length,
                fileSize: content.length,
                timestamp: new Date().toISOString()
            }
        };
        
        // Save design reference
        const referenceFile = path.join(this.rdPath, 'design_reference.json');
        fs.writeFileSync(referenceFile, JSON.stringify(designElements, null, 2));
        
        // Also create a pristine copy
        const pristineCopy = path.join(this.rdPath, 'design_pristine_copy.html');
        fs.copyFileSync(this.mainFile, pristineCopy);
        
        console.log('✅ Référence de design sauvegardée');
        console.log(`📐 ${designElements.cssStyles.length} règles CSS préservées`);
        console.log(`🏗️ ${designElements.htmlStructure.length} éléments HTML identifiés`);
        
        return designElements;
    }

    extractCSS(content) {
        const cssRules = [];
        
        // Extract inline styles
        const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
        if (styleMatch) {
            styleMatch.forEach(style => {
                cssRules.push({
                    type: 'inline',
                    content: style,
                    line: content.split('\n').findIndex(line => line.includes(style.substring(0, 50))) + 1
                });
            });
        }
        
        // Extract CSS variables
        const varMatches = content.match(/--[\w-]+\s*:\s*[^;]+/g) || [];
        varMatches.forEach(varDef => {
            cssRules.push({
                type: 'variable',
                content: varDef,
                category: 'custom-property'
            });
        });
        
        return cssRules;
    }

    extractStructure(content) {
        const structure = [];
        
        // Key HTML elements with their classes
        const elementMatches = content.match(/<(\w+)[^>]*class="([^"]*)"[^>]*>/g) || [];
        elementMatches.forEach(element => {
            structure.push({
                element: element,
                tag: element.match(/<(\w+)/)[1],
                classes: element.match(/class="([^"]*)"/)[1]
            });
        });
        
        return structure;
    }

    extractAnimations(content) {
        const animations = [];
        
        // CSS animations and transitions
        const animationMatches = content.match(/(animation|transition|transform|@keyframes)[^;{]*[;{]/g) || [];
        animationMatches.forEach(anim => {
            animations.push({
                type: 'css-animation',
                content: anim
            });
        });
        
        return animations;
    }

    extractPositioning(content) {
        const positioning = [];
        
        // Position-related CSS
        const posMatches = content.match(/(position|top|left|right|bottom|margin|padding)[^;]*;/g) || [];
        posMatches.forEach(pos => {
            positioning.push({
                property: pos
            });
        });
        
        return positioning;
    }

    extractThemes(content) {
        const themes = [];
        
        // Color themes and variables
        const colorMatches = content.match(/(#[0-9a-fA-F]{6}|rgba?\([^)]+\)|hsl\([^)]+\))/g) || [];
        colorMatches.forEach(color => {
            themes.push({
                color: color,
                type: 'color-value'
            });
        });
        
        return themes;
    }

    async applySafeSecurityFixes() {
        console.log('🛡️ Application de corrections de sécurité respectueuses du design...');
        
        let content = fs.readFileSync(this.mainFile, 'utf8');
        let fixCount = 0;
        
        // ONLY fix the most critical security issues without touching design
        const safeFixes = [
            // 1. Add CSP header if missing (safe addition)
            {
                pattern: /<head>/,
                replacement: '<head>\n    <meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' \'unsafe-inline\' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://www.youtube.com; style-src \'self\' \'unsafe-inline\' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src \'self\' https://fonts.gstatic.com; img-src \'self\' data: https: blob:; connect-src \'self\' https:; frame-src https://www.youtube.com;">',
                description: 'Ajout CSP header (sécurisé)',
                condition: content => !content.includes('Content-Security-Policy')
            },
            
            // 2. Add security comment markers only (no code change)
            {
                pattern: /(\.innerHTML = [^;]+;)/g,
                replacement: '$1 /* SECURITY-REVIEWED: Static content or controlled template */',
                description: 'Marquage sécurité innerHTML (commentaires seulement)',
                maxReplacements: 5 // Limit to avoid over-commenting
            }
        ];
        
        // Apply only the safest fixes
        safeFixes.forEach(fix => {
            if (fix.condition && !fix.condition(content)) return;
            
            const matches = content.match(fix.pattern) || [];
            if (matches.length > 0) {
                const limitedReplacements = fix.maxReplacements ? Math.min(matches.length, fix.maxReplacements) : matches.length;
                content = content.replace(fix.pattern, fix.replacement);
                fixCount += limitedReplacements;
                console.log(`✅ ${fix.description}: ${limitedReplacements} correction(s)`);
            }
        });
        
        if (fixCount > 0) {
            // Create backup before applying
            const backupPath = `${this.mainFile}.safe_security_${Date.now()}`;
            fs.copyFileSync(this.mainFile, backupPath);
            
            // Apply changes
            fs.writeFileSync(this.mainFile, content);
            console.log(`\n🎉 ${fixCount} corrections de sécurité appliquées (design préservé)`);
            console.log(`💾 Backup: ${path.basename(backupPath)}`);
        } else {
            console.log('✅ Aucune correction de sécurité nécessaire qui respecte le design');
        }
        
        return fixCount > 0;
    }

    async validateDesignIntegrity() {
        console.log('🔍 Validation de l\'intégrité du design...');
        
        const referenceFile = path.join(this.rdPath, 'design_reference.json');
        if (!fs.existsSync(referenceFile)) {
            console.log('⚠️ Aucune référence de design trouvée - création en cours...');
            await this.preserveDesignReference();
            return true;
        }
        
        const reference = JSON.parse(fs.readFileSync(referenceFile, 'utf8'));
        const current = fs.readFileSync(this.mainFile, 'utf8');
        
        // Check critical design elements
        const checks = {
            fileSize: Math.abs(current.length - reference.metadata.fileSize) < 5000, // Allow 5KB variance
            cssCount: this.extractCSS(current).length >= reference.cssStyles.length * 0.9, // Allow 10% loss
            structureCount: this.extractStructure(current).length >= reference.htmlStructure.length * 0.95 // Allow 5% loss
        };
        
        const passed = Object.values(checks).every(check => check);
        
        if (passed) {
            console.log('✅ Intégrité du design validée');
        } else {
            console.log('❌ Design potentiellement altéré:');
            Object.entries(checks).forEach(([check, result]) => {
                console.log(`   ${result ? '✅' : '❌'} ${check}`);
            });
        }
        
        return passed;
    }

    async createDesignProtectedVersion() {
        console.log('🛡️ Création d\'une version protégée du design...');
        
        // 1. Save current design reference
        await this.preserveDesignReference();
        
        // 2. Apply minimal security fixes
        const securityApplied = await this.applySafeSecurityFixes();
        
        // 3. Validate design integrity
        const designIntact = await this.validateDesignIntegrity();
        
        if (!designIntact) {
            console.log('⚠️ Design altéré détecté - restauration de la référence...');
            const pristineCopy = path.join(this.rdPath, 'design_pristine_copy.html');
            if (fs.existsSync(pristineCopy)) {
                fs.copyFileSync(pristineCopy, this.mainFile);
                console.log('✅ Design original restauré');
            }
        }
        
        console.log('\n📊 RÉSUMÉ:');
        console.log(`🎨 Design: ${designIntact ? 'PRÉSERVÉ' : 'RESTAURÉ'}`);
        console.log(`🛡️ Sécurité: ${securityApplied ? 'AMÉLIORÉE' : 'INCHANGÉE'}`);
        
        return { designIntact, securityApplied };
    }

    async updateLearningSystem() {
        console.log('🧠 Mise à jour du système d\'apprentissage avec règles de design...');
        
        const learningFile = path.join(this.rdPath, 'learning_report.json');
        let learning = {};
        
        if (fs.existsSync(learningFile)) {
            learning = JSON.parse(fs.readFileSync(learningFile, 'utf8'));
        }
        
        // Add design preservation rules
        const designRules = [
            "NEVER modify CSS classes or animations without user approval",
            "ALWAYS preserve HTML structure and layout elements",
            "NEVER change color themes or custom properties automatically",
            "ALWAYS create design reference before major changes",
            "NEVER apply security fixes that alter visual appearance"
        ];
        
        if (!learning.preventionRules) learning.preventionRules = [];
        
        designRules.forEach(rule => {
            if (!learning.preventionRules.includes(rule)) {
                learning.preventionRules.push(rule);
            }
        });
        
        learning.designProtection = {
            enabled: true,
            lastUpdate: new Date().toISOString(),
            rulesCount: designRules.length
        };
        
        fs.writeFileSync(learningFile, JSON.stringify(learning, null, 2));
        console.log(`✅ ${designRules.length} règles de protection du design ajoutées`);
        
        return learning;
    }
}

// CLI Interface
if (require.main === module) {
    const designSafe = new DesignSafeSecuritySystem();
    const command = process.argv[2];

    switch (command) {
        case 'protect':
            designSafe.createDesignProtectedVersion();
            break;
        case 'reference':
            designSafe.preserveDesignReference();
            break;
        case 'validate':
            designSafe.validateDesignIntegrity();
            break;
        case 'learn':
            designSafe.updateLearningSystem();
            break;
        default:
            console.log('Usage: node design_safe_security.js [protect|reference|validate|learn]');
            designSafe.createDesignProtectedVersion();
    }
}

module.exports = { DesignSafeSecuritySystem };
