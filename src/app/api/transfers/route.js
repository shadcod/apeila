import { supabaseServerClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    const supabase = supabaseServerClient();
    const { data, error } = await supabase

      .from("transfers")
      .select("*");

    if (error) {
      console.error("❌ Error fetching transfers from Supabase:", error);
      return Response.json(
        errorResponse("Failed to retrieve transfers"),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse(data, "✅ Transfers retrieved successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Server error while retrieving transfers:", error);
    return Response.json(
      errorResponse("Server error while retrieving transfers"),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const newItem = await req.json();

    if (!newItem.from || !newItem.to || !newItem.amount) {
      return Response.json(
        errorResponse("Transfer must have from, to, and amount fields"),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("transfers")
      .insert({ ...newItem })
      .select("id")
      .single();

    if (error) {
      console.error("❌ Error creating transfer in Supabase:", error);
      return Response.json(
        errorResponse("Failed to save transfer"),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse({ id: data.id }, "✅ Transfer created successfully"),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Server error while saving transfer:", error);
    return Response.json(
      errorResponse("Server error while saving transfer"),
      { status: 500 }
    );
  }
}
