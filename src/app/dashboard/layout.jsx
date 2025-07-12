import DashboardShell from '@/components/dashboard/DashboardShell';
import '@styles/globals.css';

export const metadata = {
  title: 'Dashboard | Apeila.com',
  description: 'Admin Dashboard - Apeila.com',
};

export default function DashboardLayout({ children }) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}
