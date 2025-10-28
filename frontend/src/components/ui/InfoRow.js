"use client";

export default function InfoRow({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex justify-between items-start p-3 bg-neutral-800 rounded w-full">
      <div className="text-sm text-gray-300 font-medium">{label}</div>
      <div className="text-sm text-yellow-500 text-right">{value}</div>
    </div>
  );
}
