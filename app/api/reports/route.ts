import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT sr.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', pd.id,
              'pest_name', pd.pest_name,
              'level_of_activity', pd.level_of_activity,
              'treatment_control', pd.treatment_control,
              'materials_used', pd.materials_used,
              'quantity', pd.quantity,
              'units', pd.units
            )
          ) FILTER (WHERE pd.id IS NOT NULL),
          '[]'::json
        ) as pest_details
      FROM service_reports sr
      LEFT JOIN pest_details pd ON sr.id = pd.service_report_id
      GROUP BY sr.id
      ORDER BY sr.created_at DESC
    `)

    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error('Error fetching reports:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    })
    return NextResponse.json(
      { 
        message: 'خطأ في جلب التقارير', 
        error: error.message || String(error),
        details: error.detail || null
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      report_no,
      time_in,
      date,
      time_out,
      customer_name,
      customer_address,
      job_no_contract,
      treated_areas,
      treatment_type,
      stock_damage,
      contamination,
      legal_action,
      reputation,
      building_damage,
      safety_welfare,
      disease_risks,
      other_risk,
      treatment_report,
      recommended_improvements,
      technician_name,
      technician_signature,
      customer_signature_name,
      customer_signature,
      pest_details
    } = body

    // التحقق من الحقول المطلوبة
    if (!report_no || !time_in || !date || !time_out || !customer_name || !customer_address) {
      return NextResponse.json(
        { message: 'الحقول المطلوبة مفقودة', error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // إدراج التقرير الرئيسي
    const reportResult = await pool.query(`
      INSERT INTO service_reports (
        report_no, time_in, date, time_out, customer_name, customer_address,
        job_no_contract, treated_areas, treatment_type, stock_damage,
        contamination, legal_action, reputation, building_damage,
        safety_welfare, disease_risks, other_risk, treatment_report,
        recommended_improvements, technician_name, technician_signature,
        customer_signature_name, customer_signature
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING id
    `, [
      report_no || null,
      time_in || null,
      date || null,
      time_out || null,
      customer_name || null,
      customer_address || null,
      job_no_contract || null,
      treated_areas || null,
      treatment_type || 'Routine',
      stock_damage || false,
      contamination || false,
      legal_action || false,
      reputation || false,
      building_damage || false,
      safety_welfare || false,
      disease_risks || false,
      other_risk || false,
      treatment_report || null,
      recommended_improvements || null,
      technician_name || null,
      technician_signature || null,
      customer_signature_name || null,
      customer_signature || null
    ])

    const serviceReportId = reportResult.rows[0].id

    // إدراج تفاصيل الآفات
    if (pest_details && Array.isArray(pest_details) && pest_details.length > 0) {
      for (const pest of pest_details) {
        if (pest.pest_name && pest.pest_name.trim() !== '') {
          await pool.query(`
            INSERT INTO pest_details (
              service_report_id, pest_name, level_of_activity,
              treatment_control, materials_used, quantity, units
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            serviceReportId,
            pest.pest_name,
            pest.level_of_activity || null,
            pest.treatment_control || null,
            pest.materials_used || null,
            pest.quantity || 0,
            pest.units || null
          ])
        }
      }
    }

    return NextResponse.json(
      { message: 'تم إضافة التقرير بنجاح', id: serviceReportId },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating report:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint
    })
    return NextResponse.json(
      { 
        message: 'خطأ في إضافة التقرير', 
        error: error.message || String(error),
        details: error.detail || null
      },
      { status: 500 }
    )
  }
}

