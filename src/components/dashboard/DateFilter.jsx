'use client';

export default function DateFilter({ selectedRange, onChange }) {
  const ranges = ['Last 7 Days', 'Last 30 Days', 'This Month'];

  return (
    <div className="mb-6 flex items-center gap-4">
      <label className="text-gray-700 font-medium">📅 Date Range:</label>
      <select
        className="border border-gray-300 rounded px-4 py-2 text-sm"
        value={selectedRange}
        onChange={(e) => onChange(e.target.value)}
      >
        {ranges.map((range) => (
          <option key={range} value={range}>{range}</option>
        ))}
      </select>
    </div>
  );
}
