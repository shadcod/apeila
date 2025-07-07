import admin from '../../../lib/firebaseAdmin'


export async function POST(req) {
  const { ids } = await req.json();

  try {
    const db = admin.firestore();

    for (const id of ids) {
      await db.collection('products').doc(id).delete();
    }

    return new Response(JSON.stringify({ message: 'Products deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
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
