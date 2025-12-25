const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_DATABASE || 'pipefy-main',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
});

async function testConnection() {
  try {
    console.log('جاري اختبار الاتصال بقاعدة البيانات...');
    console.log('Database:', process.env.DB_DATABASE);
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    console.log('User:', process.env.DB_USERNAME);
    
    const result = await pool.query('SELECT NOW()');
    console.log('✅ الاتصال بنجاح! الوقت الحالي:', result.rows[0].now);
    
    // التحقق من وجود الجداول
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('service_reports', 'pest_details')
    `);
    
    console.log('\nالجداول الموجودة:');
    if (tablesCheck.rows.length === 0) {
      console.log('❌ لا توجد جداول! قم بتشغيل: npm run db:migrate');
    } else {
      tablesCheck.rows.forEach(row => {
        console.log(`✅ ${row.table_name}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error.message);
    console.error('التفاصيل:', error);
    process.exit(1);
  }
}

testConnection();

