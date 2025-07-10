import path from 'path';
import fs from 'fs/promises';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
    }

    // ممكن تضيف هنا تحقق نوع الملف وحجمه

    const fileName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // أنشئ المجلد إذا لم يكن موجودًا
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    return new Response(JSON.stringify({ message: 'Uploaded successfully!', url: `/uploads/${fileName}` }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    return new Response(JSON.stringify({ message: 'Server error while uploading media' }), {
      status: 500,
    });
  }
}
