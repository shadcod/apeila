'use client';

import { useEffect, useState } from 'react';
import ProductEditorForm from '@/components/dashboard/product-editor/ProductEditorForm';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter, useParams } from 'next/navigation';

export default function Page() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (!id) {
      router.push('/dashboard/products');
      return;
    }

    async function fetchProduct() {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          router.push('/dashboard/products');
          return;
        }

        setProduct({ id: docSnap.id, ...docSnap.data() });
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/dashboard/products');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, router]);

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  return <ProductEditorForm initialProduct={product} />;
}
