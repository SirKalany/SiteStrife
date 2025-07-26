"use client";

import { use } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";

async function fetchItems(domain) {
  const res = await fetch(`http://localhost:4000/${domain}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load data");
  return res.json();
}

export default function DomainListPage({ params }) {
  const { domain } = use(params);

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    fetchItems(domain).then(setItems);
  }, [domain]);

  const countries = [...new Set(items.map((item) => item.country))].sort();
  const types = [...new Set(items.map((item) => item.type))].sort();

  const filteredItems = items
    .filter((item) =>
      (item.name || item.nom).toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) =>
      selectedCountry ? item.country === selectedCountry : true
    )
    .filter((item) => (selectedType ? item.type === selectedType : true))
    .sort((a, b) =>
      (a.name || a.nom).localeCompare(b.name || b.nom, "en", {
        ignorePunctuation: true,
      })
    );

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-8 text-green-400 capitalize">
        {domain} Catalog
      </h1>

      {/* Search and Filter toggle */}
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

      {/* Filters section */}
      {filterVisible && (
        <div className="w-full max-w-4xl mb-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
          {/* Country Filter */}
          <div className="flex-1">
            <label className="block text-sm mb-2 text-gray-300">
              Filter by Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white border border-gray-600"
            >
              <option value="">All countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
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
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {filteredItems.map(
          ({ id, name, nom, slug, type, country, picture }) => (
            <Link
              key={id}
              href={`/${domain}/${slug}`}
              className="p-4 border border-gray-600 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition block"
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
              <p className="text-sm text-gray-400">Country: {country}</p>
            </Link>
          )
        )}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-gray-400 mt-8">No items match your search.</p>
      )}
    </main>
  );
}
