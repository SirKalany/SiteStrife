"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CountryPage({ params }) {
  const { domain, country } = use(params); // ✅ unwrap params

  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFamilies() {
      try {
        setLoading(true);
        setError(null);

        // URL qui correspond à ton fichier JSON
        const res = await fetch(
          `http://localhost:4000/countries/${encodeURIComponent(
            country
          )}/${encodeURIComponent(domain)}/families`
        );

        if (!res.ok) throw new Error("Impossible de charger les familles");

        const data = await res.json();
        setFamilies(data);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFamilies();
  }, [country, domain]);

  if (loading)
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
        >
          Réessayer
        </button>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-4 md:px-10 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-green-400 capitalize">
          {country} - {domain} Families
        </h1>
        <p className="text-gray-300 text-lg">
          Select a family to explore {domain} vehicles
        </p>
      </div>

      {families.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-gray-400 text-lg">
            No families available for {country} in the {domain} domain.
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {families.map((family) => (
            <Link
              key={family.slug || family.id}
              href={`/${encodeURIComponent(domain)}/${encodeURIComponent(
                country
              )}/${encodeURIComponent(family.slug || family.id)}`}
              className="group block"
            >
              <div className="bg-[#2a2a2a] border border-gray-600 rounded-lg p-6 h-full hover:bg-[#333] hover:border-green-400 transition-all duration-200 hover:shadow-lg hover:shadow-green-400/20">
                <h3 className="text-xl font-bold text-green-400 mb-2 group-hover:text-green-300">
                  {family.name}
                </h3>
                <p className="text-gray-400 mb-4">{family.type}</p>
                {family.picture && (
                  <img
                    src={family.picture}
                    alt={family.name}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <p className="text-gray-300 text-sm truncate">
                  {family.caption}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          href={`/${domain}`}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300 hover:text-white"
        >
          ← Back to domain
        </Link>
      </div>
    </main>
  );
}
