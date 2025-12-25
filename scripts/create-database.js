const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

// الاتصال بقاعدة البيانات الافتراضية لإنشاء قاعدة البيانات الجديدة
const adminPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: 'postgres', // الاتصال بقاعدة البيانات الافتراضية
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
});

const dbName = process.env.DB_DATABASE || 'pipefy-main';

async function createDatabase() {
  try {
    console.log(`جاري إنشاء قاعدة البيانات "${dbName}"...`);
    
    // التحقق من وجود قاعدة البيانات
    const checkResult = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );
    
    if (checkResult.rows.length > 0) {
      console.log(`✅ قاعدة البيانات "${dbName}" موجودة بالفعل!`);
      process.exit(0);
    }
    
    // إنشاء قاعدة البيانات
    await adminPool.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✅ تم إنشاء قاعدة البيانات "${dbName}" بنجاح!`);
    
    await adminPool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في إنشاء قاعدة البيانات:', error.message);
    console.error('التفاصيل:', error);
    process.exit(1);
  }
}

createDatabase();

