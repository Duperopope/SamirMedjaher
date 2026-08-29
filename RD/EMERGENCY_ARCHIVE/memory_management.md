# Gestion de mémoire

## Objectifs
La gestion de mémoire dans ce projet vise à :
- Optimiser les performances du site.
- Réduire la consommation de ressources.
- Assurer la persistance des données utilisateur.

## Approches
### 1. Utilisation de `localStorage`
- **Avantages** :
  - Simple à implémenter.
  - Persistance des données même après la fermeture du navigateur.
- **Cas d'utilisation** :
  - Stockage des préférences utilisateur (langue, succès débloqués, etc.).

### 2. Utilisation de `IndexedDB`
- **Avantages** :
  - Permet de stocker des données volumineuses.
  - Plus rapide et structuré que `localStorage`.
- **Cas d'utilisation** :
  - Stockage des scores des mini-jeux.
  - Sauvegarde des configurations utilisateur.

## Implémentation
### Exemple avec `localStorage`
```javascript
// Sauvegarder une préférence utilisateur
localStorage.setItem('preferredLanguage', 'fr');

// Charger une préférence utilisateur
const lang = localStorage.getItem('preferredLanguage');
```

### Exemple avec `IndexedDB`
```javascript
// Ouvrir une base de données
const request = indexedDB.open('userDatabase', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore('preferences', { keyPath: 'id' });
};

request.onsuccess = function(event) {
  const db = event.target.result;
  const transaction = db.transaction('preferences', 'readwrite');
  const store = transaction.objectStore('preferences');

  // Ajouter une préférence
  store.add({ id: 'language', value: 'fr' });
};
```

## Optimisation
### Compression des données
- Utilisez des formats compressés (exemple : JSON minifié) pour réduire la taille des données.

### Nettoyage périodique
- Implémentez un mécanisme pour supprimer les données obsolètes.

## Sécurité
### Chiffrement des données
- Utilisez l'API `crypto.subtle` pour chiffrer les données sensibles avant de les stocker.

### Validation des données
- Vérifiez les données avant de les sauvegarder pour éviter les attaques XSS.

## Sécurité avancée
### Chiffrement des données avec `crypto.subtle`
- Exemple d'utilisation :
```javascript
async function encryptData(data, key) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: window.crypto.getRandomValues(new Uint8Array(12))
    },
    key,
    encodedData
  );

  return encrypted;
}

async function generateKey() {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
}

// Exemple d'utilisation
(async () => {
  const key = await generateKey();
  const encryptedData = await encryptData('Données sensibles', key);
  console.log(encryptedData);
})();
```

### Validation des données
- Ajoutez des mécanismes pour vérifier les données avant de les sauvegarder.
- Exemple :
```javascript
function validateInput(input) {
  const isValid = typeof input === 'string' && input.trim() !== '';
  if (!isValid) {
    throw new Error('Invalid input');
  }
  return input;
}

try {
  const userInput = validateInput('Exemple');
  console.log('Input validé:', userInput);
} catch (error) {
  console.error(error.message);
}
```

## Notes
La gestion de mémoire est conçue pour être extensible et réutilisable dans d'autres projets similaires.
