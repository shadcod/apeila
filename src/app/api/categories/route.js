import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(
      successResponse(data, 'Categories retrieved successfully')
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json(
      errorResponse('Failed to retrieve categories'),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const newItem = await req.json();

    // Validation
    if (!newItem.name) {
      return Response.json(
        errorResponse('Category name is required'),
        { status: 400 }
      );
    }

    // Check for duplicate
    const q = query(collection(db, 'categories'), where('name', '==', newItem.name));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return Response.json(
        errorResponse('Category already exists'),
        { status: 409 }
      );
    }

    const docRef = await addDoc(collection(db, 'categories'), {
      name: newItem.name,
      description: newItem.description || '',
      createdAt: serverTimestamp(),
    });

    return Response.json(
      successResponse({ id: docRef.id }, 'Category created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return Response.json(
      errorResponse('Failed to create category'),
      { status: 500 }
    );
  }
}
