// Project Mapping System - Smart Context Management
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ProjectMapper {
    constructor() {
        this.projectRoot = 'g:/Code/CV';
        this.rdPath = path.join(this.projectRoot, 'RD');
        this.mapPath = path.join(this.rdPath, 'project_map.json');
        this.contextPath = path.join(this.rdPath, 'context_memory.json');
        this.projectMap = null;
        this.contextMemory = null;
    }

    // Generate file hash for change detection
    generateFileHash(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return crypto.createHash('md5').update(content).digest('hex');
        } catch (error) {
            return null;
        }
    }

    // Extract key information from HTML file
    analyzeHTMLFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        return {
            fileSize: content.length,
            lastModified: fs.statSync(filePath).mtime.toISOString(),
            hash: this.generateFileHash(filePath),
            structure: {
                // CSS Features
                hasCustomCSS: content.includes('<style>'),
                hasTailwind: content.includes('tailwindcss'),
                hasFontAwesome: content.includes('fontawesome'),
                
                // JavaScript Features
                hasGamingSystem: content.includes('gamingMode'),
                hasLanguageSwitch: content.includes('switchLanguage'),
                hasAchievements: content.includes('ACHIEVEMENTS'),
                hasParticleSystem: content.includes('particleCanvas'),
                
                // Content Sections
                hasPortfolio: content.includes('portfolio'),
                hasSkillsSection: content.includes('skills'),
                hasExperienceSection: content.includes('experience'),
                
                // Security Features
                hasXSSProtection: content.includes('sanitize') || content.includes('escape'),
                hasPasswordHashing: content.includes('crypto') && content.includes('SHA'),
                
                // Performance Features
                hasLocalStorage: content.includes('localStorage'),
                hasIndexedDB: content.includes('IndexedDB'),
                
                // Bilingual Features
                hasTranslations: content.includes('translations = {'),
                hasMultiLanguage: (content.match(/fr:\s*{/g) || []).length > 0 && (content.match(/en:\s*{/g) || []).length > 0
            },
            keyFunctions: this.extractKeyFunctions(content),
            translations: this.extractTranslationInfo(content),
            gameFeatures: this.extractGameFeatures(content),
            securityMeasures: this.extractSecurityMeasures(content)
        };
    }

    extractKeyFunctions(content) {
        const functions = [];
        const functionRegex = /function\s+(\w+)\s*\(/g;
        let match;
        
        while ((match = functionRegex.exec(content)) !== null) {
            functions.push(match[1]);
        }
        
        return {
            count: functions.length,
            critical: functions.filter(fn => 
                fn.includes('game') || 
                fn.includes('language') || 
                fn.includes('security') || 
                fn.includes('achievement')
            ),
            all: functions.slice(0, 20) // First 20 functions to avoid token overload
        };
    }

    extractTranslationInfo(content) {
        const translationMatch = content.match(/translations\s*=\s*{([\s\S]*?)};/);
        if (!translationMatch) return { hasTranslations: false };

        const translationContent = translationMatch[1];
        const languages = [];
        
        if (translationContent.includes('fr:')) languages.push('fr');
        if (translationContent.includes('en:')) languages.push('en');
        
        return {
            hasTranslations: true,
            languages: languages,
            sections: this.countTranslationSections(translationContent)
        };
    }

    countTranslationSections(content) {
        const sections = [
            'header', 'skills', 'experience', 'education', 
            'projects', 'international', 'gaming', 'achievements'
        ];
        
        return sections.filter(section => content.includes(`${section}:`)).length;
    }

    extractGameFeatures(content) {
        return {
            hasGamingMode: content.includes('gamingMode'),
            hasAchievements: content.includes('ACHIEVEMENTS'),
            hasGameStats: content.includes('gameStats'),
            hasParticles: content.includes('particleCanvas'),
            hasTamagotchi: content.includes('tamagotchi'),
            hasHUD: content.includes('game-hud')
        };
    }

    extractSecurityMeasures(content) {
        return {
            hasCSP: content.includes('Content-Security-Policy'),
            hasXSSProtection: content.includes('innerHTML') ? 'NEEDS_REVIEW' : 'GOOD',
            hasInputValidation: content.includes('sanitize') || content.includes('validate'),
            hasPasswordHashing: content.includes('crypto') && content.includes('SHA')
        };
    }

    // Build comprehensive project map
    async buildProjectMap() {
        console.log('🗺️ Building comprehensive project map...');
        
        const projectMap = {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            projectInfo: {
                name: 'Interactive CV Portfolio',
                type: 'Single-page Application',
                hosting: 'GitHub Pages',
                mainObjective: 'Bilingual interactive showcase with gaming elements'
            },
            files: {
                main: this.analyzeHTMLFile(path.join(this.projectRoot, 'index.html')),
                readme: this.analyzeDocumentFile(path.join(this.projectRoot, 'README.md')),
                rdFolder: this.analyzeRDFolder()
            },
            currentPhase: this.determineCurrentPhase(),
            nextTasks: this.generateNextTasks(),
            tokenOptimization: {
                keyAreas: [
                    'bilingual_system',
                    'gaming_features',
                    'security_measures',
                    'google_drive_integration',
                    'performance_optimization'
                ],
                criticalFunctions: this.files?.main?.keyFunctions?.critical || [],
                frequentlyAccessed: [
                    'switchLanguage',
                    'toggleGaming',
                    'unlockAchievement',
                    'saveGameStats',
                    'updateContent'
                ]
            }
        };

        // Save the map
        fs.writeFileSync(this.mapPath, JSON.stringify(projectMap, null, 2));
        this.projectMap = projectMap;

        console.log(`✅ Project map saved: ${this.mapPath}`);
        return projectMap;
    }

    analyzeDocumentFile(filePath) {
        if (!fs.existsSync(filePath)) return { exists: false };
        
        const content = fs.readFileSync(filePath, 'utf8');
        return {
            exists: true,
            size: content.length,
            hash: this.generateFileHash(filePath),
            lastModified: fs.statSync(filePath).mtime.toISOString(),
            keyTopics: this.extractKeyTopics(content)
        };
    }

    extractKeyTopics(content) {
        const topics = [];
        const lines = content.split('\n');
        
        lines.forEach(line => {
            if (line.startsWith('##') || line.startsWith('###')) {
                topics.push(line.replace(/^#+\s*/, '').trim());
            }
        });
        
        return topics;
    }

    analyzeRDFolder() {
        const rdFiles = fs.readdirSync(this.rdPath);
        const analysis = {
            fileCount: rdFiles.length,
            files: {}
        };

        rdFiles.forEach(file => {
            const filePath = path.join(this.rdPath, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isFile()) {
                analysis.files[file] = {
                    size: stats.size,
                    modified: stats.mtime.toISOString(),
                    type: path.extname(file) || 'no-extension'
                };
            }
        });

        return analysis;
    }

    determineCurrentPhase() {
        // Analyze current state to determine development phase
        if (!this.projectMap) return 'INITIAL';
        
        const main = this.projectMap.files.main;
        if (!main) return 'SETUP_REQUIRED';
        
        const features = main.structure;
        
        if (features.hasMultiLanguage && features.hasGamingSystem && features.hasPortfolio) {
            return 'OPTIMIZATION_AND_SECURITY';
        } else if (features.hasMultiLanguage && features.hasGamingSystem) {
            return 'PORTFOLIO_ENHANCEMENT';
        } else if (features.hasMultiLanguage) {
            return 'GAMING_INTEGRATION';
        } else {
            return 'BILINGUAL_DEVELOPMENT';
        }
    }

    generateNextTasks() {
        const phase = this.determineCurrentPhase();
        
        const taskMap = {
            'BILINGUAL_DEVELOPMENT': [
                'Complete translation system',
                'Add language switching animations',
                'Implement role-based navigation'
            ],
            'GAMING_INTEGRATION': [
                'Enhance achievement system',
                'Add more interactive elements',
                'Implement progress tracking'
            ],
            'PORTFOLIO_ENHANCEMENT': [
                'Google Drive integration for games',
                'Video portfolio optimization',
                'Interactive project showcases'
            ],
            'OPTIMIZATION_AND_SECURITY': [
                'XSS protection implementation',
                'Performance optimization',
                'Memory management improvement',
                'CSP policy configuration'
            ]
        };

        return taskMap[phase] || ['Analyze current state', 'Define next objectives'];
    }

    // Smart context retrieval - saves tokens
    getRelevantContext(query) {
        if (!this.projectMap) {
            this.loadProjectMap();
        }

        const context = {
            query: query,
            relevantSections: [],
            suggestedActions: [],
            keyFiles: []
        };

        // Analyze query to determine what context is needed
        const queryLower = query.toLowerCase();
        
        if (queryLower.includes('bilingual') || queryLower.includes('language') || queryLower.includes('translation')) {
            context.relevantSections.push('translations', 'switchLanguage', 'multilingual');
            context.suggestedActions.push('Focus on translation system and language switching');
            context.keyFiles.push('index.html: translation object and switchLanguage function');
        }
        
        if (queryLower.includes('gaming') || queryLower.includes('achievement') || queryLower.includes('game')) {
            context.relevantSections.push('gaming_system', 'achievements', 'game_stats');
            context.suggestedActions.push('Focus on gaming features and achievement system');
            context.keyFiles.push('index.html: ACHIEVEMENTS object and gaming functions');
        }

        if (queryLower.includes('security') || queryLower.includes('xss') || queryLower.includes('protection')) {
            context.relevantSections.push('security_measures', 'xss_protection', 'input_validation');
            context.suggestedActions.push('Focus on security implementations');
        }

        return context;
    }

    loadProjectMap() {
        try {
            if (fs.existsSync(this.mapPath)) {
                this.projectMap = JSON.parse(fs.readFileSync(this.mapPath, 'utf8'));
                return true;
            }
        } catch (error) {
            console.warn('Failed to load project map:', error.message);
        }
        return false;
    }

    // Quick status check - minimal token usage
    getProjectStatus() {
        if (!this.loadProjectMap()) {
            return { status: 'NO_MAP', recommendation: 'Run buildProjectMap() first' };
        }

        const main = this.projectMap.files.main;
        return {
            status: 'MAPPED',
            phase: this.projectMap.currentPhase,
            fileSize: main.fileSize,
            lastUpdate: main.lastModified,
            features: Object.keys(main.structure).filter(key => main.structure[key] === true),
            nextTasks: this.projectMap.nextTasks,
            tokenSavingTip: 'Use getRelevantContext(query) for focused analysis'
        };
    }

    async updateMap() {
        console.log('🔄 Updating project map...');
        await this.buildProjectMap();
        console.log('✅ Project map updated successfully');
    }
}

// CLI interface
if (require.main === module) {
    const mapper = new ProjectMapper();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'build':
            mapper.buildProjectMap();
            break;
        case 'status':
            console.log(JSON.stringify(mapper.getProjectStatus(), null, 2));
            break;
        case 'context':
            const query = process.argv[3] || 'general';
            console.log(JSON.stringify(mapper.getRelevantContext(query), null, 2));
            break;
        case 'update':
            mapper.updateMap();
            break;
        default:
            console.log('Usage: node project_mapper.js [build|status|context|update] [query]');
    }
}

module.exports = { ProjectMapper };
