import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'transfers'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(
      successResponse(data, 'Transfers retrieved successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return Response.json(
      errorResponse('Failed to read transfers'),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const newItem = await req.json();

    // Basic validation - يمكن تعديلها حسب خصائص الـ transfer المطلوبة
    if (!newItem.from || !newItem.to || !newItem.amount) {
      return Response.json(
        errorResponse('Transfer must have from, to, and amount fields'),
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, 'transfers'), {
      ...newItem,
      createdAt: serverTimestamp(),
    });

    return Response.json(
      successResponse({ id: docRef.id }, 'Transfer created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving transfer:', error);
    return Response.json(
      errorResponse('Failed to save transfer'),
      { status: 500 }
    );
  }
}
