import path from 'path';
import fs from 'fs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

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
