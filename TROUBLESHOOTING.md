# حل المشاكل / Troubleshooting Guide

## مشكلة: خطأ 500 عند إضافة تقرير

### الحلول المحتملة:

1. **تأكد من أن قاعدة البيانات تعمل:**
   ```bash
   # تحقق من أن PostgreSQL يعمل
   psql -U postgres -d pipefy-main
   ```

2. **تأكد من وجود الجداول:**
   ```bash
   npm run db:migrate
   ```

3. **اختبر الاتصال:**
   ```bash
   npm run db:test
   ```

4. **تحقق من ملف `.env.local`:**
   - تأكد من وجود الملف في المجلد الرئيسي
   - تأكد من أن جميع القيم صحيحة
   - تأكد من عدم وجود مسافات إضافية

5. **تحقق من السجلات (Logs):**
   - افتح Console في المتصفح (F12)
   - تحقق من Terminal حيث يعمل `npm run dev`
   - ابحث عن رسائل الخطأ

## مشكلة: لا يمكن الاتصال بقاعدة البيانات

### الحلول:

1. **تحقق من إعدادات PostgreSQL:**
   - تأكد من أن PostgreSQL يعمل
   - تحقق من أن المنفذ 5432 مفتوح
   - تحقق من اسم قاعدة البيانات والمستخدم

2. **جرب الاتصال يدوياً:**
   ```bash
   psql -h localhost -p 5432 -U postgres -d pipefy-main
   ```

3. **تحقق من ملف `.env.local`:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=pipefy-main
   DB_USERNAME=postgres
   DB_PASSWORD=123456
   ```

## مشكلة: الجداول غير موجودة

### الحل:

```bash
npm run db:migrate
```

إذا فشل الأمر، تأكد من:
- أن قاعدة البيانات موجودة
- أن المستخدم لديه صلاحيات CREATE TABLE
- أن الاتصال يعمل بشكل صحيح

## مشكلة: خطأ في عرض التقارير

### الحلول:

1. **تحقق من أن الجداول موجودة:**
   ```bash
   npm run db:test
   ```

2. **تحقق من البيانات:**
   ```sql
   SELECT * FROM service_reports;
   SELECT * FROM pest_details;
   ```

3. **أعد تشغيل الخادم:**
   ```bash
   # اضغط Ctrl+C لإيقاف الخادم
   npm run dev
   ```

## مشكلة: البيانات لا تظهر بعد الإضافة

### الحلول:

1. **تأكد من أن العملية نجحت:**
   - تحقق من رسالة النجاح في المتصفح
   - تحقق من Console للأخطاء

2. **تحقق من قاعدة البيانات مباشرة:**
   ```sql
   SELECT * FROM service_reports ORDER BY created_at DESC;
   ```

3. **أعد تحميل صفحة التقارير**

## نصائح عامة:

- دائماً تحقق من Console في المتصفح (F12)
- تحقق من Terminal حيث يعمل `npm run dev`
- استخدم `npm run db:test` للتحقق من الاتصال
- تأكد من أن جميع الحزم مثبتة: `npm install`

