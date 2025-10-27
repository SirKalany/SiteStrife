"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";

export default function CountryPage({ params }) {
  const { domain, country } = use(params);

  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFamilies() {
      try {
        setLoading(true);
        setError(null);

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

  const accentColor = "text-yellow-400";
  const accentShadow = "hover:shadow-yellow-400/20";

  if (loading)
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
        <p className="text-gray-400 mt-4">Loading families...</p>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center px-4">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition text-black font-semibold"
        >
          Réessayer
        </button>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10">
      <div className="max-w-[90%] md:max-w-[70%] lg:max-w-[80%] mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb domain={domain} country={country} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${accentColor} capitalize`}
          >
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {families.map((family) => (
              <Link
                key={family.slug || family.id}
                href={`/${encodeURIComponent(domain)}/${encodeURIComponent(
                  country
                )}/${encodeURIComponent(family.slug || family.id)}`}
                className="group block"
              >
                <div
                  className={`bg-[#2a2a2a] border border-gray-600 rounded-lg p-6 h-full hover:bg-[#333] hover:border-yellow-400 transition-all duration-200 ${accentShadow}`}
                >
                  <h3
                    className={`text-xl font-bold mb-2 ${accentColor} group-hover:text-yellow-300`}
                  >
                    {family.name}
                  </h3>
                  <p className="text-gray-400 mb-4">{family.type}</p>
                  {family.picture && (
                    <img
                      src={`http://localhost:4000${family.picture}`}
                      alt={family.name}
                      className="w-full h-40 object-cover rounded mb-3"
                    />
                  )}
                  {family.caption && (
                    <p className="text-gray-300 text-sm truncate">
                      {family.caption}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Back to domain */}
        <div className="text-center mt-12">
          <Link
            href={`/${domain}`}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300 hover:text-white"
          >
            ← Back to domain
          </Link>
        </div>
      </div>
    </main>
  );
}
