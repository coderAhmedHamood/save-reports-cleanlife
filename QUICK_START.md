# دليل البدء السريع / Quick Start Guide

## خطوات التشغيل السريعة:

### 1. تثبيت الحزم
```bash
npm install
```

### 2. إعداد قاعدة البيانات
تأكد من أن PostgreSQL يعمل وأن لديك قاعدة بيانات باسم `pipefy-main`

### 3. إنشاء ملف `.env.local`
**مهم جداً:** أنشئ ملف `.env.local` في المجلد الرئيسي يدوياً:

**في Terminal:**
```bash
cat > .env.local << 'EOF'
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=pipefy-main
DB_USERNAME=postgres
DB_PASSWORD=123456
EOF
```

**أو أنشئ الملف يدوياً** وانسخ المحتوى التالي:
```env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=pipefy-main
DB_USERNAME=postgres
DB_PASSWORD=123456
```

### 4. إنشاء قاعدة البيانات والجداول
```bash
npm run db:setup
```

هذا الأمر سينشئ قاعدة البيانات والجداول معاً.

**أو خطوة بخطوة:**
```bash
npm run db:create    # إنشاء قاعدة البيانات
npm run db:migrate   # إنشاء الجداول
```

### 5. اختبار الاتصال (اختياري)
```bash
npm run db:test
```

### 6. تشغيل التطبيق
```bash
npm run dev
```

### 7. فتح المتصفح
افتح: http://localhost:3000

## إذا واجهت مشكلة:

1. **تحقق من أن PostgreSQL يعمل**
2. **تحقق من ملف `.env.local`**
3. **شغل `npm run db:migrate` مرة أخرى**
4. **راجع ملف `TROUBLESHOOTING.md`**

## الأوامر المهمة:

- `npm run dev` - تشغيل التطبيق
- `npm run db:migrate` - إنشاء الجداول
- `npm run db:test` - اختبار الاتصال

