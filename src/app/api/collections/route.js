import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'collections'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(
      successResponse(data, 'Collections retrieved successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching collections:', error);
    return Response.json(
      errorResponse('Failed to read collections'),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const newItem = await req.json();

    // Basic validation
    if (!newItem.name) {
      return Response.json(
        errorResponse('Collection name is required'),
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, 'collections'), {
      ...newItem,
      createdAt: serverTimestamp(),
    });

    return Response.json(
      successResponse({ id: docRef.id }, 'Collection created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving collection:', error);
    return Response.json(
      errorResponse('Failed to save collection'),
      { status: 500 }
    );
  }
}
