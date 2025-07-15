
'use client';

import { useEffect, useState } from 'react';
import ProductEditorForm from '@/components/dashboard/product-editor/ProductEditorForm';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';

export default function Page() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    console.log("🔎 useParams:", params);
    console.log("🟢 Product ID:", id);

    if (!id) {
      console.log("❌ No ID provided. Redirecting...");
      router.push('/dashboard/products');
      return;
    }

    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          console.error("⚠️ Product not found in Supabase or error fetching:", error);
          router.push('/dashboard/products');
          return;
        }

        console.log("✅ Product data from Supabase:", data);

        setProduct(data);
      } catch (error) {
        console.error("💥 Error fetching product:", error);
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


