#!/usr/bin/env node
/**
 * 🚀 COMMIT HELPER - Évolution Système v1.0
 * 
 * PROBLÈME RÉSOLU : Messages commit multiligne sur CMD Windows
 * ERREUR : CMD interprète ✅/- comme commandes après git commit -m
 * SOLUTION : Helper pour commits propres et sécurisés
 */

const fs = require('fs');
const { execSync } = require('child_process');

function createCommitMessage(version, title, features = [], files = [], architecture = []) {
    let message = `${version} - ${title}\n\n`;
    
    if (features.length > 0) {
        message += `NOUVEAUTÉS ${version}:\n`;
        features.forEach(feature => message += `- ${feature}\n`);
        message += '\n';
    }
    
    if (files.length > 0) {
        message += `FICHIERS AJOUTÉS:\n`;
        files.forEach(file => message += `- ${file}\n`);
        message += '\n';
    }
    
    if (architecture.length > 0) {
        message += `ARCHITECTURE:\n`;
        architecture.forEach(arch => message += `- ${arch}\n`);
        message += '\n';
    }
    
    return message.trim();
}

function safeCommit(message) {
    // Créer fichier temporaire pour éviter erreurs CMD multiline
    const tempFile = 'temp_commit_msg.txt';
    
    try {
        // Écrire message dans fichier
        fs.writeFileSync(tempFile, message, 'utf8');
        
        // Commit avec fichier (évite problèmes CMD)
        const result = execSync(`git commit -F ${tempFile}`, { encoding: 'utf8' });
        
        // Nettoyer fichier temporaire
        fs.unlinkSync(tempFile);
        
        console.log('✅ COMMIT RÉUSSI AVEC HELPER:');
        console.log(result);
        
        return true;
    } catch (error) {
        // Nettoyer en cas d'erreur
        if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
        }
        
        console.error('❌ ERREUR COMMIT:', error.message);
        return false;
    }
}

// Export pour utilisation
module.exports = { createCommitMessage, safeCommit };

// Utilisation directe si appelé en script
if (require.main === module) {
    console.log('🚀 COMMIT HELPER - Évolution Système');
    console.log('Usage: node commit_helper.js');
    console.log('Ou: require("./commit_helper.js").safeCommit("message")');
}
