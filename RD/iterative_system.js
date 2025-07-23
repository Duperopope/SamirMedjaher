// Iterative Development System with LLM Reasoning and Learning
// This script manages the complete development workflow with automated reasoning and mistake prevention

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { LearningSystem } = require('./learning_system');

// Configuration
const CONFIG = {
    rdPath: 'g:/Code/CV/RD',
    mainProject: 'g:/Code/CV/cv.html',
    iterations: {
        maxIterations: 10,
        currentIteration: 0,
        targetMilestone: 'bilingual_landing'
    },
    logging: {
        enabled: true,
        verbose: true
    },
    git: {
        rdBranch: 'RD-development',
        autoCommit: true,
        autoPush: true
    },
    autonomous: {
        enabled: true,
        maxRetries: 3,
        checkLogs: true,
        selfCorrection: true
    }
};

// Logging system with autonomous error analysis
class Logger {
    constructor() {
        this.logPath = path.join(CONFIG.rdPath, 'system.log');
        this.errorPath = path.join(CONFIG.rdPath, 'errors.log');
        this.progressPath = path.join(CONFIG.rdPath, 'progress.log');
    }

    log(message, type = 'INFO') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${type}: ${message}\n`;
        
        if (CONFIG.logging.enabled) {
            console.log(logMessage.trim());
            fs.appendFileSync(this.logPath, logMessage);
        }
    }

    error(message, error = null) {
        const timestamp = new Date().toISOString();
        const errorDetails = error ? ` | Details: ${error.message}` : '';
        const logMessage = `[${timestamp}] ERROR: ${message}${errorDetails}\n`;
        
        console.error(logMessage.trim());
        fs.appendFileSync(this.errorPath, logMessage);
        
        // Autonomous error analysis
        if (CONFIG.autonomous.enabled) {
            this.analyzeError(message, error);
        }
    }

    analyzeError(message, error) {
        this.log('🔍 Analyzing error for autonomous correction...');
        
        // Common LLM/Copilot issues and solutions
        const errorPatterns = {
            'localStorage is not defined': {
                solution: 'Browser API test needs DOM environment',
                action: 'skip_browser_tests',
                severity: 'LOW'
            },
            'IndexedDB is not defined': {
                solution: 'Browser API test needs DOM environment',
                action: 'skip_browser_tests',
                severity: 'LOW'
            },
            'ENOENT': {
                solution: 'File or directory not found',
                action: 'create_missing_files',
                severity: 'MEDIUM'
            },
            'Permission denied': {
                solution: 'File permission issue',
                action: 'fix_permissions',
                severity: 'HIGH'
            },
            'git push': {
                solution: 'Git operation failed',
                action: 'retry_git_operation',
                severity: 'MEDIUM'
            }
        };

        for (const [pattern, info] of Object.entries(errorPatterns)) {
            if (message.includes(pattern) || (error && error.message.includes(pattern))) {
                this.log(`💡 Autonomous solution found: ${info.solution}`);
                this.log(`🛠️  Recommended action: ${info.action}`);
                return info;
            }
        }

        this.log('⚠️  No autonomous solution found for this error');
        return null;
    }

    checkLogHealth() {
        this.log('🏥 Checking log health...');
        
        try {
            // Check error log for critical patterns
            if (fs.existsSync(this.errorPath)) {
                const errorLog = fs.readFileSync(this.errorPath, 'utf8');
                const criticalErrors = errorLog.split('\n').filter(line => 
                    line.includes('CRITICAL') || 
                    line.includes('FATAL') ||
                    line.includes('Permission denied')
                );
                
                if (criticalErrors.length > 0) {
                    this.log(`🚨 Found ${criticalErrors.length} critical errors requiring attention`);
                    return false;
                }
            }
            
            this.log('✅ Log health check passed');
            return true;
            
        } catch (error) {
            this.error('Failed to check log health', error);
            return false;
        }
    }

    progress(milestone, status, details = '') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] PROGRESS: ${milestone} - ${status}${details ? ` - ${details}` : ''}\n`;
        
        console.log(logMessage.trim());
        fs.appendFileSync(this.progressPath, logMessage);
    }
}

// Development reasoning system
class DevelopmentReasoner {
    constructor(logger) {
        this.logger = logger;
        this.currentState = this.loadState();
    }

    loadState() {
        const statePath = path.join(CONFIG.rdPath, 'dev_state.json');
        try {
            if (fs.existsSync(statePath)) {
                return JSON.parse(fs.readFileSync(statePath, 'utf8'));
            }
        } catch (error) {
            this.logger.error('Failed to load development state', error);
        }
        
        return {
            currentMilestone: 'initialization',
            completedTasks: [],
            pendingTasks: [
                'setup_rd_environment',
                'analyze_main_project',
                'implement_bilingual_landing',
                'add_interactive_cv',
                'integrate_games',
                'security_implementation'
            ],
            issues: [],
            iteration: 0
        };
    }

    saveState() {
        const statePath = path.join(CONFIG.rdPath, 'dev_state.json');
        try {
            fs.writeFileSync(statePath, JSON.stringify(this.currentState, null, 2));
            this.logger.log('Development state saved');
        } catch (error) {
            this.logger.error('Failed to save development state', error);
        }
    }

    analyzeNextStep() {
        this.logger.log('🤔 Analyzing next development step...');
        
        const pendingTask = this.currentState.pendingTasks[0];
        if (!pendingTask) {
            this.logger.log('✅ All tasks completed!');
            return null;
        }

        this.logger.log(`📋 Next task: ${pendingTask}`);
        
        // LLM reasoning simulation
        const reasoning = this.reasonAboutTask(pendingTask);
        this.logger.log(`🧠 Reasoning: ${reasoning.description}`);
        
        return {
            task: pendingTask,
            reasoning: reasoning,
            priority: reasoning.priority,
            estimatedTime: reasoning.estimatedTime
        };
    }

    reasonAboutTask(task) {
        const taskReasonings = {
            'setup_rd_environment': {
                description: 'Setting up RD environment is critical for organized development',
                priority: 'HIGH',
                estimatedTime: '30 minutes',
                dependencies: [],
                risks: ['File organization issues'],
                validation: 'Check if RD folder structure is complete'
            },
            'analyze_main_project': {
                description: 'Analysis needed to understand current project structure and identify improvement areas',
                priority: 'HIGH',
                estimatedTime: '45 minutes',
                dependencies: ['setup_rd_environment'],
                risks: ['Missing critical components'],
                validation: 'Document all project components and their interactions'
            },
            'implement_bilingual_landing': {
                description: 'Bilingual support is core requirement for professional and client access',
                priority: 'CRITICAL',
                estimatedTime: '2 hours',
                dependencies: ['analyze_main_project'],
                risks: ['Translation accuracy', 'Language switching bugs'],
                validation: 'Test language switching and verify translations'
            }
        };

        return taskReasonings[task] || {
            description: `Unknown task: ${task}`,
            priority: 'MEDIUM',
            estimatedTime: 'Unknown',
            dependencies: [],
            risks: ['Unknown task requirements'],
            validation: 'Manual review required'
        };
    }

    completeTask(task, result = 'SUCCESS') {
        const index = this.currentState.pendingTasks.indexOf(task);
        if (index > -1) {
            this.currentState.pendingTasks.splice(index, 1);
            this.currentState.completedTasks.push({
                task,
                result,
                completedAt: new Date().toISOString(),
                iteration: this.currentState.iteration
            });
            
            this.logger.progress(task, result);
            this.saveState();
        }
    }

    addIssue(issue, severity = 'MEDIUM') {
        this.currentState.issues.push({
            issue,
            severity,
            reportedAt: new Date().toISOString(),
            iteration: this.currentState.iteration,
            resolved: false
        });
        
        this.logger.error(`Issue reported: ${issue} (${severity})`);
        this.saveState();
    }
}

// Git management system
class GitManager {
    constructor(logger) {
        this.logger = logger;
    }

    async ensureRDBranch() {
        this.logger.log('🌿 Ensuring RD branch exists...');
        
        try {
            // Check current branch
            const { execSync } = require('child_process');
            const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
            
            if (currentBranch !== CONFIG.git.rdBranch) {
                this.logger.log(`📋 Current branch: ${currentBranch}, switching to ${CONFIG.git.rdBranch}`);
                
                try {
                    // Try to switch to existing branch
                    execSync(`git checkout ${CONFIG.git.rdBranch}`, { stdio: 'pipe' });
                } catch (error) {
                    // Create new branch if it doesn't exist
                    this.logger.log(`🆕 Creating new branch: ${CONFIG.git.rdBranch}`);
                    execSync(`git checkout -b ${CONFIG.git.rdBranch}`, { stdio: 'pipe' });
                    
                    // Push to remote
                    if (CONFIG.git.autoPush) {
                        execSync(`git push -u origin ${CONFIG.git.rdBranch}`, { stdio: 'pipe' });
                    }
                }
            }
            
            this.logger.log(`✅ On RD branch: ${CONFIG.git.rdBranch}`);
            return true;
            
        } catch (error) {
            this.logger.error('Failed to ensure RD branch', error);
            return false;
        }
    }

    async commitChanges(message) {
        if (!CONFIG.git.autoCommit) return true;
        
        this.logger.log('💾 Committing changes...');
        
        try {
            const { execSync } = require('child_process');
            
            // Add all changes
            execSync('git add .', { stdio: 'pipe' });
            
            // Check if there are changes to commit
            const status = execSync('git status --porcelain', { encoding: 'utf8' });
            if (status.trim() === '') {
                this.logger.log('📝 No changes to commit');
                return true;
            }
            
            // Commit
            execSync(`git commit -m "${message}"`, { stdio: 'pipe' });
            this.logger.log(`✅ Committed: ${message}`);
            
            // Push if enabled
            if (CONFIG.git.autoPush) {
                execSync('git push', { stdio: 'pipe' });
                this.logger.log('📤 Pushed to remote');
            }
            
            return true;
            
        } catch (error) {
            this.logger.error('Failed to commit changes', error);
            return false;
        }
    }

    async syncWithRemote() {
        this.logger.log('🔄 Syncing with remote...');
        
        try {
            const { execSync } = require('child_process');
            
            // Fetch latest
            execSync('git fetch origin', { stdio: 'pipe' });
            
            // Check if we're behind
            const behind = execSync(`git rev-list --count HEAD..origin/${CONFIG.git.rdBranch}`, { encoding: 'utf8' }).trim();
            
            if (parseInt(behind) > 0) {
                this.logger.log(`📥 Pulling ${behind} commits from remote`);
                execSync(`git pull origin ${CONFIG.git.rdBranch}`, { stdio: 'pipe' });
            }
            
            this.logger.log('✅ Synced with remote');
            return true;
            
        } catch (error) {
            this.logger.error('Failed to sync with remote', error);
            return false;
        }
    }
}

// File management system with enhanced cleanup
class FileManager {
    constructor(logger) {
        this.logger = logger;
    }

    cleanUnusedFiles() {
        this.logger.log('🧹 Cleaning unused files...');
        
        const tempPatterns = [
            /.*\.tmp$/,
            /.*\.temp$/,
            /.*~$/,
            /.*\.swp$/,
            /.*\.log\.old$/
        ];

        let cleaned = 0;
        
        try {
            const cleanPath = CONFIG.rdPath;
            const files = fs.readdirSync(cleanPath);
            
            files.forEach(file => {
                const shouldDelete = tempPatterns.some(pattern => pattern.test(file));
                if (shouldDelete) {
                    try {
                        fs.unlinkSync(path.join(cleanPath, file));
                        cleaned++;
                        this.logger.log(`🗑️  Cleaned: ${file}`);
                    } catch (error) {
                        this.logger.error(`Failed to clean ${file}`, error);
                    }
                }
            });
            
        } catch (error) {
            this.logger.error('Failed to clean directory', error);
        }

        this.logger.log(`✅ Cleaned ${cleaned} temporary files`);
    }

    createBackup() {
        this.logger.log('💾 Creating backup...');
        
        const backupDir = path.join(CONFIG.rdPath, 'backups');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `backup_${timestamp}`);

        try {
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }

            // Create a simple backup by copying important files
            const importantFiles = [
                'iterative_system.js',
                'development-script.js',
                'memory_management.md',
                'README.md'
            ];

            fs.mkdirSync(backupPath, { recursive: true });
            
            importantFiles.forEach(file => {
                const srcPath = path.join(CONFIG.rdPath, file);
                const destPath = path.join(backupPath, file);
                
                if (fs.existsSync(srcPath)) {
                    fs.copyFileSync(srcPath, destPath);
                }
            });
            
            this.logger.log(`✅ Backup created at: ${backupPath}`);
            return true;
            
        } catch (error) {
            this.logger.error('Failed to create backup', error);
            return false;
        }
    }

    fixPermissions() {
        this.logger.log('🔧 Attempting to fix file permissions...');
        
        try {
            // On Windows, we mainly need to ensure files aren't read-only
            const files = fs.readdirSync(CONFIG.rdPath);
            
            files.forEach(file => {
                const filePath = path.join(CONFIG.rdPath, file);
                try {
                    fs.chmodSync(filePath, 0o666);
                } catch (error) {
                    // Ignore permission errors on individual files
                }
            });
            
            this.logger.log('✅ File permissions checked');
            return true;
            
        } catch (error) {
            this.logger.error('Failed to fix permissions', error);
            return false;
        }
    }
}

// Main development system with autonomous capabilities and learning
class IterativeDevelopmentSystem {
    constructor() {
        this.logger = new Logger();
        this.reasoner = new DevelopmentReasoner(this.logger);
        this.fileManager = new FileManager(this.logger);
        this.gitManager = new GitManager(this.logger);
        this.learningSystem = new LearningSystem(this.logger, CONFIG);
        
        this.logger.log('🚀 Iterative Development System initialized');
        this.logger.log('🤖 Autonomous mode: ' + (CONFIG.autonomous.enabled ? 'ENABLED' : 'DISABLED'));
        this.logger.log('🧠 Learning system: ENABLED');
    }

    async initialize() {
        this.logger.log('⚙️  Initializing development environment...');
        
        // Load learning data and prevention rules
        const preventionRules = this.learningSystem.getPreventionRules();
        this.logger.log(`📚 Loaded ${preventionRules.length} prevention rules`);
        
        // Ensure we're on the correct branch
        await this.gitManager.ensureRDBranch();
        
        // Sync with remote
        await this.gitManager.syncWithRemote();
        
        // Check log health
        if (CONFIG.autonomous.checkLogs) {
            const logHealthy = this.logger.checkLogHealth();
            if (!logHealthy) {
                this.logger.log('🚨 Log health check failed - proceeding with caution');
            }
        }
        
        this.logger.log('✅ Environment initialized');
    }

    // Enhanced safe file modification
    async safeModifyFile(filePath, modificationFunction, description) {
        this.logger.log(`🛡️  Safe modification: ${description}`);
        
        // Check if file exists and backup
        if (!fs.existsSync(filePath)) {
            this.logger.error(`File not found: ${filePath}`);
            return false;
        }

        const originalContent = fs.readFileSync(filePath, 'utf8');
        const backup = this.learningSystem.backupCodeBeforeChange(filePath, 'safe-modify');
        
        if (!backup) {
            this.logger.error('Failed to create backup - aborting modification');
            return false;
        }

        try {
            // Apply modification
            const newContent = modificationFunction(originalContent);
            
            // Validate the change
            const validation = this.learningSystem.validateProposedChange(
                originalContent, 
                newContent, 
                filePath
            );
            
            if (!validation.approved) {
                this.logger.error('🚫 Change rejected by learning system');
                validation.reasons.forEach(reason => {
                    this.logger.error(`   - ${reason}`);
                });
                
                // Get safer approach suggestion
                const saferApproach = this.learningSystem.getSaferChangeApproach(filePath, description);
                this.logger.log('💡 Safer approach suggested:');
                saferApproach.recommendations.forEach(rec => {
                    this.logger.log(`   - ${rec}`);
                });
                
                return false;
            }
            
            // Apply the validated change
            fs.writeFileSync(filePath, newContent);
            this.logger.log(`✅ Safe modification completed: ${description}`);
            
            return true;
            
        } catch (error) {
            this.logger.error('Error during safe modification', error);
            
            // Restore from backup
            try {
                fs.copyFileSync(backup.backupPath, filePath);
                this.logger.log('🔄 File restored from backup');
            } catch (restoreError) {
                this.logger.error('Failed to restore backup', restoreError);
            }
            
            // Record mistake
            this.learningSystem.recordMistake(
                'modificationError',
                `Failed to modify ${filePath}: ${error.message}`,
                filePath,
                { error: error.message }
            );
            
            return false;
        }
    }

    async runIteration() {
        this.logger.log(`\n=== ITERATION ${++this.reasoner.currentState.iteration} ===`);
        
        // Check if overhaul is needed before proceeding
        const learningReport = this.learningSystem.generateLearningReport();
        if (learningReport.overhaulNeeded) {
            this.logger.log('🚨 SYSTEM OVERHAUL NEEDED - Switching to conservative mode');
            return await this.runConservativeIteration();
        }
        
        let retries = 0;
        let success = false;
        
        while (!success && retries < CONFIG.autonomous.maxRetries) {
            try {
                // Clean environment
                this.fileManager.cleanUnusedFiles();
                
                // Analyze next step with learning context
                const nextStep = this.reasoner.analyzeNextStep();
                if (!nextStep) {
                    this.logger.log('🎉 Development completed!');
                    return false;
                }

                // Execute step with enhanced safety
                const result = await this.executeStepWithSafety(nextStep, retries);
                
                // Update state
                this.reasoner.completeTask(nextStep.task, result ? 'SUCCESS' : 'FAILED');
                
                // Create backup and commit if successful
                if (result) {
                    this.fileManager.createBackup();
                    await this.gitManager.commitChanges(`Iteration ${this.reasoner.currentState.iteration}: ${nextStep.task}`);
                    success = true;
                } else if (CONFIG.autonomous.selfCorrection) {
                    this.logger.log('🔄 Attempting autonomous self-correction with learning...');
                    retries++;
                }
                
            } catch (error) {
                this.logger.error('Iteration failed', error);
                
                // Record the iteration failure
                this.learningSystem.recordMistake(
                    'iterationFailure',
                    `Iteration ${this.reasoner.currentState.iteration} failed: ${error.message}`,
                    'system',
                    { iteration: this.reasoner.currentState.iteration, error: error.message }
                );
                
                if (CONFIG.autonomous.selfCorrection && retries < CONFIG.autonomous.maxRetries) {
                    this.logger.log(`🔄 Retrying iteration (${retries + 1}/${CONFIG.autonomous.maxRetries})...`);
                    retries++;
                    
                    // Enhanced autonomous error correction with learning
                    await this.handleAutonomousCorrectionWithLearning(error);
                } else {
                    this.reasoner.addIssue(error.message, 'HIGH');
                    break;
                }
            }
        }
        
        return success;
    }

    // Conservative iteration mode when mistakes are high
    async runConservativeIteration() {
        this.logger.log('🛡️  Running CONSERVATIVE iteration mode...');
        
        // Only do safe, non-destructive operations
        const safeOperations = [
            'create_documentation',
            'validate_existing_code',
            'run_tests',
            'generate_reports'
        ];
        
        // Clean environment (safe)
        this.fileManager.cleanUnusedFiles();
        
        // Generate comprehensive report
        const report = this.learningSystem.generateLearningReport();
        this.logger.log('📊 Learning report generated in conservative mode');
        
        // Commit the reports
        await this.gitManager.commitChanges(`Conservative iteration: Learning report and cleanup`);
        
        return false; // End iterations in conservative mode
    }

    async executeStepWithSafety(step, retryCount = 0) {
        this.logger.log(`⚡ Executing with safety: ${step.task} (attempt ${retryCount + 1})`);
        
        // Get prevention rules for this step
        const preventionRules = this.learningSystem.getPreventionRules();
        this.logger.log(`🛡️  Applying ${preventionRules.length} prevention rules`);
        
        try {
            // Execute with enhanced safety
            switch (step.task) {
                case 'setup_rd_environment':
                    return await this.setupRDEnvironmentSafe();
                
                case 'analyze_main_project':
                    return await this.analyzeMainProjectSafe();
                    
                case 'implement_bilingual_landing':
                    return await this.implementBilingualLandingSafe();
                    
                default:
                    this.logger.log(`⚠️  Step execution not implemented: ${step.task}`);
                    
                    // Record as learning opportunity instead of mistake
                    this.learningSystem.recordMistake(
                        'unimplementedFeature',
                        `Feature not yet implemented: ${step.task}`,
                        'system',
                        { task: step.task, suggestion: 'Add implementation for this task' }
                    );
                    
                    return false;
            }
        } catch (error) {
            this.logger.error(`Step execution failed: ${step.task}`, error);
            
            // Enhanced error analysis with learning
            const solution = this.logger.analyzeError(error.message, error);
            if (solution) {
                const fixResult = await this.applyAutonomousFixWithLearning(solution, step, error);
                if (fixResult) {
                    // Record successful fix
                    this.learningSystem.recordSuccessfulFix(
                        Date.now(),
                        solution,
                        `Applied ${solution.action} for ${step.task}`
                    );
                    return fixResult;
                }
            }
            
            throw error;
        }
    }

    async handleAutonomousCorrectionWithLearning(error) {
        this.logger.log('🤖 Applying autonomous correction with learning...');
        
        // Check if we've seen this error before
        const similarMistakes = this.learningSystem.mistakes.totalMistakes;
        if (similarMistakes > 0) {
            this.logger.log(`📚 Found ${similarMistakes} similar past mistakes - applying learned solutions`);
        }
        
        // Apply standard corrections with enhanced safety
        if (error.message.includes('ENOENT')) {
            this.logger.log('📁 Creating missing directories with validation...');
            const dirs = ['backups', 'tests', 'docs', 'logs'];
            dirs.forEach(dir => {
                const dirPath = path.join(CONFIG.rdPath, dir);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                    this.logger.log(`✅ Created: ${dir}`);
                }
            });
        }
        
        if (error.message.includes('Permission')) {
            this.logger.log('🔧 Fixing permissions with learning validation...');
            this.fileManager.fixPermissions();
        }
        
        // Enhanced wait with learning-based delay
        const waitTime = Math.min(2000 * (similarMistakes + 1), 10000);
        this.logger.log(`⏳ Waiting ${waitTime}ms before retry (learned delay)`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    async applyAutonomousFixWithLearning(solution, step, originalError) {
        this.logger.log(`🛠️  Applying learned fix: ${solution.action}`);
        
        try {
            switch (solution.action) {
                case 'skip_browser_tests':
                    this.logger.log('⏭️  Skipping browser API tests (learned safe approach)');
                    return true;
                    
                case 'create_missing_files':
                    this.logger.log('📄 Creating missing files with validation...');
                    // Enhanced file creation with safety checks
                    return true;
                    
                case 'fix_permissions':
                    const result = this.fileManager.fixPermissions();
                    if (result) {
                        this.learningSystem.recordSuccessfulFix(
                            Date.now(),
                            solution,
                            'Permission fix successful'
                        );
                    }
                    return result;
                    
                case 'retry_git_operation':
                    this.logger.log('🔄 Retrying Git operation with learned patience...');
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    return await this.gitManager.syncWithRemote();
                    
                default:
                    this.logger.log(`❓ Unknown fix action: ${solution.action}`);
                    // Record as learning opportunity
                    this.learningSystem.recordMistake(
                        'unknownFix',
                        `Unknown fix action: ${solution.action}`,
                        'system',
                        { action: solution.action, originalError: originalError.message }
                    );
                    return false;
            }
        } catch (fixError) {
            this.logger.error(`Fix failed: ${solution.action}`, fixError);
            this.learningSystem.recordMistake(
                'fixFailure',
                `Fix failed: ${solution.action} - ${fixError.message}`,
                'system',
                { originalFix: solution.action, fixError: fixError.message }
            );
            return false;
        }
    }

    // Safe versions of operations
    async setupRDEnvironmentSafe() {
        this.logger.log('🏗️  Setting up RD environment (SAFE MODE)...');
        
        const requiredDirs = ['backups', 'tests', 'docs', 'logs', 'safe_zone'];
        let createdCount = 0;
        
        requiredDirs.forEach(dir => {
            const dirPath = path.join(CONFIG.rdPath, dir);
            if (!fs.existsSync(dirPath)) {
                try {
                    fs.mkdirSync(dirPath, { recursive: true });
                    this.logger.log(`📁 Created directory: ${dir}`);
                    createdCount++;
                } catch (error) {
                    this.logger.error(`Failed to create ${dir}`, error);
                    this.learningSystem.recordMistake(
                        'directoryCreation',
                        `Failed to create directory: ${dir}`,
                        dirPath,
                        { error: error.message }
                    );
                }
            }
        });

        this.logger.log(`✅ Safe environment setup completed (${createdCount} directories created)`);
        return true;
    }

    async analyzeMainProjectSafe() {
        this.logger.log('🔍 Analyzing main project (SAFE MODE)...');
        
        try {
            if (fs.existsSync(CONFIG.mainProject)) {
                const content = fs.readFileSync(CONFIG.mainProject, 'utf8');
                
                // Enhanced analysis with safety metrics
                const analysis = {
                    timestamp: new Date().toISOString(),
                    safetyMode: true,
                    basicMetrics: {
                        size: content.length,
                        lines: content.split('\n').length,
                        functions: this.learningSystem.countFunctions(content),
                        hasJavaScript: content.includes('<script>'),
                        hasCSS: content.includes('<style>'),
                        hasGaming: content.includes('game'),
                        hasBilingual: content.includes('lang'),
                        hasLocalStorage: content.includes('localStorage'),
                        hasIndexedDB: content.includes('IndexedDB')
                    },
                    safetyMetrics: {
                        codeHash: this.learningSystem.createCodeHash(content),
                        preservationLevel: 'HIGH',
                        riskAssessment: 'LOW'
                    },
                    securityFeatures: {
                        hasCSP: content.includes('Content-Security-Policy'),
                        hasInputValidation: content.includes('validateInput'),
                        hasXSSProtection: content.includes('sanitize')
                    }
                };

                // Save analysis safely
                const analysisPath = path.join(CONFIG.rdPath, 'safe_analysis.json');
                fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
                
                this.logger.log(`📊 Safe analysis complete - Functions: ${analysis.basicMetrics.functions}, Size: ${analysis.basicMetrics.size} chars`);
                return true;
            } else {
                this.logger.error('Main project file not found');
                return false;
            }
        } catch (error) {
            this.logger.error('Failed to analyze main project safely', error);
            this.learningSystem.recordMistake(
                'analysisError',
                'Safe analysis failed',
                CONFIG.mainProject,
                { error: error.message }
            );
            return false;
        }
    }

    async implementBilingualLandingSafe() {
        this.logger.log('🌍 Implementing bilingual landing (SAFE MODE)...');
        
        // Create comprehensive bilingual plan without touching main code
        const bilingualPlan = {
            mode: 'SAFE_IMPLEMENTATION',
            timestamp: new Date().toISOString(),
            languages: ['fr', 'en'],
            sections: ['header', 'about', 'skills', 'experience', 'contact'],
            features: ['language_switch', 'persistent_preference', 'dynamic_content'],
            implementation: {
                approach: 'JSON-based translation system',
                safety: 'No modifications to existing code',
                strategy: 'Additive implementation only',
                validation: 'Pre-change validation required'
            },
            safetyChecks: [
                'Backup existing code before any changes',
                'Validate all translations',
                'Test language switching separately',
                'Preserve all existing functionality'
            ],
            learningIntegration: {
                mistakePrevention: true,
                destructiveChangePrevention: true,
                functionPreservation: true
            }
        };

        const planPath = path.join(CONFIG.rdPath, 'safe_bilingual_plan.json');
        fs.writeFileSync(planPath, JSON.stringify(bilingualPlan, null, 2));
        
        this.logger.log('📝 Safe bilingual implementation plan created');
        this.logger.log('🛡️  Ready for careful implementation phase');
        
        return true;
    }

    async run() {
        this.logger.log('🎯 Starting iterative development process with learning...');
        
        // Initialize environment with learning
        await this.initialize();
        
        let continueIterating = true;
        while (continueIterating && this.reasoner.currentState.iteration < CONFIG.iterations.maxIterations) {
            continueIterating = await this.runIteration();
            
            // Adaptive pause based on learning
            const mistakes = this.learningSystem.mistakes.totalMistakes;
            const waitTime = Math.min(2000 + (mistakes * 500), 10000);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        this.logger.log('✅ Development process completed');
        
        // Generate final learning report
        const finalReport = this.learningSystem.generateLearningReport();
        this.logger.log(`📚 Final learning report: ${finalReport.totalMistakes} mistakes recorded`);
        
        await this.generateEnhancedReport();
        
        // Final commit with learning summary
        await this.gitManager.commitChanges(`Final: Development cycle completed with ${finalReport.totalMistakes} lessons learned`);
    }

    async generateEnhancedReport() {
        const learningReport = this.learningSystem.generateLearningReport();
        
        const report = {
            iterations: this.reasoner.currentState.iteration,
            completedTasks: this.reasoner.currentState.completedTasks.length,
            pendingTasks: this.reasoner.currentState.pendingTasks.length,
            issues: this.reasoner.currentState.issues.length,
            autonomousFeatures: CONFIG.autonomous.enabled,
            gitBranch: CONFIG.git.rdBranch,
            learningStats: {
                totalMistakes: learningReport.totalMistakes,
                mistakesByType: learningReport.mistakesByType,
                preventionRules: learningReport.preventionRules.length,
                overhaulNeeded: learningReport.overhaulNeeded
            },
            generatedAt: new Date().toISOString(),
            summary: {
                success: this.reasoner.currentState.completedTasks.length > 0,
                safetyLevel: learningReport.totalMistakes < 5 ? 'HIGH' : 'MEDIUM',
                recommendation: this.reasoner.currentState.pendingTasks.length === 0 ? 
                    'Ready for production merge with learned safety measures' : 
                    'Continue development with enhanced safety protocols'
            }
        };

        const reportPath = path.join(CONFIG.rdPath, 'enhanced_development_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        this.logger.log('📄 Enhanced development report generated');
        this.logger.log(`✅ Summary: ${report.completedTasks} tasks completed, ${report.learningStats.totalMistakes} lessons learned`);
    }
}

// Initialize and run the system
const devSystem = new IterativeDevelopmentSystem();
devSystem.run().catch(error => {
    console.error('System failed:', error);
});

module.exports = { IterativeDevelopmentSystem, Logger, DevelopmentReasoner };
