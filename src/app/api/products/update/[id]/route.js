import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req, { params }) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return new Response(JSON.stringify({ message: 'Invalid product ID.' }), {
      status: 400,
    });
  }

  try {
    const data = await req.json();

    const filePath = path.join(process.cwd(), 'public', 'data', 'products.json');
    const file = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(file);

    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return new Response(JSON.stringify({ message: 'Product not found.' }), {
        status: 404,
      });
    }

    // ✨ تحديث المنتج
    products[productIndex] = {
      ...products[productIndex],
      ...data,
      id: id, // تأكد أن id يبقى نفسه
    };

    // ✨ كتابة الملف مرة أخرى
    await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf-8');

    return new Response(JSON.stringify({ message: 'Product updated successfully.' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ message: 'Failed to update product.' }), {
      status: 500,
    });
  }
}
