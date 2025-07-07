import { db } from '@/lib/firebaseAdmin';
import { deleteDoc, doc } from 'firebase/firestore';

// نستدعي firestoreAdmin (أو firebaseAdmin) بدلاً من JSON
export async function POST(req) {
  const { ids } = await req.json();

  try {
    // حذف المنتجات واحدًا تلو الآخر من Firestore
    for (const id of ids) {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
    }

    return new Response(JSON.stringify({ message: 'Products deleted successfully' }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to delete products', error: error.message }), {
      status: 500,
    });
  }
}
