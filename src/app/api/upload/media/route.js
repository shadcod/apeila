import path from 'path';
import fs from 'fs/promises';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const slug = formData.get('slug'); // تأكد أن الـ slug يرسل مع الفورم

    if (!file) {
      return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
    }

    if (!slug) {
      return new Response(JSON.stringify({ message: 'Product slug is required' }), { status: 400 });
    }

    // تحقق نوع الملف وحجمه حسب الحاجة هنا

    const fileName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products', slug, 'product_images');

    // أنشئ المجلدات تلقائياً لو مش موجودة
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    // المسار اللي يرجع للعميل ليستخدمه في الواجهة
    const url = `/uploads/products/${slug}/product_images/${fileName}`;

    return new Response(JSON.stringify({ message: 'Uploaded successfully!', url }), { status: 200 });
  } catch (error) {
    console.error('Error uploading media:', error);
    return new Response(JSON.stringify({ message: 'Server error while uploading media' }), { status: 500 });
  }
}
