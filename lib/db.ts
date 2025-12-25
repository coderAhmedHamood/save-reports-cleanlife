import { Pool } from 'pg';

// إنشاء pool جديد في كل مرة لتجنب مشاكل الاتصال
function createPool() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_DATABASE || 'pipefy-main',
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  // تسجيل الإعدادات المستخدمة (بدون كلمة المرور) للمساعدة في التشخيص - فقط في وضع التطوير
  if (process.env.NODE_ENV === 'development') {
    console.log('Database connection config:', {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password ? '***' : 'not set'
    });
  }

  return new Pool(config);
}

const pool = createPool();

// اختبار الاتصال
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;

