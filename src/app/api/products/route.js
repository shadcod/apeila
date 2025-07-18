import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// ✅ Next.js App Router إعدادات خاصة لتفعيل دعم Node.js
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ✅ تأكد من وجود المجلد المطلوب
async function ensureDirExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (_) {
    // لا شيء إذا كان موجود
  }
}

// ✅ دالة لتحليل formData من الطلب
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// ✅ نقطة نهاية لرفع الملفات
export async function POST(req) {
  try {
    const { fields, files } = await parseForm(req);

    const productSlug =
      Array.isArray(fields.productSlug) ? fields.productSlug[0] : fields.productSlug || 'default';

    const file =
      Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return errorResponse('No file uploaded.').toResponse();
    }

    const isVideo = file.mimetype?.startsWith('video');
    const isImage = file.mimetype?.startsWith('image');

    if (!isVideo && !isImage) {
      return errorResponse('Unsupported file type. Only image/video allowed.').toResponse();
    }

    const folderType = isVideo ? 'product_videos' : 'product_images';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', productSlug, folderType);
    await ensureDirExists(uploadDir);

    const ext = path.extname(file.originalFilename || '.file');
    const newFileName = `${uuidv4()}${ext}`;
    const newFilePath = path.join(uploadDir, newFileName);

    const fileBuffer = await fs.readFile(file.filepath);
    await fs.writeFile(newFilePath, fileBuffer);

    const publicUrl = `/uploads/${productSlug}/${folderType}/${newFileName}`;

    return successResponse({ url: publicUrl }, '✅ File uploaded successfully.').toResponse();
  } catch (error) {
    console.error('❌ Upload error:', error);
    return errorResponse('❌ Failed to upload file.').toResponse();
  }
}

// ✅ دعم OPTIONS لطلبات CORS (مهم في بعض حالات frontend)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
