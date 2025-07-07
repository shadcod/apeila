import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    if (!req.url) {
      return new Response(JSON.stringify({ message: 'Missing URL!' }), {
        status: 400,
      });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return new Response(JSON.stringify({ message: 'Missing slug!' }), {
        status: 400,
      });
    }

    const q = query(collection(db, 'products'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    const exists = !querySnapshot.empty;

    return new Response(JSON.stringify({ exists }), { status: 200 });
  } catch (error) {
    console.error('Error checking slug:', error);
    return new Response(JSON.stringify({ message: 'Server error while checking slug' }), {
      status: 500,
    });
  }
}
