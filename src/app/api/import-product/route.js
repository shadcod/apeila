import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const data = await req.json();

  try {
    const { error } = await supabase
      .from("products")
      .insert({
        ...data,
        published: false,
        status: "draft",
        // Supabase handles createdAt and updatedAt automatically if default values are set in table schema
      });

    if (error) {
      console.error("Error adding product to Supabase:", error);
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error adding document:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}


