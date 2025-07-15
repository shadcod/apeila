import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    if (!req.url) {
      return new Response(JSON.stringify({ message: 'Missing URL!' }), {
        status: 400,
      });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return new Response(JSON.stringify({ message: 'Missing slug!' }), {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug);

    if (error) {
      console.error('Error checking slug from Supabase:', error);
      return new Response(JSON.stringify({ message: 'Server error while checking slug' }), {
        status: 500,
      });
    }

    const exists = data.length > 0;

    return new Response(JSON.stringify({ exists }), { status: 200 });
  } catch (error) {
    console.error('Error checking slug:', error);
    return new Response(JSON.stringify({ message: 'Server error while checking slug' }), {
      status: 500,
    });
  }
}


