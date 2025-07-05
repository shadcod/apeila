// 📄 src/app/dashboard/products/edit/[id]/page.jsx

import ProductEditorForm from '@/components/dashboard/product-editor/ProductEditorForm';
import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    // إذا المعرف غير صالح (ليس رقم)
    notFound();
  }

  const filePath = path.join(process.cwd(), 'public', 'data', 'products.json');
  const file = await fs.readFile(filePath, 'utf-8');
  const products = JSON.parse(file);

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductEditorForm initialProduct={product} />;
}
