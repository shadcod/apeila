'use client';

export default function ConfirmDeleteModal({ open, onClose, onConfirm, count }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-lg text-center">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4">
          Are you sure you want to delete {count} {count === 1 ? 'product' : 'products'}?
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded">Yes, Delete</button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}
