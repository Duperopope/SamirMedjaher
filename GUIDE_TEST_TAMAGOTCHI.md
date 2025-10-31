# 🎮 Guide de Test : Déblocage Tamagotchi

## 🚀 URL de Test

**Serveur local actif** : https://3000-iq1qmxxgskgyrxelcuypx-2b54fc91.sandbox.novita.ai

## ✅ Test 1 : Débloquer le Mode Gaming (3 clics)

### Étapes
1. Ouvre l'URL ci-dessus
2. **Clique RAPIDEMENT 3 fois** sur ta photo de profil (en haut à gauche)
3. À chaque clic, un dialogue doit apparaître avec un message aléatoire
4. Au **3ème clic**, tu dois voir :
   - 🎉 Message "Mode Gaming débloqué !"
   - 🐱 **Éric le chat** (Tamagotchi) apparaît en bas à droite
   - 🎮 Bouton mini-jeux apparaît

### Résultats Attendus
- ✅ Dialogue à chaque clic (pas de clic ignoré)
- ✅ Compteur interne : 1 → 2 → 3
- ✅ Tamagotchi visible et interactif après le 3ème clic

### 🐛 Si ça ne marche pas
- Vérifie dans DevTools (F12) → Console → Recherche erreurs JavaScript
- Vérifie localStorage : `localStorage.getItem('portraitClicks')` doit afficher "3"

---

## 🔄 Test 2 : Reset localStorage (Long Press 10s)

### Étapes
1. **Maintiens le doigt/souris** sur ta photo de profil
2. Après **500ms** : 
   - 📱 Vibration légère (mobile uniquement)
   - 🔴 Barre rouge apparaît en bas du portrait
3. Continue à maintenir pendant **10 secondes**
4. La barre progresse de 0% → 100%
5. À 10s :
   - 🔔 Alert "localStorage réinitialisé !"
   - 🔄 Page se recharge automatiquement

### Résultats Attendus
- ✅ Barre de progression visible après 500ms
- ✅ Animation fluide jusqu'à 100%
- ✅ Reset + reload après 10s
- ✅ Après reload, `portraitClicks` revient à 0

### 🐛 Si ça ne marche pas
- La barre doit être visible uniquement après 500ms de pression
- Si tu relâches avant 10s, la barre disparaît (comportement normal)

---

## ⏱️ Test 3 : Annulation Long Press

### Étapes
1. Maintiens le portrait pendant **2-3 secondes**
2. La barre rouge doit être à ~30%
3. **Relâche** avant d'atteindre 10s
4. La barre disparaît immédiatement

### Résultats Attendus
- ✅ Barre disparaît proprement
- ✅ PAS de dialogue de clic (c'est normal, tu as maintenu > 500ms)
- ✅ PAS de reset (seulement si tu atteins 10s)

---

## 🎯 Différence Click / Long Press

| Action | Durée | Comportement |
|--------|-------|--------------|
| **Click rapide** | < 500ms | ✅ Dialogue + compteur incrémenté |
| **Press court** | 500ms - 10s | 🔴 Barre visible, puis annulé si relâché |
| **Long press** | ≥ 10s | 🔄 Reset localStorage complet |

---

## 🔍 Debug avec DevTools

Ouvre la Console (F12) et teste :

```javascript
// Vérifier le compteur de clics
localStorage.getItem('portraitClicks')  // "0", "1", "2", "3"...

// Vérifier si gaming est débloqué
localStorage.getItem('gamingUnlocked')  // "true" après 3 clics

// Forcer le reset (si besoin)
localStorage.clear()
location.reload()

// Vérifier état Tamagotchi
localStorage.getItem('tamagotchi')  // JSON avec hunger, mood, sleep
```

---

## 📝 Checklist Complète

- [ ] **Test 1 réussi** : 3 clics rapides débloquent Éric
- [ ] **Test 2 réussi** : Long press 10s reset localStorage
- [ ] **Test 3 réussi** : Annulation long press fonctionne
- [ ] **Pas de bugs** dans la Console DevTools
- [ ] **Comportement mobile** OK (avec vibration)
- [ ] **Comportement desktop** OK (sans vibration)

---

## 🎉 Si Tout Fonctionne

**Prêt pour déploiement GitHub Pages !**

Prochaines étapes :
1. ✅ Commit et push vers GitHub
2. 🚀 Déploiement automatique via GitHub Pages
3. 🌐 URL publique : `https://yourusername.github.io/webapp/`

---

**Note Technique** : Ce fix résout le conflit entre `event.preventDefault()` et l'événement `click`. La solution utilise un délai de grâce de 500ms pour discriminer intelligemment entre clics normaux et long press.

**Référence** : Voir `/home/user/webapp/CLICK_LONGPRESS_FIX.md` pour détails techniques complets.
