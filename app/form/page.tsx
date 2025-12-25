'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// تعريف نوع html2pdf
declare global {
  interface Window {
    html2pdf: any
  }
}

interface PestDetail {
  id?: number
  pest_name: string
  level_of_activity: string
  treatment_control: string
  materials_used: string
  quantity: number
  units: string
}

export default function FormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reportId = searchParams.get('id')
  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [pestDetails, setPestDetails] = useState<PestDetail[]>([
    { pest_name: '', level_of_activity: '', treatment_control: '', materials_used: '', quantity: 0, units: '' },
    { pest_name: '', level_of_activity: '', treatment_control: '', materials_used: '', quantity: 0, units: '' },
    { pest_name: '', level_of_activity: '', treatment_control: '', materials_used: '', quantity: 0, units: '' },
    { pest_name: '', level_of_activity: '', treatment_control: '', materials_used: '', quantity: 0, units: '' },
    { pest_name: '', level_of_activity: '', treatment_control: '', materials_used: '', quantity: 0, units: '' }
  ])

  const [formData, setFormData] = useState({
    report_no: '',
    time_in: '',
    date: '',
    time_out: '',
    customer_name: '',
    customer_address: '',
    job_no_contract: '',
    treated_areas: '',
    treatment_type: 'Routine',
    stock_damage: false,
    contamination: false,
    legal_action: false,
    reputation: false,
    building_damage: false,
    safety_welfare: false,
    disease_risks: false,
    other_risk: false,
    treatment_report: '',
    recommended_improvements: '',
    technician_name: '',
    technician_signature: '',
    customer_signature_name: '',
    customer_signature: ''
  })

  // تحميل html2pdf.js عند تحميل الصفحة
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.html2pdf) {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  // جلب البيانات عند التعديل
  useEffect(() => {
    if (reportId) {
      setIsEditMode(true)
      setLoading(true)
      fetch(`/api/reports/${reportId}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setFormData({
              report_no: data.report_no || '',
              time_in: data.time_in || '',
              date: data.date || '',
              time_out: data.time_out || '',
              customer_name: data.customer_name || '',
              customer_address: data.customer_address || '',
              job_no_contract: data.job_no_contract || '',
              treated_areas: data.treated_areas || '',
              treatment_type: data.treatment_type || 'Routine',
              stock_damage: data.stock_damage || false,
              contamination: data.contamination || false,
              legal_action: data.legal_action || false,
              reputation: data.reputation || false,
              building_damage: data.building_damage || false,
              safety_welfare: data.safety_welfare || false,
              disease_risks: data.disease_risks || false,
              other_risk: data.other_risk || false,
              treatment_report: data.treatment_report || '',
              recommended_improvements: data.recommended_improvements || '',
              technician_name: data.technician_name || '',
              technician_signature: data.technician_signature || '',
              customer_signature_name: data.customer_signature_name || '',
              customer_signature: data.customer_signature || ''
            })
            
            if (data.pest_details && data.pest_details.length > 0) {
              setPestDetails(data.pest_details.map((p: any) => ({
                id: p.id,
                pest_name: p.pest_name || '',
                level_of_activity: p.level_of_activity || '',
                treatment_control: p.treatment_control || '',
                materials_used: p.materials_used || '',
                quantity: p.quantity || 0,
                units: p.units || ''
              })))
            } else {
              // إذا لم تكن هناك بيانات، نضيف صف واحد فارغ
              setPestDetails([{ pest_name: '', level_of_activity: '', treatment_control: '', materials_used: '', quantity: 0, units: '' }])
            }
          }
        })
        .catch(error => {
          console.error('Error fetching report:', error)
          alert('حدث خطأ أثناء جلب بيانات التقرير')
        })
        .finally(() => setLoading(false))
    }
  }, [reportId])

  const addPestRow = () => {
    setPestDetails([...pestDetails, { pest_name: '', level_of_activity: '', treatment_control: '', materials_used: '', quantity: 0, units: '' }])
  }

  const removePestRow = (index: number) => {
    setPestDetails(pestDetails.filter((_, i) => i !== index))
  }

  const updatePestDetail = (index: number, field: keyof PestDetail, value: string | number) => {
    const updated = [...pestDetails]
    updated[index] = { ...updated[index], [field]: value }
    setPestDetails(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEditMode ? `/api/reports/${reportId}` : '/api/reports'
      const method = isEditMode ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pest_details: pestDetails.filter(p => p.pest_name.trim() !== '')
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        alert(isEditMode ? 'تم تحديث التقرير بنجاح! / Report updated successfully!' : 'تم إضافة التقرير بنجاح! / Report added successfully!')
        router.push('/reports')
      } else {
        console.error('Error response:', data)
        alert(`خطأ: ${data.message || data.error || (isEditMode ? 'فشل في تحديث التقرير' : 'فشل في إضافة التقرير')}\n${data.details ? `التفاصيل: ${data.details}` : ''}`)
      }
    } catch (error: any) {
      console.error('Error:', error)
      alert(`حدث خطأ أثناء ${isEditMode ? 'تحديث' : 'إضافة'} التقرير: ${error.message || 'خطأ غير معروف'}`)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = () => {
    if (!formRef.current) return

    // التحقق من تحميل المكتبة
    const checkAndDownload = () => {
      if (window.html2pdf) {
        const formElement = formRef.current
        if (formElement) {
          // الحصول على container الذي يحتوي على border
          const container = formElement.closest('.container')
          if (!container) return

          // إخفاء الأزرار قبل التصدير (الأزرار الآن خارج الـ container)
          const actionsDiv = container.querySelector('.actions')
          let actionsDisplay = ''
          if (actionsDiv) {
            actionsDisplay = (actionsDiv as HTMLElement).style.display
            ;(actionsDiv as HTMLElement).style.display = 'none'
          }

          // الانتظار قليلاً لضمان تحميل جميع العناصر
          setTimeout(() => {
            // التأكد من أن جميع العناصر مرئية
            const allElements = container.querySelectorAll('*')
            allElements.forEach((el: any) => {
              if (el.style && !el.classList.contains('actions')) {
                el.style.visibility = 'visible'
                el.style.opacity = '1'
              }
            })

            // الانتظار حتى يتم تحميل جميع الصور والخطوط
            window.scrollTo(0, 0)
            
            // الحصول على الأبعاد الصحيحة للـ container
            setTimeout(() => {
              const rect = (container as HTMLElement).getBoundingClientRect()
              const fullHeight = Math.max(
                (container as HTMLElement).scrollHeight,
                (container as HTMLElement).offsetHeight,
                rect.height
              )
              const fullWidth = Math.max(
                (container as HTMLElement).scrollWidth,
                (container as HTMLElement).offsetWidth,
                rect.width,
                1200
              )

              const opt = {
                margin: [0.1, 0.1, 0.1, 0.1],
                filename: `report-${formData.report_no || reportId || 'new'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                  scale: 2,
                  useCORS: true,
                  logging: false,
                  letterRendering: true,
                  allowTaint: false,
                  backgroundColor: '#ffffff',
                  width: fullWidth,
                  height: fullHeight,
                  windowWidth: fullWidth,
                  windowHeight: fullHeight,
                  scrollX: 0,
                  scrollY: 0,
                  x: 0,
                  y: 0,
                  removeContainer: false,
                  onclone: (clonedDoc: any) => {
                    // إخفاء الأزرار في النسخة المستنسخة
                    const clonedActions = clonedDoc.querySelector('.actions')
                    if (clonedActions) {
                      (clonedActions as HTMLElement).style.display = 'none'
                    }
                    
                    // التأكد من أن جميع العناصر مرئية في النسخة المستنسخة
                    const clonedElements = clonedDoc.querySelectorAll('*')
                    clonedElements.forEach((el: any) => {
                      if (el.style && !el.classList.contains('actions')) {
                        el.style.visibility = 'visible'
                        el.style.opacity = '1'
                        el.style.display = ''
                      }
                    })
                  }
                },
                jsPDF: { 
                  unit: 'in', 
                  format: 'a4', 
                  orientation: 'portrait',
                  compress: true
                },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
              }
              
              window.html2pdf()
                .set(opt)
                .from(container as HTMLElement)
                .save()
                .then(() => {
                  // إظهار الأزرار مرة أخرى
                  if (actionsDiv) {
                    ;(actionsDiv as HTMLElement).style.display = actionsDisplay || ''
                  }
                })
                .catch((error: any) => {
                  console.error('Error generating PDF:', error)
                  // إظهار الأزرار مرة أخرى حتى في حالة الخطأ
                  if (actionsDiv) {
                    ;(actionsDiv as HTMLElement).style.display = actionsDisplay || ''
                  }
                  alert('حدث خطأ أثناء إنشاء PDF. يرجى المحاولة مرة أخرى.')
                })
            }, 300)
          }, 500)
        }
      } else {
        // إذا لم تكن المكتبة محملة، ننتظر قليلاً ثم نحاول مرة أخرى
        setTimeout(checkAndDownload, 100)
      }
    }

    checkAndDownload()
  }

  return (
    <>
      <div className="container" style={{ position: 'relative' }}>
        <div className="report-header">
          <div className="report-title-section">
          <h1 className="report-title">Service Report</h1>
          <div className="report-title-arabic">تقرير خدمة</div>
        </div>
        <div className="logo-section">
          <div className="logo-circle">
            <span className="logo-letter">C</span>
          </div>
          <div className="logo-text-section">
            <div className="logo-text-arabic">كلين لايف</div>
            <div className="logo-text-english">CleanLife</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} ref={formRef}>
        {/* Header Fields - في صفين و عمودين */}
        <div className="header-fields-section">
          <div className="header-fields-grid">
            <div className="header-field">
              <label>رقم No</label>
              <input
                type="text"
                value={formData.report_no}
                onChange={(e) => setFormData({ ...formData, report_no: e.target.value })}
                required
                className="header-input"
              />
            </div>
            <div className="header-field">
              <label>وقت البداية Time in</label>
              <input
                type="time"
                value={formData.time_in}
                onChange={(e) => setFormData({ ...formData, time_in: e.target.value })}
                required
                className="header-input"
              />
            </div>
            <div className="header-field">
              <label>التاريخ Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="header-input"
              />
            </div>
            <div className="header-field">
              <label>وقت النهاية Time out</label>
              <input
                type="time"
                value={formData.time_out}
                onChange={(e) => setFormData({ ...formData, time_out: e.target.value })}
                required
                className="header-input"
              />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="form-section">
          <div className="section-title">Customer's Information - معلومات العميل</div>
          <div className="customer-info-grid">
            <div className="customer-details-column">
              <div className="form-field-line">
                <label>Name الاسم:</label>
                <div className="input-line">
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-field-line">
                <label>Address العنوان:</label>
                <div className="input-line">
                  <input
                    type="text"
                    value={formData.customer_address}
                    onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-field-line">
                <label>Job No / Contract رقم العميل / العقد:</label>
                <div className="input-line">
                  <input
                    type="text"
                    value={formData.job_no_contract}
                    onChange={(e) => setFormData({ ...formData, job_no_contract: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-field-line">
                <label>Treated Areas مناطق المعالجة:</label>
                <div className="input-line">
                  <textarea
                    value={formData.treated_areas}
                    onChange={(e) => setFormData({ ...formData, treated_areas: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="treatment-type-column">
              <div className="treatment-type-header">
                <span className="diamond-icon">◆</span>
                <span>Treatment Type نوع المعالجة</span>
              </div>
              <div className="treatment-options">
                <div className="treatment-option">
                  <input
                    type="radio"
                    name="treatment_type"
                    value="Routine"
                    checked={formData.treatment_type === 'Routine'}
                    onChange={(e) => setFormData({ ...formData, treatment_type: e.target.value })}
                  />
                  <label>Routine دوري</label>
                </div>
                <div className="treatment-option">
                  <input
                    type="radio"
                    name="treatment_type"
                    value="Follow-Up"
                    checked={formData.treatment_type === 'Follow-Up'}
                    onChange={(e) => setFormData({ ...formData, treatment_type: e.target.value })}
                  />
                  <label>Follow-Up مراجعة</label>
                </div>
                <div className="treatment-option">
                  <input
                    type="radio"
                    name="treatment_type"
                    value="Call-Out"
                    checked={formData.treatment_type === 'Call-Out'}
                    onChange={(e) => setFormData({ ...formData, treatment_type: e.target.value })}
                  />
                  <label>Call-Out مكالمة صادرة</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pest Details Table */}
        <div className="form-section">
          <div style={{ padding: '0' }}>
            <table className="dynamic-table">
              <thead>
                <tr>
                  <th colSpan={6} className="table-main-title">
                    Customer's Information - معلومات العميل
                  </th>
                </tr>
                <tr>
                  <th>الآفات Pests</th>
                  <th>
                    <span className="diamond-icon">◆</span>
                    Level of Activity مستوى النشاط
                  </th>
                  <th>المعالجة/التحكم Treatment/Control</th>
                  <th>الأدوات التي تم استخدامها Materials Used</th>
                  <th>العدد Qty</th>
                  <th>الوحدات Units</th>
                </tr>
              </thead>
              <tbody>
                {pestDetails.map((pest, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={pest.pest_name}
                        onChange={(e) => updatePestDetail(index, 'pest_name', e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        value={pest.level_of_activity}
                        onChange={(e) => updatePestDetail(index, 'level_of_activity', e.target.value)}
                      >
                        <option value="">اختر</option>
                        <option value="P">P</option>
                        <option value="L">L</option>
                        <option value="M">M</option>
                        <option value="High">High</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={pest.treatment_control}
                        onChange={(e) => updatePestDetail(index, 'treatment_control', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={pest.materials_used}
                        onChange={(e) => updatePestDetail(index, 'materials_used', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={pest.quantity}
                        onChange={(e) => updatePestDetail(index, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={pest.units}
                        onChange={(e) => updatePestDetail(index, 'units', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', padding: '0 20px 20px 20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addPestRow}
              >
                إضافة صف جديد
              </button>
              {pestDetails.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-small"
                  onClick={() => removePestRow(pestDetails.length - 1)}
                >
                  حذف آخر صف
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Level of Activity */}
        <div className="form-section">
          <div className="section-title">Level of Activity - مستوى النشاط</div>
          <div style={{ padding: '20px' }}>
            <div className="radio-group" style={{ flexDirection: 'row', gap: '20px', flexWrap: 'wrap' }}>
              <div className="radio-option">
                <input
                  type="radio"
                  name="level_activity"
                  value="P"
                  readOnly
                />
                <label>P = Preventative - الوقاية</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  name="level_activity"
                  value="L"
                  readOnly
                />
                <label>L = Low - منخفض</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  name="level_activity"
                  value="M"
                  readOnly
                />
                <label>M = Medium - متوسط</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  name="level_activity"
                  value="High"
                  readOnly
                />
                <label>High - عالي</label>
              </div>
            </div>
          </div>
        </div>

        {/* Pest Risks */}
        <div className="form-section">
          <div className="section-title">Pest Risks Found - مخاطر الآفات التي تم اكتشافها</div>
          <div style={{ padding: '20px' }}>
            <div className="checkbox-group" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.stock_damage}
                  onChange={(e) => setFormData({ ...formData, stock_damage: e.target.checked })}
                />
                <label>Stock Damage - تلف المخزون</label>
              </div>
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.contamination}
                  onChange={(e) => setFormData({ ...formData, contamination: e.target.checked })}
                />
                <label>Contamination - تلوث</label>
              </div>
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.legal_action}
                  onChange={(e) => setFormData({ ...formData, legal_action: e.target.checked })}
                />
                <label>Legal Action - اجراءات قانونية</label>
              </div>
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.reputation}
                  onChange={(e) => setFormData({ ...formData, reputation: e.target.checked })}
                />
                <label>Reputation - سمعة</label>
              </div>
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.building_damage}
                  onChange={(e) => setFormData({ ...formData, building_damage: e.target.checked })}
                />
                <label>Building Damage - تلف المبنى</label>
              </div>
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.safety_welfare}
                  onChange={(e) => setFormData({ ...formData, safety_welfare: e.target.checked })}
                />
                <label>Safety/Welfare - السلامة / الرعاية</label>
              </div>
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.disease_risks}
                  onChange={(e) => setFormData({ ...formData, disease_risks: e.target.checked })}
                />
                <label>Disease Risks - مخاطر الأمراض</label>
              </div>
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.other_risk}
                  onChange={(e) => setFormData({ ...formData, other_risk: e.target.checked })}
                />
                <label>Other - أخرى</label>
              </div>
            </div>
          </div>
        </div>

        {/* Treatment Report */}
        <div className="form-section">
          <div className="section-title">Treatment Report - تقرير المعالجة</div>
          <div style={{ padding: '20px' }}>
            <div className="form-group">
              <textarea
                value={formData.treatment_report}
                onChange={(e) => setFormData({ ...formData, treatment_report: e.target.value })}
                rows={6}
                style={{ width: '100%', minHeight: '120px' }}
              />
            </div>
          </div>
        </div>

        {/* Recommended Improvements */}
        <div className="form-section">
          <div className="section-title">Recommended Improvements - التوصية بالتحسينات</div>
          <div style={{ padding: '20px' }}>
            <div className="form-group">
              <textarea
                value={formData.recommended_improvements}
                onChange={(e) => setFormData({ ...formData, recommended_improvements: e.target.value })}
                rows={6}
                style={{ width: '100%', minHeight: '120px' }}
              />
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="form-section">
          <div className="signature-section" style={{ padding: '20px' }}>
            <div className="signature-box">
              <h3>Technician - الفني</h3>
              <div className="form-group">
                <label>الاسم Name</label>
                <input
                  type="text"
                  value={formData.technician_name}
                  onChange={(e) => setFormData({ ...formData, technician_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>التوقيع Signature</label>
                <input
                  type="text"
                  value={formData.technician_signature}
                  onChange={(e) => setFormData({ ...formData, technician_signature: e.target.value })}
                  style={{ borderBottom: '1px solid #ccc', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, padding: '5px 0' }}
                />
              </div>
              <div style={{ marginTop: '10px', color: '#666' }}>Tel: 920004107</div>
            </div>
            <div className="signature-box">
              <h3>Customer - العميل</h3>
              <div className="form-group">
                <label>الاسم Name</label>
                <input
                  type="text"
                  value={formData.customer_signature_name}
                  onChange={(e) => setFormData({ ...formData, customer_signature_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>التوقيع Signature</label>
                <input
                  type="text"
                  value={formData.customer_signature}
                  onChange={(e) => setFormData({ ...formData, customer_signature: e.target.value })}
                  style={{ borderBottom: '1px solid #ccc', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, padding: '5px 0' }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      </div>
      
      <div className="actions" style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button 
          type="button" 
          className="btn btn-primary" 
          disabled={loading}
          onClick={() => {
            const form = formRef.current
            if (form) {
              form.requestSubmit()
            }
          }}
        >
          {loading ? (isEditMode ? 'جاري التحديث...' : 'جاري الحفظ...') : (isEditMode ? 'تحديث التقرير' : 'حفظ التقرير')}
        </button>
        {isEditMode && (
          <button
            type="button"
            className="btn btn-success"
            onClick={downloadPDF}
          >
            تحميل PDF
          </button>
        )}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.push('/reports')}
        >
          إلغاء
        </button>
      </div>
    </>
  )
}

