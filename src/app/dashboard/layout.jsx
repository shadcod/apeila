// src/app/dashboard/layout.jsx
import DashboardShell from '@/components/dashboard/DashboardShell';
import '@/lib/fontawesome'; // استدعاء إعدادات Font Awesome مرة واحدة هنا
import { Inter } from 'next/font/google';
import '@styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dashboard | Apeila.com',
  description: 'Admin Dashboard - Apeila.com',
  openGraph: {
    title: 'Wetren.com | Dashboard',
    description: 'Admin dashboard for Apeila.com',
    url: 'https://Apeila.com',
    siteName: 'Apeila',
    images: [{ url: '/img/icon.png' }],
    locale: 'en_US',
    type: 'website',
  },
  metadataBase: new URL("http://localhost:3000"), // غيّرها في الإنتاج
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
