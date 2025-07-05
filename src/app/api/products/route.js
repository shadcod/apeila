import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false, // لإدارة تحميل الملفات عبر formidable أو غيره
  },
};

import formidable from 'formidable';

// دالة مساعدة لإنشاء مجلد إذا لم يكن موجودًا
async function ensureDirExists(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    // إذا المجلد موجود مسبقاً، لا مشكلة
  }
}

export async function POST(req) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(new Response(JSON.stringify({ error: 'Error parsing form data' }), { status: 500 }));
        return;
      }

      try {
        const productSlug = fields.productSlug || 'default';
        const file = files.file;

        if (!file) {
          resolve(new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 }));
          return;
        }

        // تحديد مسار المجلد الخاص بالمنتج
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', productSlug);

        // مجلدات فرعية حسب نوع الملف (images/videos)
        const isVideo = file.mimetype.startsWith('video');
        const subFolder = isVideo ? 'product_videos' : 'product_images';

        const finalDir = path.join(uploadDir, subFolder);
        await ensureDirExists(finalDir);

        // إنشاء اسم فريد للملف مع المحافظة على الامتداد
        const ext = path.extname(file.originalFilename);
        const newFileName = `${uuidv4()}${ext}`;
        const newFilePath = path.join(finalDir, newFileName);

        // قراءة الملف من المسار المؤقت
        const data = await fs.readFile(file.filepath);

        // حفظ الملف في المجلد النهائي
        await fs.writeFile(newFilePath, data);

        // رابط الرفع النهائي للاستخدام في الواجهة (public path)
        const publicUrl = `/uploads/${productSlug}/${subFolder}/${newFileName}`;

        resolve(
          new Response(JSON.stringify({ url: publicUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      } catch (error) {
        reject(new Response(JSON.stringify({ error: 'Failed to save file' }), { status: 500 }));
      }
    });
  });
}
