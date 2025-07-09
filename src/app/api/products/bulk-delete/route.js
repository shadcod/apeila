import admin from '@/lib/firebaseAdmin';

export async function POST(req) {
  try {
    const { ids } = await req.json();

    // تحقق من وجود ids وأنها مصفوفة غير فارغة
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Invalid or missing IDs' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const db = admin.firestore();

    // حذف جميع المنتجات بالتوازي لتحسين الأداء
    await Promise.all(
      ids.map((id) => db.collection('products').doc(id).delete())
    );

    return new Response(
      JSON.stringify({ message: 'Products deleted successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error deleting products:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to delete products', error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
