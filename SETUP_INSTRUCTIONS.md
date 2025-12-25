# تعليمات الإعداد / Setup Instructions

## المشكلة الحالية:
```
database "reports-database" does not exist
```

هذا يعني أن ملف `.env.local` غير موجود أو غير صحيح.

## الحل السريع:

### الخطوة 1: إنشاء ملف `.env.local`

**في Terminal، من المجلد الرئيسي للمشروع:**

```bash
cd /Users/ahmed/Desktop/cleanlife/reports-database
cat > .env.local << 'EOF'
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=pipefy-main
DB_USERNAME=postgres
DB_PASSWORD=123456
EOF
```

**أو أنشئ الملف يدوياً:**
1. افتح محرر النصوص
2. أنشئ ملف جديد باسم `.env.local` في المجلد الرئيسي
3. انسخ والصق المحتوى التالي:

```
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=pipefy-main
DB_USERNAME=postgres
DB_PASSWORD=123456
```

4. احفظ الملف

### الخطوة 2: إنشاء قاعدة البيانات

```bash
npm run db:create
```

### الخطوة 3: إنشاء الجداول

```bash
npm run db:migrate
```

**أو استخدم الأمر الشامل:**
```bash
npm run db:setup
```

### الخطوة 4: اختبار الاتصال

```bash
npm run db:test
```

يجب أن ترى:
```
✅ الاتصال بنجاح!
✅ service_reports
✅ pest_details
```

### الخطوة 5: إعادة تشغيل الخادم

إذا كان الخادم يعمل:
1. اضغط `Ctrl+C` لإيقافه
2. شغله مرة أخرى:
```bash
npm run dev
```

## التحقق من أن كل شيء يعمل:

1. افتح المتصفح على: http://localhost:3000
2. اذهب إلى صفحة "إضافة تقرير جديد"
3. املأ النموذج
4. احفظ التقرير
5. يجب أن ترى رسالة نجاح!

## إذا استمرت المشكلة:

1. **تحقق من ملف `.env.local`:**
   ```bash
   cat .env.local
   ```
   يجب أن ترى القيم الصحيحة

2. **تحقق من أن PostgreSQL يعمل:**
   ```bash
   psql -U postgres -c "SELECT version();"
   ```

3. **تحقق من وجود قاعدة البيانات:**
   ```bash
   psql -U postgres -c "\l" | grep pipefy-main
   ```

4. **راجع ملف `TROUBLESHOOTING.md`**

