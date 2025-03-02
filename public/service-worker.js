// public/service-worker.js
const CACHE_NAME = 'focus-xp-cache-v1';
const urlsToCache = [
  '/',                    // Página inicial
  '/index.html',          // HTML principal
  '/static/js/main.js',   // Substitua por caminhos reais após o build
  '/static/css/main.css', // Substitua por caminhos reais após o build
  '/bliss.jpg',           // Imagem de fundo
  '/favicon.ico',         // Ícone
  '/logo192.png',         // Ícone do manifest
  '/logo512.png'          // Ícone do manifest
];

// Evento de instalação: armazena os recursos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto, armazenando recursos...');
        return cache.addAll(urlsToCache);
      })
  );
  // Força o Service Worker a ativar imediatamente
  self.skipWaiting();
});

// Evento de ativação: limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Assume controle imediato das páginas
});

// Evento de fetch: serve recursos do cache quando offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se disponível, senão busca na rede
        return response || fetch(event.request).catch(() => {
          // Fallback para quando não há rede e o recurso não está em cache
          return caches.match('/index.html');
        });
      })
  );
});