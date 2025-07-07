import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req, { params }) {
  const productId = params.id;

  if (!productId) {
    return new Response(JSON.stringify({ message: 'Invalid product ID.' }), {
      status: 400,
    });
  }

  try {
    const data = await req.json();

    const productRef = doc(db, 'products', productId);

    await updateDoc(productRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return new Response(JSON.stringify({ message: 'Product updated successfully.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ message: 'Failed to update product.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
