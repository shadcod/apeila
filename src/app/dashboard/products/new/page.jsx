'use client'

import EditorProductForm from '@/components/dashboard/product-table/EditorProductForm';

export const dynamic = 'force-dynamic';

export default function Page() {
  const emptyProduct = {
    name: '',
    descriptionHTML: '',
    price: '',
    oldPrice: '',
    discountPercentage: '',
    costPerItem: '',
    category: '',
    brand: '',
    features: [],
    sizes: [],
    tags: [],
    colors: [],
    aiGeneratedSummary: '',
    seoMeta: { title: '', description: '', keywords: [] },
    slug: '',
    gallery: [],
    youtubeLink: '',
    stock: true,
    inStockCount: 0,
    shippingFee: 0,
    deliveryDate: '',
    soldBy: '',
    giftOption: false,
    isNew: false,
    isFeatured: false,
  };

  return (
    <div className="p-4">
      <EditorProductForm initialProduct={emptyProduct} />
    </div>
  );
}
