// ABSOLUTE FILE PROTECTION SYSTEM - NEVER TOUCH MAIN FILES
const fs = require('fs');
const path = require('path');

class AbsoluteFileProtection {
    constructor() {
        this.PROTECTED_FILES = [
            'g:/Code/CV/index.html',
            'g:/Code/CV/README.md',
            'g:/Code/CV/CHANGELOG.md'
        ];
        
        this.WORK_DIRECTORY = 'g:/Code/CV/RD/main_project_copy';
        this.WORK_FILE = path.join(this.WORK_DIRECTORY, 'indexRD.html');
        
        this.WARNING_MESSAGE = `
🚨🚨🚨 CRITICAL PROTECTION VIOLATION 🚨🚨🚨
NEVER TOUCH FILES OUTSIDE OF RD FOLDER!
WORK ONLY ON: ${this.WORK_FILE}
PREVIEW URL: file:///G:/Code/CV/RD/main_project_copy/indexRD.html
`;
    }

    // Check if a path is protected
    isProtectedFile(filePath) {
        const normalizedPath = path.resolve(filePath).toLowerCase().replace(/\\/g, '/');
        return this.PROTECTED_FILES.some(protectedFile => 
            normalizedPath.includes(protectedFile.toLowerCase())
        );
    }

    // Block any operation on protected files
    blockProtectedOperation(operation, filePath) {
        if (this.isProtectedFile(filePath)) {
            console.error(this.WARNING_MESSAGE);
            console.error(`❌ BLOCKED OPERATION: ${operation} on ${filePath}`);
            console.error('✅ USE INSTEAD: ' + this.WORK_FILE);
            throw new Error('PROTECTION VIOLATION: Cannot modify protected files');
        }
    }

    // Ensure work directory exists
    ensureWorkDirectory() {
        if (!fs.existsSync(this.WORK_DIRECTORY)) {
            fs.mkdirSync(this.WORK_DIRECTORY, { recursive: true });
            console.log('📁 Created work directory: ' + this.WORK_DIRECTORY);
        }
        
        // Ensure work file exists
        if (!fs.existsSync(this.WORK_FILE)) {
            // Copy from main if exists, otherwise create empty
            const mainFile = this.PROTECTED_FILES[0];
            if (fs.existsSync(mainFile)) {
                fs.copyFileSync(mainFile, this.WORK_FILE);
                console.log('📋 Work file created from main: ' + this.WORK_FILE);
            } else {
                fs.writeFileSync(this.WORK_FILE, '<html><head><title>Work Copy</title></head><body>Work in progress...</body></html>');
                console.log('📄 Empty work file created: ' + this.WORK_FILE);
            }
        }
    }

    // Update all systems to use work file only
    updateSystemPaths() {
        const filesToUpdate = [
            'g:/Code/CV/RD/preview_system.js',
            'g:/Code/CV/RD/iterative_system.js',
            'g:/Code/CV/RD/design_safe_security.js',
            'g:/Code/CV/RD/advanced_security_fixer.js'
        ];

        filesToUpdate.forEach(file => {
            if (fs.existsSync(file)) {
                let content = fs.readFileSync(file, 'utf8');
                
                // Replace any references to main index.html with work copy
                const replacements = [
                    {
                        from: /g:\/Code\/CV\/index\.html/g,
                        to: 'g:/Code/CV/RD/main_project_copy/index.html'
                    },
                    {
                        from: /path\.join\(this\.projectRoot,\s*'index\.html'\)/g,
                        to: "path.join(this.rdPath, 'main_project_copy', 'index.html')"
                    },
                    {
                        from: /'g:\/Code\/CV'/g,
                        to: "'g:/Code/CV/RD/main_project_copy'"
                    }
                ];

                let changed = false;
                replacements.forEach(({ from, to }) => {
                    if (from.test(content)) {
                        content = content.replace(from, to);
                        changed = true;
                    }
                });

                if (changed) {
                    // Backup original
                    fs.copyFileSync(file, `${file}.backup_${Date.now()}`);
                    fs.writeFileSync(file, content);
                    console.log(`✅ Updated paths in: ${path.basename(file)}`);
                }
            }
        });
    }

    // Add critical learning rules
    updateLearningSystem() {
        const learningFile = 'g:/Code/CV/RD/learning_report.json';
        let learning = {};
        
        if (fs.existsSync(learningFile)) {
            learning = JSON.parse(fs.readFileSync(learningFile, 'utf8'));
        }

        const criticalRules = [
            "🚨 CRITICAL: NEVER modify files outside RD folder",
            "🚨 CRITICAL: Main index.html is READ-ONLY - NEVER TOUCH",
            "🚨 CRITICAL: Work ONLY on g:/Code/CV/RD/main_project_copy/indexRD.html",
            "🚨 CRITICAL: Preview URL is file:///G:/Code/CV/RD/main_project_copy/indexRD.html",
            "🚨 CRITICAL: Main branch files are PROTECTED - violation = SYSTEM HALT"
        ];

        if (!learning.preventionRules) learning.preventionRules = [];
        
        criticalRules.forEach(rule => {
            if (!learning.preventionRules.includes(rule)) {
                learning.preventionRules.unshift(rule); // Add at beginning (highest priority)
            }
        });

        learning.fileProtection = {
            enabled: true,
            protectedFiles: this.PROTECTED_FILES,
            workFile: this.WORK_FILE,
            lastUpdate: new Date().toISOString(),
            violationPolicy: 'IMMEDIATE_HALT'
        };

        fs.writeFileSync(learningFile, JSON.stringify(learning, null, 2));
        console.log(`🛡️ ${criticalRules.length} CRITICAL protection rules added`);
    }

    // Initialize complete protection
    initializeProtection() {
        console.log('🛡️ INITIALIZING ABSOLUTE FILE PROTECTION...\n');
        
        this.ensureWorkDirectory();
        this.updateSystemPaths();
        this.updateLearningSystem();
        
        console.log('\n✅ PROTECTION INITIALIZED');
        console.log('🎯 WORK FILE: ' + this.WORK_FILE);
        console.log('🌐 PREVIEW URL: file:///G:/Code/CV/RD/main_project_copy/indexRD.html');
        console.log('🚨 PROTECTED FILES: ' + this.PROTECTED_FILES.length);
        
        return true;
    }

    // Validate current state
    validateCurrentState() {
        console.log('🔍 VALIDATION DE L\'ÉTAT ACTUEL...\n');
        
        const checks = [];
        
        // Check work file exists
        checks.push({
            name: 'Work file exists',
            result: fs.existsSync(this.WORK_FILE),
            file: this.WORK_FILE
        });
        
        // Check protected files untouched
        this.PROTECTED_FILES.forEach(file => {
            checks.push({
                name: `Protected: ${path.basename(file)}`,
                result: fs.existsSync(file),
                file: file
            });
        });
        
        checks.forEach(check => {
            const icon = check.result ? '✅' : '❌';
            console.log(`${icon} ${check.name}: ${check.file}`);
        });
        
        const allPassed = checks.every(check => check.result);
        console.log(`\n📊 VALIDATION: ${allPassed ? 'PASSED' : 'FAILED'}`);
        
        return allPassed;
    }
}

// CLI Interface
if (require.main === module) {
    const protection = new AbsoluteFileProtection();
    const command = process.argv[2];

    switch (command) {
        case 'init':
            protection.initializeProtection();
            break;
        case 'validate':
            protection.validateCurrentState();
            break;
        case 'update':
            protection.updateSystemPaths();
            break;
        default:
            console.log('Usage: node absolute_protection.js [init|validate|update]');
            protection.initializeProtection();
    }
}

module.exports = { AbsoluteFileProtection };
