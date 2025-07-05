'use client';

export default function ProductTitleInput({
  title,
  tempTitle,
  setTempTitle,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <input
        id="product-title"
        type="text"
        value={isEditing ? tempTitle : title}
        onChange={(e) => setTempTitle(e.target.value)}
        disabled={!isEditing}
        className={`flex-grow border rounded p-2 ${
          isEditing ? 'border-blue-600' : 'bg-gray-100 cursor-not-allowed'
        }`}
        placeholder="Enter product title..."
      />

      {isEditing ? (
        <>
          <button
            onClick={onSave}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            type="button"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            type="button"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          type="button"
        >
          Edit
        </button>
      )}
    </div>
  );
}
