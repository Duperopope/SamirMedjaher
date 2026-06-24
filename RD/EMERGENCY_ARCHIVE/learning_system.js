// Learning and Mistake Prevention System
// This system learns from mistakes and prevents destructive code changes

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class LearningSystem {
    constructor(logger, config = null) {
        this.logger = logger;
        this.config = config || {
            rdPath: 'g:/Code/CV/RD'
        };
        this.mistakesPath = path.join(this.config.rdPath, 'mistakes.json');
        this.learningPath = path.join(this.config.rdPath, 'learning.json');
        this.codeBackupsPath = path.join(this.config.rdPath, 'code_backups');
        this.mistakes = this.loadMistakes();
        this.learning = this.loadLearning();
        this.initializeBackupFolder();
    }

    loadMistakes() {
        try {
            if (fs.existsSync(this.mistakesPath)) {
                return JSON.parse(fs.readFileSync(this.mistakesPath, 'utf8'));
            }
        } catch (error) {
            this.logger.error('Failed to load mistakes', error);
        }
        return {
            destructiveChanges: [],
            codeSimplifications: [],
            deletedFunctions: [],
            patterns: {},
            frequency: {},
            totalMistakes: 0
        };
    }

    loadLearning() {
        try {
            if (fs.existsSync(this.learningPath)) {
                return JSON.parse(fs.readFileSync(this.learningPath, 'utf8'));
            }
        } catch (error) {
            this.logger.error('Failed to load learning data', error);
        }
        return {
            solutions: {},
            preventionRules: [],
            safePatterns: [],
            codePreservationRules: [],
            overhaulTriggers: {
                mistakeThreshold: 10,
                destructiveChangeThreshold: 3,
                codeSimplificationThreshold: 5
            }
        };
    }

    saveMistakes() {
        try {
            fs.writeFileSync(this.mistakesPath, JSON.stringify(this.mistakes, null, 2));
        } catch (error) {
            this.logger.error('Failed to save mistakes', error);
        }
    }

    saveLearning() {
        try {
            fs.writeFileSync(this.learningPath, JSON.stringify(this.learning, null, 2));
        } catch (error) {
            this.logger.error('Failed to save learning data', error);
        }
    }

    initializeBackupFolder() {
        if (!fs.existsSync(this.codeBackupsPath)) {
            fs.mkdirSync(this.codeBackupsPath, { recursive: true });
        }
    }

    // Create a hash of code content to detect changes
    createCodeHash(content) {
        return crypto.createHash('md5').update(content).digest('hex');
    }

    // Backup code before any changes
    backupCodeBeforeChange(filePath, reason = 'pre-change') {
        try {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = path.basename(filePath);
                const backupFilename = `${filename}_${reason}_${timestamp}.bak`;
                const backupPath = path.join(this.codeBackupsPath, backupFilename);
                
                fs.writeFileSync(backupPath, content);
                
                this.logger.log(`💾 Code backed up: ${backupFilename}`);
                
                return {
                    backupPath,
                    originalHash: this.createCodeHash(content),
                    originalSize: content.length,
                    functionCount: this.countFunctions(content)
                };
            }
        } catch (error) {
            this.logger.error('Failed to backup code', error);
        }
        return null;
    }

    // Count functions in code
    countFunctions(content) {
        const functionPatterns = [
            /function\s+\w+\s*\(/g,
            /const\s+\w+\s*=\s*\(/g,
            /let\s+\w+\s*=\s*\(/g,
            /var\s+\w+\s*=\s*\(/g,
            /\w+\s*:\s*function\s*\(/g,
            /\w+\s*=>\s*{/g
        ];
        
        let totalFunctions = 0;
        functionPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) totalFunctions += matches.length;
        });
        
        return totalFunctions;
    }

    // Detect if a change is potentially destructive
    analyzeChange(originalContent, newContent, filePath) {
        const originalHash = this.createCodeHash(originalContent);
        const newHash = this.createCodeHash(newContent);
        
        if (originalHash === newHash) {
            return { isDestructive: false, reason: 'No changes detected' };
        }

        const originalSize = originalContent.length;
        const newSize = newContent.length;
        const sizeDifference = ((originalSize - newSize) / originalSize) * 100;
        
        const originalFunctions = this.countFunctions(originalContent);
        const newFunctions = this.countFunctions(newContent);
        const functionLoss = originalFunctions - newFunctions;
        
        // Detect destructive patterns
        const destructivePatterns = [
            { pattern: sizeDifference > 50, reason: `Massive size reduction: ${sizeDifference.toFixed(2)}%` },
            { pattern: functionLoss > 5, reason: `Lost ${functionLoss} functions` },
            { pattern: newContent.includes('// TODO') && !originalContent.includes('// TODO'), reason: 'Code replaced with TODO comments' },
            { pattern: newContent.includes('<!-- example -->') && originalContent.length > 100, reason: 'Code replaced with examples' },
            { pattern: newContent.split('\n').length < originalContent.split('\n').length * 0.3, reason: 'Massive line reduction' }
        ];

        const destructiveReasons = destructivePatterns
            .filter(item => item.pattern)
            .map(item => item.reason);

        return {
            isDestructive: destructiveReasons.length > 0,
            reasons: destructiveReasons,
            metrics: {
                sizeDifference,
                functionLoss,
                originalSize,
                newSize,
                originalFunctions,
                newFunctions
            }
        };
    }

    // Record a mistake
    recordMistake(type, description, filePath, changeAnalysis) {
        const mistake = {
            id: Date.now(),
            type,
            description,
            filePath,
            timestamp: new Date().toISOString(),
            changeAnalysis,
            severity: this.calculateSeverity(changeAnalysis)
        };

        this.mistakes[type] = this.mistakes[type] || [];
        this.mistakes[type].push(mistake);
        this.mistakes.totalMistakes++;

        // Update frequency
        this.mistakes.frequency[type] = (this.mistakes.frequency[type] || 0) + 1;

        // Learn patterns
        if (changeAnalysis.reasons) {
            changeAnalysis.reasons.forEach(reason => {
                this.mistakes.patterns[reason] = (this.mistakes.patterns[reason] || 0) + 1;
            });
        }

        this.saveMistakes();
        this.logger.error(`🚨 MISTAKE RECORDED: ${type} - ${description}`);

        // Check if overhaul is needed
        this.checkForOverhaulNeed();
    }

    calculateSeverity(changeAnalysis) {
        if (!changeAnalysis.isDestructive) return 'LOW';
        
        const { sizeDifference, functionLoss } = changeAnalysis.metrics || {};
        
        if (sizeDifference > 80 || functionLoss > 10) return 'CRITICAL';
        if (sizeDifference > 50 || functionLoss > 5) return 'HIGH';
        if (sizeDifference > 25 || functionLoss > 2) return 'MEDIUM';
        
        return 'LOW';
    }

    // Check if system needs overhaul
    checkForOverhaulNeed() {
        const destructiveCount = this.mistakes.destructiveChanges?.length || 0;
        const simplificationCount = this.mistakes.codeSimplifications?.length || 0;
        const totalMistakes = this.mistakes.totalMistakes;

        const triggers = this.learning.overhaulTriggers;

        if (totalMistakes >= triggers.mistakeThreshold ||
            destructiveCount >= triggers.destructiveChangeThreshold ||
            simplificationCount >= triggers.codeSimplificationThreshold) {
            
            this.logger.log('🚨 OVERHAUL NEEDED: Too many mistakes detected');
            this.proposeOverhaulSolution();
        }
    }

    // Propose overhaul solution
    proposeOverhaulSolution() {
        const solution = {
            timestamp: new Date().toISOString(),
            reason: 'High mistake frequency detected',
            mistakes: {
                total: this.mistakes.totalMistakes,
                destructive: this.mistakes.destructiveChanges?.length || 0,
                simplifications: this.mistakes.codeSimplifications?.length || 0
            },
            recommendations: [
                'Implement stricter code validation',
                'Add mandatory code review step',
                'Create function preservation rules',
                'Implement rollback mechanisms',
                'Add pre-change verification'
            ],
            preventionMeasures: [
                'Never replace functional code with examples',
                'Always preserve existing functions unless explicitly told to remove them',
                'Use diff-based changes instead of full rewrites',
                'Validate code before applying changes',
                'Create comprehensive backups before any modifications'
            ]
        };

        const overhaulPath = path.join(this.config.rdPath, 'overhaul_proposal.json');
        fs.writeFileSync(overhaulPath, JSON.stringify(solution, null, 2));
        
        this.logger.log('📋 Overhaul proposal created');
        return solution;
    }

    // Learn from a successful fix
    recordSuccessfulFix(mistakeId, solution, approach) {
        const fix = {
            mistakeId,
            solution,
            approach,
            timestamp: new Date().toISOString(),
            effectiveness: 'pending'
        };

        this.learning.solutions[mistakeId] = fix;
        this.saveLearning();
        
        this.logger.log(`✅ Solution recorded for mistake ${mistakeId}`);
    }

    // Get prevention rules based on learned patterns
    getPreventionRules() {
        const rules = [
            'NEVER replace functional code with placeholder text',
            'ALWAYS preserve existing function definitions',
            'ALWAYS backup code before major changes',
            'VALIDATE function count before and after changes',
            'REJECT changes that reduce code size by more than 50%'
        ];

        // Add learned rules from patterns
        Object.keys(this.mistakes.patterns).forEach(pattern => {
            const frequency = this.mistakes.patterns[pattern];
            if (frequency > 2) {
                rules.push(`PREVENT: ${pattern} (occurred ${frequency} times)`);
            }
        });

        return rules;
    }

    // Validate a proposed change
    validateProposedChange(originalContent, proposedContent, filePath) {
        this.logger.log('🔍 Validating proposed change...');

        const analysis = this.analyzeChange(originalContent, proposedContent, filePath);
        
        if (analysis.isDestructive) {
            this.logger.log('🚫 DESTRUCTIVE CHANGE DETECTED:');
            analysis.reasons.forEach(reason => {
                this.logger.log(`   - ${reason}`);
            });

            // Record as potential mistake
            this.recordMistake('destructiveChanges', 
                `Attempted destructive change: ${analysis.reasons.join(', ')}`, 
                filePath, 
                analysis
            );

            return {
                approved: false,
                reasons: analysis.reasons,
                recommendation: 'Use targeted edits instead of full rewrites'
            };
        }

        this.logger.log('✅ Change validation passed');
        return { approved: true };
    }

    // Get intelligent suggestions for safer changes
    getSaferChangeApproach(filePath, intendedChange) {
        return {
            approach: 'targeted-edit',
            recommendations: [
                'Use replace_string_in_file with specific context',
                'Preserve all existing functions',
                'Add new code without removing old code',
                'Create incremental changes',
                'Validate each step before proceeding'
            ],
            safetyChecks: [
                'Count functions before and after',
                'Check code size difference',
                'Verify no placeholder text introduced',
                'Ensure all imports preserved'
            ]
        };
    }

    // Generate learning report
    generateLearningReport() {
        const report = {
            totalMistakes: this.mistakes.totalMistakes,
            mistakesByType: this.mistakes.frequency,
            commonPatterns: this.mistakes.patterns,
            preventionRules: this.getPreventionRules(),
            overhaulNeeded: this.mistakes.totalMistakes >= this.learning.overhaulTriggers.mistakeThreshold,
            recommendations: this.learning.solutions,
            generatedAt: new Date().toISOString()
        };

        const reportPath = path.join(this.config.rdPath, 'learning_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        this.logger.log('📊 Learning report generated');
        return report;
    }
}

module.exports = { LearningSystem };
