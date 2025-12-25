import Link from 'next/link'

export default function Home() {
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

      <div className="nav-links">
        <Link href="/form" className="nav-link">
          إضافة تقرير جديد / Add New Report
        </Link>
        <Link href="/reports" className="nav-link">
          عرض التقارير / View Reports
        </Link>
      </div>
    </div>
  )
}

