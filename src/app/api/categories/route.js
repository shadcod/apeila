import { supabaseServerClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const supabase = supabaseServerClient();
    const { data, error } = await supabase.from('categories').select('*');

    if (error) {
      console.error('Error fetching categories from Supabase:', error);
      return Response.json(errorResponse('Failed to retrieve categories'), { status: 500 });
    }

    return Response.json(successResponse(data, 'Categories retrieved successfully'));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json(errorResponse('Failed to retrieve categories'), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const supabase = supabaseServerClient(); // ✅ ضروري إضافته هنا

    const newItem = await req.json();

    if (!newItem.name) {
      return Response.json(errorResponse('Category name is required'), { status: 400 });
    }

    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', newItem.name)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for duplicate category:', checkError);
      return Response.json(errorResponse('Failed to check for duplicate category'), { status: 500 });
    }

    if (existingCategory) {
      return Response.json(errorResponse('Category already exists'), { status: 409 });
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: newItem.name,
        description: newItem.description || '',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating category in Supabase:', error);
      return Response.json(errorResponse('Failed to create category'), { status: 500 });
    }

    return Response.json(successResponse({ id: data.id }, 'Category created successfully'), { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return Response.json(errorResponse('Server error while creating category'), { status: 500 });
  }
}
