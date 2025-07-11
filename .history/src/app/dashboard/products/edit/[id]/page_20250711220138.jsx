'use client';

import { useEffect, useState } from 'react';
import ProductEditorForm from '@/components/dashboard/product-editor/ProductEditorForm';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
        const docRef = doc(db, 'products', id);
        console.log("📄 docRef path:", docRef.path);

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.log("⚠️ Product not found in Firebase. Redirecting...");
          router.push('/dashboard/products');
          return;
        }

        // Remove any 'id' field from data to avoid overriding the document ID
        const data = docSnap.data();
        delete data.id;

        console.log("✅ Product data from Firebase:", data);

        setProduct({ id: docSnap.id, ...data });
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
