# تعليمات ربط المشروع بـ Git ورفعه على GitHub
# Git Setup and Push Instructions

## الخطوات / Steps:

### 1. تهيئة مستودع Git
```bash
cd /Users/ahmed/Desktop/cleanlife/reports-database
git init
```

### 2. إضافة جميع الملفات
```bash
git add .
```

### 3. عمل commit أولي
```bash
git commit -m "Initial commit: Service Report Management System with Next.js and PostgreSQL"
```

### 4. تغيير اسم الفرع إلى main
```bash
git branch -M main
```

### 5. إضافة المستودع البعيد
```bash
git remote add origin https://github.com/coderAhmedHamood/save-reports-cleanlife.git
```

### 6. رفع الكود إلى GitHub
```bash
git push -u origin main
```

## ملاحظات مهمة / Important Notes:

✅ ملف `.gitignore` موجود ويحتوي على:
- `.env.local` - لن يتم رفعه (آمن)
- `.env` - لن يتم رفعه (آمن)
- `node_modules/` - لن يتم رفعه
- `.next/` - لن يتم رفعه

⚠️ **تأكد من:**
- أن ملف `.env.local` موجود محلياً (لن يتم رفعه)
- أن جميع الملفات المهمة موجودة
- أنك متصل بالإنترنت

## إذا واجهت مشكلة في الرفع:

### إذا كان المستودع موجود بالفعل على GitHub:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### إذا أردت إعادة المحاولة:
```bash
git remote remove origin
git remote add origin https://github.com/coderAhmedHamood/save-reports-cleanlife.git
git push -u origin main
```

### للتحقق من حالة Git:
```bash
git status
git remote -v
```

