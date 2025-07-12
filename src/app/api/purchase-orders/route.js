import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'purchaseOrders'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(
      successResponse(data, 'Purchase orders retrieved successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return Response.json(
      errorResponse('Failed to read purchase orders'),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const newItem = await req.json();

    // Basic validation
    if (!newItem.supplier || !newItem.items || !Array.isArray(newItem.items)) {
      return Response.json(
        errorResponse('Supplier and items (array) are required'),
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, 'purchaseOrders'), {
      ...newItem,
      createdAt: serverTimestamp(),
    });

    return Response.json(
      successResponse({ id: docRef.id }, 'Purchase order created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving purchase order:', error);
    return Response.json(
      errorResponse('Failed to save purchase order'),
      { status: 500 }
    );
  }
}
