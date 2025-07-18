import dynamic from 'next/dynamic';
import { checkRole } from '@/utils/auth';
import { redirect } from 'next/navigation';

const HomeClient = dynamic(() => import('./HomeClient'), { ssr: false });

export default async function ProtectedHomePage() {
  const { authorized } = await checkRole(['admin']);

  if (!authorized) {
    redirect('/');
  }

  return <HomeClient />;
}


