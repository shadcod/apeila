import { supabaseServerClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const supabase = supabaseServerClient();
    const { data, error } = await supabase

      .from('dashboard')
      .select('*');

    if (error) {
      console.error('Error fetching dashboard data from Supabase:', error);
      return errorResponse('Failed to retrieve dashboard data', 'Failed to retrieve dashboard data', 500);
    }

    return successResponse(data, 'Dashboard data retrieved successfully', 200);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return errorResponse(error, 'Failed to retrieve dashboard data', 500);
  }
}

export async function POST(req) {
  try {
    const newItem = await req.json();

    // Basic validation
    if (!newItem.title) {
      return errorResponse('Dashboard item title is required', 'Dashboard item title is required', 400);
    }

    const { data, error } = await supabase
      .from('dashboard')
      .insert({
        ...newItem,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating dashboard item in Supabase:', error);
      return errorResponse('Failed to save dashboard item', 'Failed to save dashboard item', 500);
    }

    return successResponse({ id: data.id }, 'Dashboard item created successfully', 201);
  } catch (error) {
    console.error('Error saving dashboard item:', error);
    return errorResponse(error, 'Server error while saving dashboard item', 500);
  }
}
