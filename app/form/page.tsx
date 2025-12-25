'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PestDetail {
  pest_name: string
  level_of_activity: string
  treatment_control: string
  materials_used: string
  quantity: number
  units: string
}

export default function FormPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pestDetails, setPestDetails] = useState<PestDetail[]>([
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
      const response = await fetch('/api/reports', {
        method: 'POST',
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
        alert('تم إضافة التقرير بنجاح! / Report added successfully!')
        router.push('/reports')
      } else {
        console.error('Error response:', data)
        alert(`خطأ: ${data.message || data.error || 'فشل في إضافة التقرير'}\n${data.details ? `التفاصيل: ${data.details}` : ''}`)
      }
    } catch (error: any) {
      console.error('Error:', error)
      alert(`حدث خطأ أثناء إضافة التقرير: ${error.message || 'خطأ غير معروف'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Service Report - تقرير خدمة</h1>
        <div className="logo">
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>C</div>
          <div>
            <div style={{ fontWeight: 'bold' }}>كلين لايف</div>
            <div style={{ fontSize: '12px' }}>CleanLife</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Header Fields */}
        <div className="form-section">
          <div className="form-grid">
            <div className="form-group">
              <label>رقم No</label>
              <input
                type="text"
                value={formData.report_no}
                onChange={(e) => setFormData({ ...formData, report_no: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>وقت البداية Time in</label>
              <input
                type="time"
                value={formData.time_in}
                onChange={(e) => setFormData({ ...formData, time_in: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>التاريخ Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>وقت النهاية Time out</label>
              <input
                type="time"
                value={formData.time_out}
                onChange={(e) => setFormData({ ...formData, time_out: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="form-section">
          <div className="section-title">Customer's Information - معلومات العميل</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <div className="form-group">
                <label>الاسم Name</label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>العنوان Address</label>
                <input
                  type="text"
                  value={formData.customer_address}
                  onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>رقم العميل / العقد Job No / Contract</label>
                <input
                  type="text"
                  value={formData.job_no_contract}
                  onChange={(e) => setFormData({ ...formData, job_no_contract: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>مناطق المعالجة Treated Areas</label>
                <textarea
                  value={formData.treated_areas}
                  onChange={(e) => setFormData({ ...formData, treated_areas: e.target.value })}
                />
              </div>
            </div>
            <div>
              <div className="form-group">
                <label>نوع المعالجة Treatment Type</label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      name="treatment_type"
                      value="Routine"
                      checked={formData.treatment_type === 'Routine'}
                      onChange={(e) => setFormData({ ...formData, treatment_type: e.target.value })}
                    />
                    <label>Routine - دوري</label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      name="treatment_type"
                      value="Follow-Up"
                      checked={formData.treatment_type === 'Follow-Up'}
                      onChange={(e) => setFormData({ ...formData, treatment_type: e.target.value })}
                    />
                    <label>Follow-Up - مراجعة</label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      name="treatment_type"
                      value="Call-Out"
                      checked={formData.treatment_type === 'Call-Out'}
                      onChange={(e) => setFormData({ ...formData, treatment_type: e.target.value })}
                    />
                    <label>Call-Out - مكالمة صادرة</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pest Details Table */}
        <div className="form-section">
          <div className="section-title">Customer's Information - معلومات العميل</div>
          <table className="dynamic-table">
            <thead>
              <tr>
                <th>الآفات Pests</th>
                <th>مستوى النشاط Level of Activity</th>
                <th>المعالجة/التحكم Treatment/Control</th>
                <th>الأدوات التي تم استخدامها Materials Used</th>
                <th>العدد Qty</th>
                <th>الوحدات Units</th>
                <th>إجراءات</th>
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
                      <option value="P">P= Preventative - الوقاية</option>
                      <option value="L">L= Low - منخفض</option>
                      <option value="M">M= Medium - متوسط</option>
                      <option value="High">High - عالي</option>
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
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      onClick={() => removePestRow(index)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addPestRow}
            style={{ marginTop: '10px' }}
          >
            إضافة صف جديد
          </button>
        </div>

        {/* Pest Risks */}
        <div className="form-section">
          <div className="section-title">Pest Risks Found - مخاطر الآفات التي تم اكتشافها</div>
          <div className="checkbox-group">
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
              <label>Safety/Welfare - السلامة/الرعاية</label>
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

        {/* Treatment Report */}
        <div className="form-section">
          <div className="section-title">Treatment Report - تقرير المعالجة</div>
          <div className="form-group">
            <textarea
              value={formData.treatment_report}
              onChange={(e) => setFormData({ ...formData, treatment_report: e.target.value })}
              rows={5}
            />
          </div>
        </div>

        {/* Recommended Improvements */}
        <div className="form-section">
          <div className="section-title">Recommended Improvements - التوصية بالتحسينات</div>
          <div className="form-group">
            <textarea
              value={formData.recommended_improvements}
              onChange={(e) => setFormData({ ...formData, recommended_improvements: e.target.value })}
              rows={5}
            />
          </div>
        </div>

        {/* Signatures */}
        <div className="form-section">
          <div className="signature-section">
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
                <textarea
                  value={formData.technician_signature}
                  onChange={(e) => setFormData({ ...formData, technician_signature: e.target.value })}
                  rows={3}
                />
              </div>
              <div>Tel: 920004107</div>
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
                <textarea
                  value={formData.customer_signature}
                  onChange={(e) => setFormData({ ...formData, customer_signature: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ التقرير'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push('/')}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  )
}

