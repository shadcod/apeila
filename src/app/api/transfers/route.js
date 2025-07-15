import { supabase } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("transfers")
      .select("*");

    if (error) {
      console.error("Error fetching transfers from Supabase:", error);
      return Response.json(
        errorResponse("Failed to retrieve transfers"),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse(data, "Transfers retrieved successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transfers:", error);
    return Response.json(
      errorResponse("Failed to retrieve transfers"),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const newItem = await req.json();

    // Basic validation - يمكن تعديلها حسب خصائص الـ transfer المطلوبة
    if (!newItem.from || !newItem.to || !newItem.amount) {
      return Response.json(
        errorResponse("Transfer must have from, to, and amount fields"),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("transfers")
      .insert({
        ...newItem,
        // Supabase handles createdAt automatically if default value is set in table schema
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating transfer in Supabase:", error);
      return Response.json(
        errorResponse("Failed to save transfer"),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse({ id: data.id }, "Transfer created successfully"),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving transfer:", error);
    return new Response(JSON.stringify({ message: "Server error while saving transfer" }), { status: 500 });
  }
}


