# Service Report Management System
# نظام إدارة تقارير الخدمة

نظام بسيط لإدارة تقارير الخدمة باستخدام Next.js و PostgreSQL

## المتطلبات / Requirements

- Node.js (الإصدار 18 أو أحدث)
- PostgreSQL (الإصدار 12 أو أحدث)
- npm أو yarn

## التثبيت / Installation

### 1. تثبيت الحزم / Install Dependencies

```bash
npm install
```

### 2. إعداد قاعدة البيانات / Database Setup

**مهم جداً:** تأكد من أن PostgreSQL يعمل على جهازك.

#### إنشاء قاعدة البيانات (إذا لم تكن موجودة):

```bash
npm run db:create
```

أو يدوياً:
```bash
psql -U postgres -c "CREATE DATABASE \"pipefy-main\";"
```

### 3. إعداد متغيرات البيئة / Environment Variables

**مهم جداً:** يجب إنشاء ملف `.env.local` في المجلد الرئيسي يدوياً:

```bash
# في Terminal، من المجلد الرئيسي للمشروع:
cat > .env.local << 'EOF'
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=pipefy-main
DB_USERNAME=postgres
DB_PASSWORD=123456
EOF
```

أو أنشئ الملف يدوياً وانسخ المحتوى التالي:

```env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=pipefy-main
DB_USERNAME=postgres
DB_PASSWORD=123456
```

**ملاحظة:** إذا كان لديك ملف `.env` بدلاً من `.env.local`، يمكنك استخدامه أيضاً.

### 4. إنشاء الجداول / Create Database Tables

قم بتشغيل أمر الترحيل لإنشاء الجداول في قاعدة البيانات:

```bash
npm run db:migrate
```

**أو استخدم الأمر الشامل الذي ينشئ قاعدة البيانات والجداول:**

```bash
npm run db:setup
```

هذا الأمر سيقوم بإنشاء جدولين:
- `service_reports`: جدول التقارير الرئيسي
- `pest_details`: جدول تفاصيل الآفات (الحقول الديناميكية)

## تشغيل النظام / Running the Application

### وضع التطوير / Development Mode

```bash
npm run dev
```

ثم افتح المتصفح على العنوان: [http://localhost:3000](http://localhost:3000)

### بناء الإنتاج / Production Build

```bash
npm run build
npm start
```

## الأوامر المتاحة / Available Commands

- `npm run dev` - تشغيل الخادم في وضع التطوير
- `npm run build` - بناء التطبيق للإنتاج
- `npm start` - تشغيل التطبيق بعد البناء
- `npm run lint` - فحص الكود
- `npm run db:create` - إنشاء قاعدة البيانات (إذا لم تكن موجودة)
- `npm run db:migrate` - إنشاء/ترحيل جداول قاعدة البيانات
- `npm run db:test` - اختبار الاتصال بقاعدة البيانات والتحقق من الجداول
- `npm run db:setup` - إنشاء قاعدة البيانات والجداول معاً (أمر شامل)

## API Endpoints

### GET /api/reports
جلب جميع التقارير مع تفاصيل الآفات

**Response:**
```json
[
  {
    "id": 1,
    "report_no": "001",
    "customer_name": "اسم العميل",
    "pest_details": [...]
  }
]
```

### POST /api/reports
إضافة تقرير جديد

**Request Body:**
```json
{
  "report_no": "001",
  "time_in": "09:00",
  "date": "2024-01-01",
  "time_out": "17:00",
  "customer_name": "اسم العميل",
  "customer_address": "العنوان",
  "job_no_contract": "123",
  "treated_areas": "مناطق المعالجة",
  "treatment_type": "Routine",
  "stock_damage": false,
  "contamination": false,
  "legal_action": false,
  "reputation": false,
  "building_damage": false,
  "safety_welfare": false,
  "disease_risks": false,
  "other_risk": false,
  "treatment_report": "تقرير المعالجة",
  "recommended_improvements": "التوصيات",
  "technician_name": "اسم الفني",
  "technician_signature": "توقيع الفني",
  "customer_signature_name": "اسم العميل",
  "customer_signature": "توقيع العميل",
  "pest_details": [
    {
      "pest_name": "ناموس",
      "level_of_activity": "M",
      "treatment_control": "رش",
      "materials_used": "مبيد",
      "quantity": 5,
      "units": "لتر"
    }
  ]
}
```

### GET /api/reports/[id]
جلب تقرير محدد

### DELETE /api/reports/[id]
حذف تقرير

## الصفحات / Pages

- `/` - الصفحة الرئيسية
- `/form` - نموذج إضافة تقرير جديد
- `/reports` - عرض جميع التقارير

## هيكل قاعدة البيانات / Database Structure

### جدول service_reports
- `id` - المعرف الرئيسي
- `report_no` - رقم التقرير
- `time_in` - وقت البداية
- `date` - التاريخ
- `time_out` - وقت النهاية
- `customer_name` - اسم العميل
- `customer_address` - عنوان العميل
- `job_no_contract` - رقم العميل/العقد
- `treated_areas` - مناطق المعالجة
- `treatment_type` - نوع المعالجة (Routine, Follow-Up, Call-Out)
- `stock_damage` - تلف المخزون
- `contamination` - تلوث
- `legal_action` - اجراءات قانونية
- `reputation` - سمعة
- `building_damage` - تلف المبنى
- `safety_welfare` - السلامة/الرعاية
- `disease_risks` - مخاطر الأمراض
- `other_risk` - أخرى
- `treatment_report` - تقرير المعالجة
- `recommended_improvements` - التوصية بالتحسينات
- `technician_name` - اسم الفني
- `technician_signature` - توقيع الفني
- `customer_signature_name` - اسم العميل للتوقيع
- `customer_signature` - توقيع العميل
- `created_at` - تاريخ الإنشاء

### جدول pest_details
- `id` - المعرف الرئيسي
- `service_report_id` - معرف التقرير (Foreign Key)
- `pest_name` - اسم الآفة
- `level_of_activity` - مستوى النشاط (P, L, M, High)
- `treatment_control` - المعالجة/التحكم
- `materials_used` - الأدوات المستخدمة
- `quantity` - العدد
- `units` - الوحدات
- `created_at` - تاريخ الإنشاء

## ملاحظات / Notes

- النظام يدعم اللغة العربية والإنجليزية
- يمكن إضافة صفوف ديناميكية لجدول الآفات
- جميع الحقول في النموذج قابلة للتعديل
- يتم حفظ التوقيعات كنص (يمكن تطويرها لاستخدام الصور لاحقاً)

## الدعم / Support

للمساعدة أو الإبلاغ عن مشاكل، يرجى التواصل مع فريق التطوير.

