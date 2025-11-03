/**
 * 🔔 UNIFIED NOTIFICATIONS SYSTEM v1.0
 * Gestion centralisée de toutes les notifications gaming
 * Remplace: showAchievement() + showGameNotification()
 */

console.log('🔔 Unified Notifications System loading...');

// ============================================
// CONFIGURATION
// ============================================

const NOTIFICATION_CONFIG = {
    maxVisible: 5,           // Max 5 notifications visibles simultanément
    defaultDuration: 4000,   // 4 secondes par défaut
    achievementDuration: 6000, // 6 secondes pour les achievements
    epicDuration: 8000,      // 8 secondes pour les epic
    stackGap: 12,            // Gap entre les notifications empilées (px)
    autoHide: true           // Auto-hide après la durée
};

// ============================================
// STATE MANAGEMENT
// ============================================

const notificationState = {
    queue: [],               // File d'attente des notifications
    active: [],              // Notifications actuellement affichées
    isVisible: true,         // Zone visible ou cachée
    unreadCount: 0,          // Nombre de notifications non lues
    history: []              // Historique des 50 dernières notifications
};

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Affiche une notification unifiée
 * @param {string} message - Message à afficher
 * @param {string} type - Type: 'achievement', 'success', 'info', 'error', 'epic'
 * @param {object} options - Options additionnelles
 */
function showUnifiedNotification(message, type = 'info', options = {}) {
    const notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message: message,
        type: type,
        timestamp: Date.now(),
        duration: options.duration || (
            type === 'achievement' ? NOTIFICATION_CONFIG.achievementDuration :
            type === 'epic' ? NOTIFICATION_CONFIG.epicDuration :
            NOTIFICATION_CONFIG.defaultDuration
        ),
        title: options.title || getDefaultTitle(type),
        rewards: options.rewards || null,
        closeable: options.closeable !== false,
        sound: options.sound !== false
    };
    
    // Ajouter à la queue
    notificationState.queue.push(notification);
    
    // Incrémenter le compteur non lu si zone cachée
    if (!notificationState.isVisible) {
        notificationState.unreadCount++;
        updateNotificationBadge();
    }
    
    // Traiter la queue
    processNotificationQueue();
    
    // Log pour debug
    console.log(`🔔 Notification ajoutée: [${type.toUpperCase()}] ${message}`);
    
    return notification.id;
}

/**
 * Titre par défaut selon le type
 */
function getDefaultTitle(type) {
    const titles = {
        achievement: '🏆 Succès Débloqué !',
        success: '✅ Action Réussie',
        info: '💡 Information',
        error: '❌ Erreur',
        epic: '⭐ Événement Épique !'
    };
    return titles[type] || 'Notification';
}

/**
 * Traite la file d'attente des notifications
 */
function processNotificationQueue() {
    // Limiter le nombre de notifications actives
    while (
        notificationState.queue.length > 0 && 
        notificationState.active.length < NOTIFICATION_CONFIG.maxVisible
    ) {
        const notif = notificationState.queue.shift();
        displayNotification(notif);
    }
}

/**
 * Affiche physiquement la notification dans le DOM
 */
function displayNotification(notif) {
    const zone = document.getElementById('unifiedNotificationsZone');
    if (!zone) {
        console.error('❌ Unified notifications zone not found!');
        return;
    }
    
    // Créer l'élément notification
    const card = document.createElement('div');
    card.className = `notification-card ${notif.type}`;
    card.id = notif.id;
    card.setAttribute('data-timestamp', notif.timestamp);
    
    // Contenu HTML
    card.innerHTML = `
        <div class="notification-header">
            <h4 class="notification-title">${notif.title}</h4>
            ${notif.closeable ? '<button class="notification-close" onclick="closeNotification(\'' + notif.id + '\')">×</button>' : ''}
        </div>
        <p class="notification-message">${notif.message}</p>
        ${notif.rewards ? renderRewards(notif.rewards) : ''}
    `;
    
    // Ajouter au DOM
    zone.appendChild(card);
    
    // Ajouter à la liste active
    notificationState.active.push(notif);
    
    // Ajouter à l'historique
    notificationState.history.unshift(notif);
    if (notificationState.history.length > 50) {
        notificationState.history.pop();
    }
    
    // Animation d'apparition
    requestAnimationFrame(() => {
        card.classList.add('show');
    });
    
    // Son optionnel
    if (notif.sound && typeof playNotificationSound === 'function') {
        playNotificationSound(notif.type);
    }
    
    // Auto-hide après durée
    if (NOTIFICATION_CONFIG.autoHide) {
        setTimeout(() => {
            closeNotification(notif.id);
        }, notif.duration);
    }
}

/**
 * Ferme une notification spécifique
 */
function closeNotification(notifId) {
    const card = document.getElementById(notifId);
    if (!card) return;
    
    // Animation de fermeture
    card.classList.add('removing');
    card.classList.remove('show');
    
    // Retirer du DOM après animation
    setTimeout(() => {
        card.remove();
        
        // Retirer de la liste active
        notificationState.active = notificationState.active.filter(n => n.id !== notifId);
        
        // Traiter la queue si des notifications attendent
        processNotificationQueue();
    }, 500);
}

/**
 * Render les récompenses (coins, XP, items)
 */
function renderRewards(rewards) {
    let html = '<div class="notification-rewards">';
    
    if (rewards.coins) {
        html += `<div class="reward-item">🪙 +${rewards.coins}</div>`;
    }
    if (rewards.xp) {
        html += `<div class="reward-item">⭐ +${rewards.xp} XP</div>`;
    }
    if (rewards.skin) {
        html += `<div class="reward-item">👔 ${rewards.skin}</div>`;
    }
    if (rewards.title) {
        html += `<div class="reward-item">🏷️ ${rewards.title}</div>`;
    }
    
    html += '</div>';
    return html;
}

/**
 * Toggle affichage/masquage de la zone
 */
function toggleNotificationsZone() {
    notificationState.isVisible = !notificationState.isVisible;
    
    const zone = document.getElementById('unifiedNotificationsZone');
    const button = document.getElementById('notificationsToggle');
    
    if (notificationState.isVisible) {
        zone.classList.remove('hidden');
        button.classList.remove('has-notifications');
        notificationState.unreadCount = 0;
        updateNotificationBadge();
    } else {
        zone.classList.add('hidden');
    }
    
    // Sauvegarder la préférence
    localStorage.setItem('notifications-visible', notificationState.isVisible);
}

/**
 * Met à jour le badge de compteur
 */
function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    const button = document.getElementById('notificationsToggle');
    
    if (!badge || !button) return;
    
    if (notificationState.unreadCount > 0) {
        badge.textContent = notificationState.unreadCount > 9 ? '9+' : notificationState.unreadCount;
        badge.classList.add('show');
        button.classList.add('has-notifications');
    } else {
        badge.classList.remove('show');
        button.classList.remove('has-notifications');
    }
}

/**
 * Efface toutes les notifications actives
 */
function clearAllNotifications() {
    notificationState.active.forEach(notif => {
        closeNotification(notif.id);
    });
    notificationState.queue = [];
    notificationState.unreadCount = 0;
    updateNotificationBadge();
}

// ============================================
// FONCTIONS RÉTROCOMPATIBLES
// ============================================

/**
 * Rétrocompatibilité avec showAchievement()
 */
function showAchievement(title, description, rewards = {}) {
    const message = description || title;
    showUnifiedNotification(message, 'achievement', {
        title: title,
        rewards: rewards,
        duration: NOTIFICATION_CONFIG.achievementDuration
    });
}

/**
 * Rétrocompatibilité avec showGameNotification()
 */
function showGameNotification(text, type = 'success') {
    // Mapper les anciens types vers les nouveaux
    const typeMap = {
        'success': 'success',
        'error': 'error',
        'info': 'info',
        'epic': 'epic'
    };
    
    showUnifiedNotification(text, typeMap[type] || 'info');
}

// ============================================
// FONCTIONS DE NOTIFICATION SPÉCIFIQUES
// ============================================

/**
 * Notification pour gain de coins
 */
function notifyCoinsGained(amount, source = '') {
    const messages = {
        'click': `Clic récompensé !`,
        'minigame': `Mini-jeu terminé !`,
        'quest': `Quête complétée !`,
        'achievement': `Succès débloqué !`,
        'default': `Coins gagnés !`
    };
    
    showUnifiedNotification(
        messages[source] || messages.default,
        'success',
        {
            title: '🪙 Coins Gagnés',
            rewards: { coins: amount }
        }
    );
}

/**
 * Notification pour gain d'XP
 */
function notifyXPGained(amount, level, source = '') {
    showUnifiedNotification(
        `+${amount} XP gagné !`,
        'success',
        {
            title: `⭐ XP Gagné (Niveau ${level})`,
            rewards: { xp: amount }
        }
    );
}

/**
 * Notification pour level up
 */
function notifyLevelUp(newLevel) {
    showUnifiedNotification(
        `Félicitations ! Niveau ${newLevel} atteint !`,
        'epic',
        {
            title: '🎉 LEVEL UP !',
            duration: NOTIFICATION_CONFIG.epicDuration
        }
    );
}

/**
 * Notification pour quête complétée
 */
function notifyQuestCompleted(questTitle, rewards) {
    showUnifiedNotification(
        `Quête "${questTitle}" terminée !`,
        'achievement',
        {
            title: '✅ Quête Complétée',
            rewards: rewards
        }
    );
}

/**
 * Notification pour erreur d'inventaire
 */
function notifyInventoryError(message) {
    showUnifiedNotification(
        message,
        'error',
        {
            title: '📦 Inventaire',
            duration: 3000
        }
    );
}

// ============================================
// INITIALISATION
// ============================================

/**
 * Initialise le système de notifications
 */
function initUnifiedNotifications() {
    console.log('🔔 Initializing Unified Notifications System...');
    
    // Charger la préférence de visibilité
    const savedVisible = localStorage.getItem('notifications-visible');
    notificationState.isVisible = savedVisible !== 'false';
    
    // Appliquer l'état initial
    const zone = document.getElementById('unifiedNotificationsZone');
    if (zone && !notificationState.isVisible) {
        zone.classList.add('hidden');
    }
    
    // Attacher l'event listener au bouton toggle
    const toggleButton = document.getElementById('notificationsToggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleNotificationsZone);
    }
    
    // Notification de bienvenue (test)
    setTimeout(() => {
        showUnifiedNotification(
            'Système de notifications activé !',
            'info',
            { title: '🔔 Notifications', duration: 3000 }
        );
    }, 1000);
    
    console.log('✅ Unified Notifications System ready!');
}

// ============================================
// EXPOSE GLOBALLY
// ============================================

window.unifiedNotifications = {
    show: showUnifiedNotification,
    showAchievement,
    showGameNotification,
    close: closeNotification,
    clearAll: clearAllNotifications,
    toggle: toggleNotificationsZone,
    notifyCoinsGained,
    notifyXPGained,
    notifyLevelUp,
    notifyQuestCompleted,
    notifyInventoryError,
    getState: () => notificationState,
    init: initUnifiedNotifications
};

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnifiedNotifications);
} else {
    initUnifiedNotifications();
}

console.log('✅ Unified Notifications System v1.0 loaded!');
