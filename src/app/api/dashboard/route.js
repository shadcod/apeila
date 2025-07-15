import { supabase } from '@/lib/supabase';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('dashboard')
      .select('*');

    if (error) {
      console.error('Error fetching dashboard data from Supabase:', error);
      return Response.json(
        errorResponse('Failed to retrieve dashboard data'),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse(data, 'Dashboard data retrieved successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return Response.json(
      errorResponse('Failed to retrieve dashboard data'),
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

    const { data, error } = await supabase
      .from('dashboard')
      .insert({
        ...newItem,
        // Supabase handles createdAt automatically if default value is set in table schema
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating dashboard item in Supabase:', error);
      return Response.json(
        errorResponse('Failed to save dashboard item'),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse({ id: data.id }, 'Dashboard item created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving dashboard item:', error);
    return new Response(JSON.stringify({ message: 'Server error while saving dashboard item' }), { status: 500 });
  }
}


