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

