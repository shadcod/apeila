import { supabase } from './supabase';

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    throw error;
  }

  return data.map(product => {
    // تنظيف بيانات الألوان (إذا كانت لا تزال تأتي بنفس التنسيق)
    const cleanColors = Array.isArray(product.colors)
      ? product.colors.map(color => {
          if (typeof color === 'string') {
            return {
              name: '',
              code: '#000000',
              image: color,
            };
          }
          return {
            name: color.name || '',
            code: color.code || '#000000',
            image: color.image || '',
          };
        })
      : [];

    return {
      ...product,
      colors: cleanColors,
    };
  });
}