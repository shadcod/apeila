import { supabase } from '@/lib/supabase';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*');

    if (error) {
      console.error('Error fetching collections from Supabase:', error);
      return Response.json(
        errorResponse('Failed to retrieve collections'),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse(data, 'Collections retrieved successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching collections:', error);
    return Response.json(
      errorResponse('Failed to retrieve collections'),
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

    const { data, error } = await supabase
      .from('collections')
      .insert({
        ...newItem,
        // Supabase handles createdAt automatically if default value is set in table schema
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating collection in Supabase:', error);
      return Response.json(
        errorResponse('Failed to save collection'),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse({ id: data.id }, 'Collection created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving collection:', error);
    return new Response(JSON.stringify({ message: 'Server error while saving collection' }), { status: 500 });
  }
}


