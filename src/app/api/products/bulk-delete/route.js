import { supabase } from '@/lib/supabase';

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

    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error deleting products from Supabase:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to delete products', error: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

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
      JSON.stringify({ message: 'Server error while deleting products' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}


