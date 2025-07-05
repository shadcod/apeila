import fs from 'fs';
import path from 'path';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return new Response(JSON.stringify({ message: 'Missing slug!' }), {
        status: 400,
      });
    }

    const filePath = path.join(process.cwd(), 'public', 'data', 'products.json');
    if (!fs.existsSync(filePath)) {
      // لو الملف لسه فاضي أو غير موجود، ما في تكرار
      return new Response(JSON.stringify({ exists: false }), {
        status: 200,
      });
    }

    const fileData = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(fileData);

    const exists = products.some((p) => p.slug === slug);

    return new Response(JSON.stringify({ exists }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error checking slug:', error);
    return new Response(JSON.stringify({ message: 'Server error while checking slug' }), {
      status: 500,
    });
  }
}
