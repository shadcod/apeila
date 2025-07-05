'use client';

export default function ProductPricingFields({
  price,
  setPrice,
  oldPrice,
  setOldPrice,
  discount,
  setDiscount,
  costPerItem,
  setCostPerItem,
  profit,
  margin,
}) {
  // تحديد لون الشريط حسب النسبة
  const getMarginColor = (value) => {
    if (value > 30) return 'bg-green-500';
    if (value >= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Old Price ($)</label>
          <input
            type="number"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <div className="flex items-end mb-4 gap-4">
        <div className="w-40">
          <label className="block text-sm font-medium mb-1">Cost per Item ($)</label>
          <input
            type="number"
            value={costPerItem}
            onChange={(e) => setCostPerItem(e.target.value)}
            className="w-full border rounded p-2 text-sm"
          />
          <p className="mt-1 text-gray-500 text-xs italic">Customers won’t see this.</p>
        </div>

        {price && costPerItem && (
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Margin</label>
            <div className="w-full bg-gray-200 rounded h-6 relative overflow-hidden">
              <div
                className={`${getMarginColor(margin)} h-6 rounded transition-all`}
                style={{ width: `${margin}%` }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                  {margin}%
                </span>
              </div>
            </div>
            <div className="mt-1 text-sm text-gray-700 font-medium">
              Profit: ${profit}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
