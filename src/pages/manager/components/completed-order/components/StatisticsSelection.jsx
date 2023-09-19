import React from 'react';

export default function StatisticsSelection({ handleStatisticsSelection }) {
  return (
    <div className="w-full flex justify-end">
      <select
        onChange={(e) => {
          handleStatisticsSelection(e.target.value);
        }}
        className="bg-gray-900 border border-gray-300 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-fit p-1"
      >
        <option value="all">All</option>
        <option value="DINEIN">Dine in</option>
        <option value="TAKEAWAY">Takeaway</option>
      </select>
    </div>
  );
}
