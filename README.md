# 📚 منظم المهام الدراسية - Progressive Web App

تطبيق ويب تقدمي (PWA) لمساعدة الطلاب في تنظيم مهامهم الدراسية وواجباتهم ومواعيد امتحاناتهم.

## ✨ المميزات

### المميزات الأساسية
- ➕ إضافة مهام دراسية جديدة
- 📝 تصنيف المهام حسب المادة والنوع
- 🎯 تحديد مستوى الأولوية لكل مهمة
- 📅 تتبع مواعيد التسليم
- ✅ تحديد المهام المكتملة
- 🗑️ حذف المهام
- 📊 عرض إحصائيات شاملة

### مميزات PWA
- 📱 يعمل كتطبيق منفصل على الهاتف
- 🔄 يعمل بدون إنترنت
- 💾 حفظ البيانات محلياً
- 🚀 تحميل سريع
- 🔔 إشعارات (قريباً)

## 🚀 التثبيت والاستخدام

### التثبيت على الهاتف
1. افتح الموقع في متصفح الهاتف
2. اضغط على "إضافة إلى الشاشة الرئيسية"
3. اتبع التعليمات لتثبيت التطبيق

### التشغيل محلياً
```bash
# 1. استنسخ المشروع
git clone https://github.com/[username]/student-task-manager-pwa.git

# 2. ادخل إلى مجلد المشروع  
cd student-task-manager-pwa

# 3. شغل خادم محلي بسيط
# باستخدام Python
python -m http.server 8000

# أو باستخدام Node.js
npx serve .

# 4. افتح المتصفح على
http://localhost:8000
```

## 📁 هيكل المشروع

```
student-task-manager-pwa/
├── index.html          # الصفحة الرئيسية
├── manifest.json       # ملف تعريف التطبيق
├── sw.js              # Service Worker
├── offline.html       # صفحة عدم الاتصال
├── icons/             # أيقونات التطبيق
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
├── screenshots/       # صور شاشة التطبيق
│   ├── desktop.png
│   └── mobile.png
└── README.md          # هذا الملف
```

## 🛠️ التقنيات المستخدمة

- **HTML5** - هيكل التطبيق
- **CSS3** - التصميم والتنسيق
- **JavaScript (ES6+)** - البرمجة والتفاعل
- **Service Worker** - العمل بدون إنترنت
- **Web App Manifest** - تحويل إلى PWA
- **LocalStorage** - حفظ البيانات محلياً

## 🔧 التطوير والتخصيص

### إضافة ميزات جديدة
1. **الإشعارات**: تفعيل Push Notifications
2. **المزامنة**: ربط مع Firebase
3. **المشاركة**: مشاركة المهام مع زملاء الدراسة
4. **التقويم**: عرض المهام في تقويم شهري
5. **الإحصائيات المتقدمة**: رسوم بيانية للإنتاجية

### ربط مع Firebase
```javascript
// إضافة Firebase SDK
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // إعدادات Firebase
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

## 📱 النشر

### GitHub Pages
```bash
# 1. ارفع المشروع إلى GitHub
git add .
git commit -m "Initial PWA setup"
git push origin main

# 2. فعل GitHub Pages من إعدادات المستودع
# Settings > Pages > Source: Deploy from branch (main)
```

### Netlify
1. ربط مستودع GitHub مع Netlify
2. النشر التلقائي عند كل تحديث

### Firebase Hosting
```bash
# 1. تثبيت Firebase CLI
npm install -g firebase-tools

# 2. تسجيل الدخول
firebase login

# 3. تهيئة المشروع
firebase init hosting

# 4. النشر
firebase deploy
```

## 🧪 الاختبار

### اختبار PWA
1. **Lighthouse**: فحص جودة PWA
2. **DevTools**: Application tab للتحقق من Service Worker
3. **Network**: اختبار العمل بدون إنترنت

### متطلبات PWA
- ✅ HTTPS (أو localhost)
- ✅ Web App Manifest
- ✅ Service Worker
- ✅ يعمل بدون إنترنت
- ✅ متجاوب مع جميع الأحجام

## 🤝 المساهمة

نرحب بالمساهمات! إليك كيفية المشاركة:

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing-feature`)
3. اعمل commit للتغييرات (`git commit -m 'Add amazing feature'`)
4. ادفع إلى البranch (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 👨‍💻 المطور

- **الاسم**: [اسمك]
- **GitHub**: [@username](https://github.com/username)
- **البريد الإلكتروني**: your.email@example.com

## 🙏 شكر وتقدير

- تم تطوير هذا التطبيق لمساعدة الطلاب في تنظيم حياتهم الدراسية
- شكر خاص لمجتمع المطورين العرب
- مساهمات ومقترحات مرحب بها

---

⭐ إذا أعجبك المشروع، لا تنس إعطاؤه نجمة!
