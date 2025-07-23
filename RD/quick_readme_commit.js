#!/usr/bin/env node
/**
 * 🚀 COMMIT RAPIDE - Système README
 */

const { createCommitMessage, safeCommit } = require('./commit_helper.js');

// Message commit pour mise à jour README
const message = createCommitMessage(
    'v1.3',
    'README Principal - Synchronisation GitHub',
    [
        'README racine mis à jour avec contenu v1.3',
        'Documentation Mobile First Revolution',
        'Système AI Control System documenté',
        'Nettoyage automatique des README multiples'
    ],
    [
        'README.md - Version principale GitHub',
        'RD/smart_cleanup_v2.js - Système adaptatif',
        'RD/cleanup_rules.json - Règles apprises'
    ],
    [
        'Git status synchronisé',
        'Branch RD-development à jour',
        'Documentation GitHub visible'
    ]
);

console.log('🎯 COMMIT README SYSTÈME...');
console.log(message);

// Utiliser helper pour commit sécurisé
if (safeCommit(message)) {
    console.log('✅ README SYNCHRONISÉ AVEC GITHUB!');
} else {
    console.log('❌ ERREUR COMMIT README');
}
