import { supabase } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("purchaseOrders")
      .select("*");

    if (error) {
      console.error("Error fetching purchase orders from Supabase:", error);
      return Response.json(
        errorResponse("Failed to retrieve purchase orders"),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse(data, "Purchase orders retrieved successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    return Response.json(
      errorResponse("Failed to retrieve purchase orders"),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const newItem = await req.json();

    // Basic validation
    if (!newItem.supplier || !newItem.items || !Array.isArray(newItem.items)) {
      return Response.json(
        errorResponse("Supplier and items (array) are required"),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("purchaseOrders")
      .insert({
        ...newItem,
        // Supabase handles createdAt automatically if default value is set in table schema
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating purchase order in Supabase:", error);
      return Response.json(
        errorResponse("Failed to save purchase order"),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse({ id: data.id }, "Purchase order created successfully"),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving purchase order:", error);
    return new Response(JSON.stringify({ message: "Server error while saving purchase order" }), { status: 500 });
  }
}


