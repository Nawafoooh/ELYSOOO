// PWA Functionality

// تسجيل Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registered successfully');
                
                // التحقق من وجود تحديثات
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        }
                    });
                });
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// متغير لحفظ prompt التثبيت
let deferredPrompt;

// معالجة تثبيت PWA
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

// عرض زر التثبيت
function showInstallButton() {
    const installBtn = document.createElement('button');
    installBtn.textContent = '📱 تثبيت التطبيق';
    installBtn.className = 'btn install-btn';
    
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;
            
            if (result.outcome === 'accepted') {
                showInstallSuccess();
            }
            
            deferredPrompt = null;
            installBtn.remove();
        }
    });
    
    document.body.appendChild(installBtn);
    
    // إخفاء الزر بعد 10 ثوان
    setTimeout(() => {
        if (installBtn.parentNode) {
            installBtn.remove();
        }
    }, 10000);
}

// معالجة ما بعد التثبيت
window.addEventListener('appinstalled', () => {
    showInstallSuccess();
    deferredPrompt = null;
});

// عرض رسالة نجاح التثبيت
function showInstallSuccess() {
    if (typeof showNotification === 'function') {
        showNotification('مرحباً! تم تثبيت التطبيق بنجاح 🎉');
    }
}

// عرض إشعار التحديث
function showUpdateNotification() {
    if (confirm('تحديث جديد متاح! هل تريد إعادة تحميل التطبيق؟')) {
        window.location.reload();
    }
}

// معالجة حالة الاتصال
window.addEventListener('online', () => {
    console.log('App is online');
    if (typeof showNotification === 'function') {
        showNotification('تم استعادة الاتصال بالإنترنت 🌐');
    }
});

window.addEventListener('offline', () => {
    console.log('App is offline');
    if (typeof showNotification === 'function') {
        showNotification('التطبيق يعمل بدون إنترنت 📴');
    }
});

// دالة للتحقق من إمكانية التثبيت
function checkInstallability() {
    // التحقق من معايير PWA
    const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasManifest = document.querySelector('link[rel="manifest"]');
    
    return isHTTPS && hasServiceWorker && hasManifest;
}

// إدارة التخزين المؤقت للبيانات
class CacheManager {
    static CACHE_KEY = 'pwa-app-data';
    
    static saveData(key, data) {
        try {
            const cacheData = this.getAllData();
            cacheData[key] = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error saving data to cache:', error);
        }
    }
    
    static getData(key, maxAge = 24 * 60 * 60 * 1000) { // Default: 24 hours
        try {
            const cacheData = this.getAllData();
            const item = cacheData[key];
            
            if (!item) return null;
            
            const isExpired = Date.now() - item.timestamp > maxAge;
            if (isExpired) {
                delete cacheData[key];
                localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
                return null;
            }
            
            return item.data;
        } catch (error) {
            console.error('Error getting data from cache:', error);
            return null;
        }
    }
    
    static getAllData() {
        try {
            return JSON.parse(localStorage.getItem(this.CACHE_KEY) || '{}');
        } catch (error) {
            return {};
        }
    }
    
    static clearCache() {
        localStorage.removeItem(this.CACHE_KEY);
    }
}

// معالجة الإشعارات (للمستقبل)
class NotificationManager {
    static async requestPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }
        
        if (Notification.permission === 'granted') {
            return true;
        }
        
        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        
        return false;
    }
    
    static async showNotification(title, options = {}) {
        const hasPermission = await this.requestPermission();
        
        if (hasPermission) {
            const defaultOptions = {
                icon: 'icons/icon-192x192.png',
                badge: 'icons/icon-72x72.png',
                vibrate: [100, 50, 100],
                data: {
                    timestamp: Date.now()
                }
            };
            
            new Notification(title, { ...defaultOptions, ...options });
        }
    }
    
    static scheduleTaskReminder(task) {
        // جدولة تذكير للمهمة (يمكن تطويرها لاحقاً)
        const taskDate = new Date(task.date);
        const reminderTime = taskDate.getTime() - Date.now() - (24 * 60 * 60 * 1000); // قبل يوم
        
        if (reminderTime > 0) {
            setTimeout(() => {
                this.showNotification('تذكير مهمة', {
                    body: `تذكير: ${task.title} - موعد التسليم غداً`,
                    tag: `task-${task.id}`
                });
            }, reminderTime);
        }
    }
}

// فحص حالة التطبيق
function checkAppHealth() {
    const health = {
        isOnline: navigator.onLine,
        hasServiceWorker: 'serviceWorker' in navigator,
        serviceWorkerActive: false,
        localStorageAvailable: false,
        installable: checkInstallability()
    };
    
    // التحقق من Service Worker
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        health.serviceWorkerActive = true;
    }
    
    // التحقق من localStorage
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        health.localStorageAvailable = true;
    } catch (e) {
        health.localStorageAvailable = false;
    }
    
    return health;
}

// تهيئة PWA
function initPWA() {
    const health = checkAppHealth();
    console.log('PWA Health Check:', health);
    
    // إظهار حالة التطبيق للمطور
    if (window.location.hostname === 'localhost') {
        console.table(health);
    }
    
    // تسجيل أحداث دورة حياة التطبيق
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('App went to background');
        } else {
            console.log('App came to foreground');
            // يمكن إضافة منطق لتحديث البيانات
        }
    });
}

// تشغيل تهيئة PWA عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initPWA);

// تصدير الدوال للاستخدام الخارجي
window.PWA = {
    CacheManager,
    NotificationManager,
    checkAppHealth,
    checkInstallability
};
