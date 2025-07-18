import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse, createErrorResponse } from '@/lib/apiResponse';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const slug = formData.get('productSlug');

    if (!file || !slug) {
      return ApiResponse.error('Missing file or productSlug', 'File and slug are required', 400).toResponse();
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const folderPath = path.join(
      process.cwd(),
      'public',
      'uploads',
      'products',
      slug,
      'description_images'
    );
    await mkdir(folderPath, { recursive: true });

    const fileName = `${uuidv4()}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(folderPath, fileName);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/products/${slug}/description_images/${fileName}`;
    return ApiResponse.success({ url: fileUrl }, 'Image uploaded successfully').toResponse();
  } catch (error) {
    console.error('Error uploading description image:', error);
    return createErrorResponse(error, 'Unexpected server error while uploading description image');
  }
}
