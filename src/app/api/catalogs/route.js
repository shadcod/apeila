import { promises as fs } from 'fs';
import path from 'path';
import { successResponse, errorResponse } from '@/lib/apiResponse';

const filePath = path.join(process.cwd(), 'public', 'data', 'catalogs.json');

export async function GET() {
  try {
    const file = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(file);
    return Response.json(successResponse(data), { status: 200 });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return Response.json(successResponse([], '📁 File not found. Returning empty list.'), { status: 200 });
    }
    console.error('❌ Failed to read catalogs:', error);
    return Response.json(errorResponse('Failed to read catalogs'), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const newItem = await req.json();

    // ✅ تحقق أساسي من صحة العنصر الجديد (يمكنك تخصيصه)
    if (!newItem || typeof newItem !== 'object') {
      return Response.json(errorResponse('Invalid catalog item data'), { status: 400 });
    }

    let data = [];
    try {
      const file = await fs.readFile(filePath, 'utf-8');
      data = JSON.parse(file);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    data.push(newItem);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return Response.json(successResponse(null, '✅ Catalog saved successfully.'), { status: 200 });
  } catch (error) {
    console.error('❌ Failed to save catalog:', error);
    return Response.json(errorResponse('Failed to save catalog'), { status: 500 });
  }
}
