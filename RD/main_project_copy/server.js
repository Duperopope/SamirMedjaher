// Serveur HTTP simple pour servir indexRD.html
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

// MIME types pour les différents fichiers
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // Servir indexRD.html par défaut
    let filePath = req.url === '/' ? './indexRD.html' : `.${req.url}`;
    const extname = path.extname(filePath);
    
    // Définir le type de contenu
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Fichier non trouvé - servir indexRD.html par défaut
                fs.readFile('./indexRD.html', (err, content) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Erreur serveur');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end('Erreur serveur');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
});

server.listen(port, 'localhost', () => {
    console.log('🚀 Serveur démarré sur http://localhost:3000');
    console.log('📁 Serveur le fichier: indexRD.html');
    console.log('🌐 Ouvrez: http://localhost:3000 dans votre navigateur');
    console.log('⚡ Arrêtez avec Ctrl+C');
});
