// 📄 src/app/dashboard/products/edit/[id]/page.jsx
'use client'

import ProductEditorForm from '@/components/dashboard/product-editor/ProductEditorForm'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { notFound } from 'next/navigation'

export default async function Page({ params }) {
  const id = params.id

  if (!id) {
    notFound()
  }

  // جلب المنتج من Firestore
  const docRef = doc(db, 'products', id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    notFound()
  }

  const product = { id: docSnap.id, ...docSnap.data() }

  return <ProductEditorForm initialProduct={product} />
}
