import { supabase } from '@/lib/supabase';
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

export async function POST(request) {
  try {
    const newProduct = await request.json();

    // Basic validation
    if (!newProduct.name || !newProduct.slug) {
      return Response.json(
        errorResponse('Name and slug are required for product creation'),
        { status: 400 }
      );
    }

    const {
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
    } = newProduct;

    const productWithMeta = {
      name: name || '',
      slug: slug || '',
      price: price || 0,
      oldPrice: oldPrice || 0,
      discountPercentage: discountPercentage || 0,
      category: category || '',
      subcategory: subcategory || '',
      brand: brand || '',
      stock: stock ?? true,
      inStockCount: inStockCount || 0,
      description: description || '',
      gallery: gallery || [],
      features: features || [],
      sizes: sizes || [],
      colors: colors || [],
      tags: tags || [],
      shippingFee: shippingFee || 0,
      isNew: isNew ?? false,
      isFeatured: isFeatured ?? false,
      sku: sku || '',
      barcode: barcode || '',
      views: 0,
      rating: 0,
      reviewsCount: 0,
      // createdAt: serverTimestamp(), // Supabase handles this automatically if default value is set
      // updatedAt: serverTimestamp(), // Supabase handles this automatically if default value is set
      published: false,
      status: 'draft',
    };

    const { data, error } = await supabase
      .from('products')
      .insert(productWithMeta)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating product in Supabase:', error);
      return Response.json(
        errorResponse('Server error while creating product'),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse({ id: data.id }, 'Product created successfully!'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return Response.json(
      errorResponse('Server error while creating product'),
      { status: 500 }
    );
  }
}


