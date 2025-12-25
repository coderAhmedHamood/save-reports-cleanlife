import './globals.css'

export const metadata = {
  title: 'Service Report - تقرير خدمة',
  description: 'Service Report Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}

