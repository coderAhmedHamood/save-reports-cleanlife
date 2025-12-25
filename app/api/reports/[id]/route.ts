import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // حذف تفاصيل الآفات أولاً (بسبب CASCADE سيتم حذفها تلقائياً)
    await pool.query('DELETE FROM pest_details WHERE service_report_id = $1', [id])

    // حذف التقرير
    const result = await pool.query('DELETE FROM service_reports WHERE id = $1', [id])

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: 'التقرير غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'تم حذف التقرير بنجاح' })
  } catch (error: any) {
    console.error('Error deleting report:', error)
    return NextResponse.json(
      { 
        message: 'خطأ في حذف التقرير', 
        error: error.message || String(error),
        details: error.detail || null
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

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
      WHERE sr.id = $1
      GROUP BY sr.id
    `, [id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'التقرير غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { 
        message: 'خطأ في جلب التقرير', 
        error: error.message || String(error),
        details: error.detail || null
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()

    // تحديث التقرير الرئيسي
    const updateQuery = `
      UPDATE service_reports SET
        report_no = $1,
        time_in = $2,
        date = $3,
        time_out = $4,
        customer_name = $5,
        customer_address = $6,
        job_no_contract = $7,
        treated_areas = $8,
        treatment_type = $9,
        stock_damage = $10,
        contamination = $11,
        legal_action = $12,
        reputation = $13,
        building_damage = $14,
        safety_welfare = $15,
        disease_risks = $16,
        other_risk = $17,
        treatment_report = $18,
        recommended_improvements = $19,
        technician_name = $20,
        technician_signature = $21,
        customer_signature_name = $22,
        customer_signature = $23
      WHERE id = $24
      RETURNING *
    `

    const result = await pool.query(updateQuery, [
      body.report_no,
      body.time_in,
      body.date,
      body.time_out,
      body.customer_name,
      body.customer_address,
      body.job_no_contract,
      body.treated_areas,
      body.treatment_type,
      body.stock_damage || false,
      body.contamination || false,
      body.legal_action || false,
      body.reputation || false,
      body.building_damage || false,
      body.safety_welfare || false,
      body.disease_risks || false,
      body.other_risk || false,
      body.treatment_report,
      body.recommended_improvements,
      body.technician_name,
      body.technician_signature,
      body.customer_signature_name,
      body.customer_signature,
      id
    ])

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: 'التقرير غير موجود' },
        { status: 404 }
      )
    }

    // حذف تفاصيل الآفات القديمة
    await pool.query('DELETE FROM pest_details WHERE service_report_id = $1', [id])

    // إضافة تفاصيل الآفات الجديدة
    if (body.pest_details && body.pest_details.length > 0) {
      const pestDetails = body.pest_details.filter((p: any) => p.pest_name && p.pest_name.trim() !== '')
      
      if (pestDetails.length > 0) {
        const insertPestQuery = `
          INSERT INTO pest_details (service_report_id, pest_name, level_of_activity, treatment_control, materials_used, quantity, units)
          VALUES ${pestDetails.map((_: any, i: number) => 
            `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`
          ).join(', ')}
        `
        
        const pestValues = pestDetails.flatMap((p: any) => [
          id,
          p.pest_name,
          p.level_of_activity || null,
          p.treatment_control || null,
          p.materials_used || null,
          p.quantity || 0,
          p.units || null
        ])
        
        await pool.query(insertPestQuery, pestValues)
      }
    }

    return NextResponse.json({ 
      message: 'تم تحديث التقرير بنجاح',
      data: result.rows[0]
    })
  } catch (error: any) {
    console.error('Error updating report:', error)
    return NextResponse.json(
      { 
        message: 'خطأ في تحديث التقرير', 
        error: error.message || String(error),
        details: error.detail || null
      },
      { status: 500 }
    )
  }
}

