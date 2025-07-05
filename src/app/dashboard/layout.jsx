import DashboardShell from '@/components/dashboard/DashboardShell';
import '@/lib/fontawesome';
import '@styles/globals.css';

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
  metadataBase: "http://localhost:3000", // ✅ صارت string مباشرة
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
