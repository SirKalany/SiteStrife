"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DomainPage({ params }) {
  const { domain } = use(params); // ⚡ unwrap params

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCountries() {
      try {
        // ⚡ récupérer tous les pays
        const res = await fetch(`http://localhost:4000/countries`);
        if (!res.ok) throw new Error("Failed to load countries");
        const countryList = await res.json();

        // ⚡ filtrer seulement ceux ayant du contenu pour ce domaine
        const availableCountries = [];
        for (const country of countryList) {
          const check = await fetch(
            `http://localhost:4000/vehicles?country=${encodeURIComponent(
              country
            )}&domain=${encodeURIComponent(domain)}`
          );
          if (check.ok) {
            const data = await check.json();
            if (data.length > 0) availableCountries.push(country);
          }
        }

        setCountries(availableCountries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, [domain]);

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-8 text-green-400 capitalize">
        {decodeURIComponent(domain)}
      </h1>

      <p className="text-gray-300 mb-6">
        Select a country to see all {decodeURIComponent(domain)} vehicles:
      </p>

      {loading ? (
        <p className="text-gray-400 mt-8">Loading...</p>
      ) : countries.length === 0 ? (
        <p className="text-gray-400 mt-8">No countries available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
          {countries.map((country) => (
            <Link
              key={country}
              href={`/${encodeURIComponent(domain)}/${encodeURIComponent(
                country
              )}`}
              className="p-6 border border-gray-600 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-center font-bold text-green-400 transition"
            >
              {decodeURIComponent(country)}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
