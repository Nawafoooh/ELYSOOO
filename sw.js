const CACHE_NAME = 'student-tasks-v1.0';
const OFFLINE_URL = '/offline.html';

// الملفات المطلوب تخزينها مؤقتاً
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  OFFLINE_URL
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Cached files successfully');
        return self.skipWaiting();
      })
      .catch(err => {
        console.log('Service Worker: Error caching files', err);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// استراتيجية التخزين المؤقت
self.addEventListener('fetch', event => {
  // تجاهل الطلبات غير HTTP/HTTPS
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إرجاع من التخزين المؤقت إذا وُجد
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }

        // محاولة الحصول من الشبكة
        return fetch(event.request)
          .then(response => {
            // التحقق من صحة الاستجابة
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // نسخ الاستجابة للتخزين المؤقت
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // في حالة عدم توفر الاتصال، عرض صفحة بديلة
            if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// معالجة رسائل من التطبيق الرئيسي
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// إشعارات push (للمستقبل)
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'لديك مهمة جديدة!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'فتح التطبيق',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'إغلاق'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('منظم المهام الدراسية', options)
  );
});

// معالجة النقر على الإشعارات
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
