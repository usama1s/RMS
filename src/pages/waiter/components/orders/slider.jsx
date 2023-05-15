import React from "react";

export function ManagerOrderSlider({ data, updateSliderCategory }) {
  return (
    <div className="w-full flex flex-wrap gap-4 mt-4">
      {data.categories?.map(({ title, slug, active }) => (
        <div
          key={slug}
          onClick={() => updateSliderCategory(title)}
          className={`cursor-pointer
          ${
            active ? "bg-gray-900 text-white" : "bg-[#F3F4F6] text-gray-900"
          } rounded-full w-40 h-5 p-5 flex items-center justify-center`}
        >
          <p>{title}</p>
        </div>
      ))}
    </div>
  );
}
