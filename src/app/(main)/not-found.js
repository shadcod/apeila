import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>الصفحة غير موجودة</h2>
      <p>عذراً، الصفحة التي تبحث عنها غير موجودة</p>
      <Link href="/" className="back-home">
        العودة للصفحة الرئيسية
      </Link>
    </div>
  );
}