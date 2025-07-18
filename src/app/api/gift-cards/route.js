import { supabaseServerClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const supabase = supabaseServerClient();
    const { data, error } = await supabase

      .from('giftCards')
      .select('*');

    if (error) {
      console.error('Error fetching gift cards from Supabase:', error);
      return Response.json(
        errorResponse('Failed to retrieve gift cards'),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse(data, 'Gift cards retrieved successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    return Response.json(
      errorResponse('Failed to retrieve gift cards'),
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

    const { data, error } = await supabase
      .from('giftCards')
      .insert({
        ...newItem,
        // Supabase handles createdAt automatically if default value is set in table schema
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating gift card in Supabase:', error);
      return Response.json(
        errorResponse('Failed to save gift card'),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse({ id: data.id }, 'Gift card created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving gift card:', error);
    return new Response(JSON.stringify({ message: 'Server error while saving gift card' }), { status: 500 });
  }
}


