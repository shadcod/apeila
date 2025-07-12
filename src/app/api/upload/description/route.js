import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const productSlug = formData.get('productSlug');

    if (!file || !productSlug) {
      return new Response(JSON.stringify({ error: 'Missing file or productSlug' }), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const folderPath = path.join(process.cwd(), 'public', 'uploads', 'products', productSlug, 'description_images');
    await mkdir(folderPath, { recursive: true });

    const fileName = `${uuidv4()}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(folderPath, fileName);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/products/${productSlug}/description_images/${fileName}`;
    return new Response(JSON.stringify({ url: fileUrl }), { status: 200 });
  } catch (error) {
    console.error('Error uploading description image:', error);
    return new Response(JSON.stringify({ error: 'Server error while uploading description image' }), { status: 500 });
  }
}
