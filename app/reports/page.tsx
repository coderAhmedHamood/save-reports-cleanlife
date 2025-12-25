'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PestDetail {
  id: number
  pest_name: string
  level_of_activity: string
  treatment_control: string
  materials_used: string
  quantity: number
  units: string
}

interface ServiceReport {
  id: number
  report_no: string
  time_in: string
  date: string
  time_out: string
  customer_name: string
  customer_address: string
  job_no_contract: string
  treated_areas: string
  treatment_type: string
  stock_damage: boolean
  contamination: boolean
  legal_action: boolean
  reputation: boolean
  building_damage: boolean
  safety_welfare: boolean
  disease_risks: boolean
  other_risk: boolean
  treatment_report: string
  recommended_improvements: string
  technician_name: string
  technician_signature: string
  customer_signature_name: string
  customer_signature: string
  created_at: string
  pest_details: PestDetail[]
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ServiceReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports')
      if (response.ok) {
        const text = await response.text()
        if (!text) {
          setReports([])
          return
        }
        try {
          const data = JSON.parse(text)
          setReports(Array.isArray(data) ? data : [])
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError)
          setReports([])
        }
      } else {
        const text = await response.text()
        let errorData
        try {
          errorData = text ? JSON.parse(text) : { message: 'خطأ غير معروف' }
        } catch {
          errorData = { message: text || 'خطأ غير معروف' }
        }
        console.error('Error fetching reports:', errorData)
        alert(`خطأ في جلب التقارير: ${errorData.message || 'خطأ غير معروف'}`)
      }
    } catch (error: any) {
      console.error('Error fetching reports:', error)
      alert(`حدث خطأ أثناء جلب التقارير: ${error.message || 'خطأ غير معروف'}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteReport = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقرير؟')) return

    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setReports(reports.filter(r => r.id !== id))
        alert('تم حذف التقرير بنجاح')
      }
    } catch (error) {
      console.error('Error deleting report:', error)
      alert('حدث خطأ أثناء حذف التقرير')
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '40px' }}>جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Service Reports - التقارير</h1>
        <div className="logo">
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>C</div>
          <div>
            <div style={{ fontWeight: 'bold' }}>كلين لايف</div>
            <div style={{ fontSize: '12px' }}>CleanLife</div>
          </div>
        </div>
      </div>

      <div className="nav-links">
        <Link href="/" className="nav-link">
          الرئيسية / Home
        </Link>
        <Link href="/form" className="nav-link">
          إضافة تقرير جديد / Add New Report
        </Link>
      </div>

      <div className="reports-list">
        {reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            لا توجد تقارير / No reports found
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="report-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>تقرير رقم: {report.report_no}</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href={`/form?id=${report.id}`}
                    className="btn btn-success btn-small"
                  >
                    تعديل
                  </Link>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => deleteReport(report.id)}
                  >
                    حذف
                  </button>
                </div>
              </div>

              <div className="report-info">
                <div><span>التاريخ:</span> {report.date}</div>
                <div><span>وقت البداية:</span> {report.time_in}</div>
                <div><span>وقت النهاية:</span> {report.time_out}</div>
                <div><span>اسم العميل:</span> {report.customer_name}</div>
                <div><span>العنوان:</span> {report.customer_address}</div>
                <div><span>رقم العميل/العقد:</span> {report.job_no_contract}</div>
                <div><span>نوع المعالجة:</span> {report.treatment_type}</div>
                <div><span>اسم الفني:</span> {report.technician_name}</div>
              </div>

              {report.treated_areas && (
                <div style={{ marginTop: '10px' }}>
                  <strong>مناطق المعالجة:</strong>
                  <p>{report.treated_areas}</p>
                </div>
              )}

              {report.pest_details && report.pest_details.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <strong>تفاصيل الآفات:</strong>
                  <table className="dynamic-table" style={{ marginTop: '10px' }}>
                    <thead>
                      <tr>
                        <th>الآفة</th>
                        <th>مستوى النشاط</th>
                        <th>المعالجة/التحكم</th>
                        <th>الأدوات المستخدمة</th>
                        <th>العدد</th>
                        <th>الوحدات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.pest_details.map((pest) => (
                        <tr key={pest.id}>
                          <td>{pest.pest_name}</td>
                          <td>{pest.level_of_activity}</td>
                          <td>{pest.treatment_control}</td>
                          <td>{pest.materials_used}</td>
                          <td>{pest.quantity}</td>
                          <td>{pest.units}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ marginTop: '15px' }}>
                <strong>مخاطر الآفات:</strong>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
                  {report.stock_damage && <span style={{ background: '#ffc107', padding: '5px 10px', borderRadius: '4px' }}>تلف المخزون</span>}
                  {report.contamination && <span style={{ background: '#ffc107', padding: '5px 10px', borderRadius: '4px' }}>تلوث</span>}
                  {report.legal_action && <span style={{ background: '#ffc107', padding: '5px 10px', borderRadius: '4px' }}>اجراءات قانونية</span>}
                  {report.reputation && <span style={{ background: '#ffc107', padding: '5px 10px', borderRadius: '4px' }}>سمعة</span>}
                  {report.building_damage && <span style={{ background: '#ffc107', padding: '5px 10px', borderRadius: '4px' }}>تلف المبنى</span>}
                  {report.safety_welfare && <span style={{ background: '#ffc107', padding: '5px 10px', borderRadius: '4px' }}>السلامة/الرعاية</span>}
                  {report.disease_risks && <span style={{ background: '#ffc107', padding: '5px 10px', borderRadius: '4px' }}>مخاطر الأمراض</span>}
                  {report.other_risk && <span style={{ background: '#ffc107', padding: '5px 10px', borderRadius: '4px' }}>أخرى</span>}
                </div>
              </div>

              {report.treatment_report && (
                <div style={{ marginTop: '15px' }}>
                  <strong>تقرير المعالجة:</strong>
                  <p>{report.treatment_report}</p>
                </div>
              )}

              {report.recommended_improvements && (
                <div style={{ marginTop: '15px' }}>
                  <strong>التوصية بالتحسينات:</strong>
                  <p>{report.recommended_improvements}</p>
                </div>
              )}

              <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <strong>الفني:</strong>
                  <div>الاسم: {report.technician_name}</div>
                  {report.technician_signature && <div>التوقيع: {report.technician_signature}</div>}
                </div>
                <div>
                  <strong>العميل:</strong>
                  <div>الاسم: {report.customer_signature_name}</div>
                  {report.customer_signature && <div>التوقيع: {report.customer_signature}</div>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

