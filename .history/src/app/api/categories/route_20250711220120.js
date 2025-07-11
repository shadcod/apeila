import { promises as fs } from 'fs';
import path from 'path';
import { ApiResponse, createErrorResponse } from '@/lib/apiResponse';

const filePath = path.join(process.cwd(), 'public', 'data', 'categories.json');

export async function GET() {
  try {
    const file = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(file);
    
    return ApiResponse.success(
      data,
      'Categories retrieved successfully'
    ).toResponse();
  } catch (error) {
    return createErrorResponse(error, 'Failed to retrieve categories');
  }
}

export async function POST(req) {
  try {
    const newItem = await req.json();
    
    // Validation
    if (!newItem.name) {
      return ApiResponse.validationError(
        ['Category name is required'],
        'Category validation failed'
      ).toResponse();
    }

    const file = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(file);

    // Check for duplicate
    const exists = data.some(item => item.name === newItem.name);
    if (exists) {
      return ApiResponse.error(
        'Category already exists',
        'Duplicate category name',
        409
      ).toResponse();
    }

    data.push({ ...newItem, id: Date.now(), createdAt: new Date().toISOString() });

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    return ApiResponse.success(
      newItem,
      'Category created successfully',
      201
    ).toResponse();
  } catch (error) {
    return createErrorResponse(error, 'Failed to create category');
  }
}