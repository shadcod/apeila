import path from 'path';
import fs from 'fs/promises';
import { ApiResponse, createErrorResponse } from '@/lib/apiResponse';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const slug = formData.get('slug');

    if (!file || !slug) {
      return ApiResponse.error(
        'Missing file or slug',
        'Both file and product slug are required',
        400
      ).toResponse();
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const uploadDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      'products',
      slug,
      'product_images'
    );

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/products/${slug}/product_images/${fileName}`;
    return ApiResponse.success({ url: fileUrl }, 'Image uploaded successfully').toResponse();
  } catch (error) {
    console.error('Error uploading product image:', error);
    return createErrorResponse(error, 'Unexpected error while uploading product image');
  }
}
