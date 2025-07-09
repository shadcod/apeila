'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import AddProductButton from '@/components/dashboard/product-table/AddProductButton';
import ConfirmDeleteModal from '@/components/dashboard/product-table/ConfirmDeleteModal';
import { STATUS_FILTERS } from '@/constants/product';
import { getAllProducts } from '@/lib/productsService'; // ✅ استدعاء الخدمة الجديدة

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTERS.ALL);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ open: false, type: '', ids: [] });
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts(); // ✅ جلب المنتجات من فايرباس
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products from Firebase:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => {
      if (statusFilter === STATUS_FILTERS.ACTIVE) return p.stock;
      if (statusFilter === STATUS_FILTERS.OUT) return !p.stock;
      return true;
    });

  const allSelected = selectedIds.length === filtered.length && filtered.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const openModal = (type, ids) => {
    setModal({ open: true, type, ids });
  };

  const closeModal = () => {
    setModal({ open: false, type: '', ids: [] });
  };

  const confirmDelete = async () => {
    try {
      const ids = modal.ids;

      if (ids.length === 1) {
        const res = await fetch(`/api/products/${ids[0]}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        setProducts((prev) => prev.filter((p) => p.id !== ids[0]));
        setSelectedIds((prev) => prev.filter((pid) => pid !== ids[0]));
        toast.success(`Product ${ids[0]} deleted successfully`);
      } else {
        const res = await fetch(`/api/products/bulk-delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        });
        if (!res.ok) throw new Error();
        setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
        setSelectedIds([]);
        toast.success(`Deleted ${ids.length} products successfully`);
      }
    } catch {
      toast.error('Failed to delete products');
    } finally {
      closeModal();
    }
  };

  const handleActivateSelected = () => {
    setProducts((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id) ? { ...p, stock: true } : p
      )
    );
    toast.success(`Activated ${selectedIds.length} products`);
    setSelectedIds([]);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 space-y-6 font-sans relative">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🛒 All Products
          <span className="text-sm font-normal text-gray-500">({filtered.length})</span>
        </h1>
        <AddProductButton />
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full sm:w-64 px-4 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-main"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setSearch('')} className="text-gray-500 px-2" title="Clear">
          ✖
        </button>
        <button
          onClick={() => openModal('bulk', selectedIds)}
          disabled={selectedIds.length === 0}
          className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50 transition hover:scale-105 active:scale-95"
        >
          Delete Selected
        </button>
        <button
          onClick={handleActivateSelected}
          disabled={selectedIds.length === 0}
          className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50 transition hover:scale-105 active:scale-95"
        >
          Activate Selected
        </button>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value={STATUS_FILTERS.ALL}>All</option>
          <option value={STATUS_FILTERS.ACTIVE}>Active</option>
          <option value={STATUS_FILTERS.OUT}>Out of Stock</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading products...</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                </th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('name')}>
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('price')}>
                  Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginated.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50 transition ${selectedIds.includes(product.id) ? 'bg-gray-100' : ''}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelectOne(product.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Image src={product.gallery?.[0] || '/placeholder.png'} alt={product.name} width={50} height={50} className="object-contain rounded-md border shadow-sm" />
                  </td>
                  <td
                    className="px-4 py-3 text-heading font-medium cursor-pointer hover:underline"
                    onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
                  >
                    {product.name}
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 text-emerald-600 font-semibold">${product.price}</td>
                  <td className="px-4 py-3">{product.inStockCount} pcs</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full inline-flex items-center gap-1 ${product.stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {product.stock ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => router.push(`/dashboard/products/edit/${product.id}`)} className="text-blue-600 hover:text-blue-800 transition" title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => openModal('single', [product.id])} className="text-red-600 hover:text-red-800 transition" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center gap-2 mt-4">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <span className="px-3 py-1 border rounded">Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>

      <ConfirmDeleteModal
        open={modal.open}
        onClose={closeModal}
        onConfirm={confirmDelete}
        count={modal.ids.length}
      />
    </div>
  );
}
