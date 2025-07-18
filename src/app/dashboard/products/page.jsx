import dynamic from 'next/dynamic'
import { checkRole } from '@/utils/auth'
import { redirect } from 'next/navigation'

const ProductsPage = dynamic(() => import('./ProductsClient'), { ssr: false })

export default async function ProtectedProductsPage() {
  const { authorized } = await checkRole(['admin'])

  if (!authorized) {
    redirect('/')
  }

  return <ProductsPage />
}
