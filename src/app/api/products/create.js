import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request) {
  try {
    const newProduct = await request.json();

    const productWithMeta = {
      ...newProduct,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      published: false, // افتراضي غير منشور
      status: 'draft',  // حالة مسودة
    };

    const docRef = await addDoc(collection(db, 'products'), productWithMeta);

    return new Response(
      JSON.stringify({ message: 'Product created successfully!', id: docRef.id }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(
      JSON.stringify({ message: 'Server error while creating product' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
