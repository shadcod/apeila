import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const newProduct = await request.json();

    const filePath = path.join(process.cwd(), 'data', 'products.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(fileData);

    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    newProduct.id = newId;
    newProduct.createdAt = new Date().toISOString();

    products.push(newProduct);

    await fs.writeFile(filePath, JSON.stringify(products, null, 2));

    return new Response(JSON.stringify({ message: 'Product created successfully!', id: newId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ message: 'Server error while creating product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
