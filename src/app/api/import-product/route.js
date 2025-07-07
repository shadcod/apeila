import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore"; 

export async function POST(req) {
  const data = await req.json();

  try {
    await addDoc(collection(db, "products"), {
      ...data,
      published: false,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error adding document:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
