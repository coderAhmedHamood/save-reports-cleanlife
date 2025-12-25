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

async function migrate() {
  try {
    console.log('بدء ترحيل الجداول...');

    // إنشاء جدول Service Reports
    await pool.query(`
      CREATE TABLE IF NOT EXISTS service_reports (
        id SERIAL PRIMARY KEY,
        report_no VARCHAR(50),
        time_in VARCHAR(50),
        date VARCHAR(50),
        time_out VARCHAR(50),
        customer_name VARCHAR(255),
        customer_address TEXT,
        job_no_contract VARCHAR(255),
        treated_areas TEXT,
        treatment_type VARCHAR(50) CHECK (treatment_type IN ('Routine', 'Follow-Up', 'Call-Out')),
        stock_damage BOOLEAN DEFAULT FALSE,
        contamination BOOLEAN DEFAULT FALSE,
        legal_action BOOLEAN DEFAULT FALSE,
        reputation BOOLEAN DEFAULT FALSE,
        building_damage BOOLEAN DEFAULT FALSE,
        safety_welfare BOOLEAN DEFAULT FALSE,
        disease_risks BOOLEAN DEFAULT FALSE,
        other_risk BOOLEAN DEFAULT FALSE,
        treatment_report TEXT,
        recommended_improvements TEXT,
        technician_name VARCHAR(255),
        technician_signature TEXT,
        customer_signature_name VARCHAR(255),
        customer_signature TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // إنشاء جدول Pest Details (الحقول الديناميكية)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pest_details (
        id SERIAL PRIMARY KEY,
        service_report_id INTEGER REFERENCES service_reports(id) ON DELETE CASCADE,
        pest_name VARCHAR(255),
        level_of_activity VARCHAR(50) CHECK (level_of_activity IN ('P', 'L', 'M', 'High')),
        treatment_control TEXT,
        materials_used TEXT,
        quantity INTEGER,
        units VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ تم إنشاء الجداول بنجاح!');
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في ترحيل الجداول:', error);
    process.exit(1);
  }
}

migrate();

