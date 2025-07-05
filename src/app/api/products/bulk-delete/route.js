import { promises as fs } from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'public/data/products.json');

export async function POST(req) {
  const { ids } = await req.json();

  try {
    const fileData = await fs.readFile(dataFile, 'utf8');
    const products = JSON.parse(fileData);

    const updated = products.filter((product) => !ids.includes(String(product.id)));

    await fs.writeFile(dataFile, JSON.stringify(updated, null, 2));

    return new Response(JSON.stringify({ message: 'Products deleted successfully' }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to delete products', error: error.message }), {
      status: 500,
    });
  }
}
