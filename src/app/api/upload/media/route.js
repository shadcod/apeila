import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const slug = formData.get('slug');

    if (!file) {
      return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
    }

    if (!slug) {
      return new Response(JSON.stringify({ message: 'Product slug is required' }), { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePathInStorage = `products/${slug}/product_images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product_images') // تأكد من أن هذا هو اسم الـ bucket الخاص بك في Supabase
      .upload(filePathInStorage, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading to Supabase Storage:', error);
      return new Response(JSON.stringify({ message: 'Server error while uploading media to Supabase Storage' }), { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from('product_images')
      .getPublicUrl(filePathInStorage);

    const url = publicUrlData.publicUrl;

    return new Response(JSON.stringify({ message: 'Uploaded successfully!', url }), { status: 200 });
  } catch (error) {
    console.error('Error uploading media:', error);
    return new Response(JSON.stringify({ message: 'Server error while uploading media' }), { status: 500 });
  }
}


