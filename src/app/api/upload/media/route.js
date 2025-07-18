import { supabaseServerClient } from '@/lib/supabase/server';
import { ApiResponse, createErrorResponse } from '@/lib/apiResponse';

export async function POST(req) {
  try {
    const supabase = await supabaseServerClient(); // ✅ ضروري

    const formData = await req.formData();
    const file = formData.get('file');
    const slug = formData.get('slug');

    if (!file) {
      return ApiResponse.error('No file uploaded', 'File upload failed', 400).toResponse();
    }

    if (!slug) {
      return ApiResponse.error('Missing product slug', 'Slug is required', 400).toResponse();
    }

    const sanitizedFileName = file.name.replace(/\s+/g, '_');
    const fileName = `${Date.now()}-${sanitizedFileName}`;
    const filePath = `products/${slug}/product_images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product_images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return createErrorResponse(uploadError, 'Failed to upload file to storage');
    }

    const { data: publicUrlData } = supabase.storage
      .from('product_images')
      .getPublicUrl(filePath);

    const url = publicUrlData?.publicUrl;

    if (!url) {
      return ApiResponse.error('Unable to generate public URL', 'Storage returned empty URL', 500).toResponse();
    }

    return ApiResponse.success({ url }, 'File uploaded successfully').toResponse();
  } catch (error) {
    console.error('Unhandled upload error:', error);
    return createErrorResponse(error, 'Unexpected server error while uploading file');
  }
}

