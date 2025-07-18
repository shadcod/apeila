import { supabaseServerClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req) {
  try {
    const newProduct = await req.json();

    if (!newProduct?.name || !newProduct?.slug) {
      return new Response(
        JSON.stringify(errorResponse('Name and slug are required for product creation')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const {
      name = '',
      slug = '',
      price = 0,
      oldPrice = 0,
      discountPercentage = 0,
      category = '',
      subcategory = '',
      brand = '',
      stock = true,
      inStockCount = 0,
      description = '',
      gallery = [],
      features = [],
      sizes = [],
      colors = [],
      tags = [],
      shippingFee = 0,
      isNew = false,
      isFeatured = false,
      sku = '',
      barcode = '',
    } = newProduct;

    const productWithMeta = {
      name,
      slug,
      price,
      oldPrice,
      discountPercentage,
      category,
      subcategory,
      brand,
      stock,
      inStockCount,
      description,
      gallery,
      features,
      sizes,
      colors,
      tags,
      shippingFee,
      isNew,
      isFeatured,
      sku,
      barcode,
      views: 0,
      rating: 0,
      reviewsCount: 0,
      published: false,
      status: 'draft',
    };

    const supabase = await supabaseServerClient();

    const { data, error } = await supabase
      .from('products')
      .insert(productWithMeta)
      .select('id')
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return new Response(
        JSON.stringify(errorResponse('Server error while creating product')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(successResponse({ id: data.id }, '✅ Product created successfully!')),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(
      JSON.stringify(errorResponse('Server error while creating product')),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
