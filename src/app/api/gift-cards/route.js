import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'giftCards'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(
      successResponse(data, 'Gift cards retrieved successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    return Response.json(
      errorResponse('Failed to read gift cards'),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const newItem = await req.json();

    // Basic validation
    if (!newItem.code || !newItem.amount) {
      return Response.json(
        errorResponse('Gift card code and amount are required'),
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, 'giftCards'), {
      ...newItem,
      createdAt: serverTimestamp(),
    });

    return Response.json(
      successResponse({ id: docRef.id }, 'Gift card created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving gift card:', error);
    return Response.json(
      errorResponse('Failed to save gift card'),
      { status: 500 }
    );
  }
}
