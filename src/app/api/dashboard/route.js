import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'dashboard'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(
      successResponse(data, 'Dashboard data retrieved successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return Response.json(
      errorResponse('Failed to read dashboard'),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const newItem = await req.json();

    // Basic validation
    if (!newItem.title) {
      return Response.json(
        errorResponse('Dashboard item title is required'),
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, 'dashboard'), {
      ...newItem,
      createdAt: serverTimestamp(),
    });

    return Response.json(
      successResponse({ id: docRef.id }, 'Dashboard item created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving dashboard item:', error);
    return Response.json(
      errorResponse('Failed to save dashboard item'),
      { status: 500 }
    );
  }
}
