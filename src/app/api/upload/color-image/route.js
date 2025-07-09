import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  const productSlug = formData.get('productSlug') || 'default';

  if (!file) return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  const folderPath = path.join(process.cwd(), 'public', 'uploads', 'products', productSlug, 'color_images');
  await mkdir(folderPath, { recursive: true });

  const fileName = `${uuidv4()}_${file.name.replace(/\s+/g, '_')}`;
  const filePath = path.join(folderPath, fileName);

  await writeFile(filePath, buffer);

  const fileUrl = `/uploads/products/${productSlug}/color_images/${fileName}`;

  return new Response(JSON.stringify({ url: fileUrl }), { status: 200 });
}

