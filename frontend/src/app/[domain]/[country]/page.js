"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CountryDomainPage({ params }) {
  const { domain, country } = use(params); // ⚡ unwrap params

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  // ⚡ fetch véhicules pour ce domaine et ce pays
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch(
          `http://localhost:4000/${encodeURIComponent(
            country
          )}/${encodeURIComponent(domain)}`
        );
        if (!res.ok) throw new Error("Failed to load data");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchItems();
  }, [domain, country]);

  const types = [...new Set(items.map((i) => i.type))].sort();

  const filteredItems = items
    .filter((i) =>
      (i.name || i.nom).toLowerCase().includes(search.toLowerCase())
    )
    .filter((i) => (selectedType ? i.type === selectedType : true))
    .sort((a, b) => (a.name || a.nom).localeCompare(b.name || b.nom));

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-8 text-green-400 capitalize">
        {decodeURIComponent(domain)} - {decodeURIComponent(country)}
      </h1>

      <div className="w-full max-w-5xl flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2 sm:gap-0">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 rounded bg-[#2a2a2a] text-white flex-1 min-w-0 focus:outline-none border border-gray-600 sm:mr-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setFilterVisible(!filterVisible)}
          className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded text-white"
        >
          {filterVisible ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {filterVisible && (
        <div className="w-full max-w-4xl mb-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex-1">
            <label className="block text-sm mb-2 text-gray-300">
              Filter by Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white border border-gray-600"
            >
              <option value="">All types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {filteredItems.map(({ id, name, nom, slug, picture, type }) => (
          <Link
            key={id}
            href={`/${encodeURIComponent(domain)}/${encodeURIComponent(
              country
            )}/${encodeURIComponent(slug)}`}
            className="p-4 border border-gray-600 rounded-lg bg-[#2a2a2a] hover:bg-[#333]"
          >
            {picture && (
              <img
                src={picture}
                alt={name || nom}
                className="w-full h-48 object-cover rounded mb-2"
              />
            )}
            <h2 className="text-xl font-bold mb-1">{name || nom}</h2>
            <p className="text-sm text-gray-400">Type: {type}</p>
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-gray-400 mt-8">
          No vehicles found for this country.
        </p>
      )}
    </main>
  );
}
