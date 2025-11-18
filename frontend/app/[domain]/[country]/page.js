"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";

export default function CountryPage({ params }) {
  const { domain, country } = use(params);

  const [families, setFamilies] = useState([]);
  const [filteredFamilies, setFilteredFamilies] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFamilies() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/countries/${encodeURIComponent(
            country
          )}/${encodeURIComponent(domain)}/families`
        );

        if (!res.ok) throw new Error("Impossible de charger les familles");

        const data = await res.json();

        // Tri alphabétique dès réception
        const sorted = data.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "", "en", {
            sensitivity: "base",
          })
        );

        setFamilies(sorted);
        setFilteredFamilies(sorted);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFamilies();
  }, [country, domain]);

  // Filtrage dynamique
  useEffect(() => {
    const result = families.filter((family) =>
      (family.name || "").toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredFamilies(result);
  }, [filter, families]);

  const accentColor = "text-yellow-500";
  const accentShadow = "hover:shadow-yellow-500/20";

  if (loading)
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center font-mono">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-yellow-500 border-t-transparent mb-4"></div>
        <p className="text-gray-400 mt-4 uppercase tracking-widest text-sm">
          Loading families...
        </p>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center px-4 font-mono">
        <p className="text-red-500 mb-4 font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-yellow-500 hover:brightness-110 text-black rounded-sm transition"
        >
          Retry
        </button>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#121212] text-white px-6 py-12 tracking-tight">
      <div className="max-w-[90%] md:max-w-[85%] mx-auto">
        <Breadcrumb domain={domain} country={country} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-5xl font-extrabold mb-3 ${accentColor} uppercase tracking-[0.2em] transform inline-block`}
          >
            {country} - {domain} Families
          </h1>
          <div className="w-28 h-0.5 mx-auto bg-yellow-500 mt-2 skew-x-12" />
          <p className="mx-auto text-center text-gray-400 text-sm uppercase mt-4 tracking-widest font-mono">
            Select a family to explore {domain} vehicles
          </p>

          {/* Champ de filtre */}
          <div className="mt-8 flex justify-center">
            <input
              type="text"
              placeholder="Filter by name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#1b1b1b] border border-gray-700 text-gray-200 px-4 py-2 font-mono text-sm tracking-widest focus:outline-none focus:border-yellow-500 transition w-64 text-center"
            />
          </div>
        </div>

        {filteredFamilies.length === 0 ? (
          <div className="text-center mt-16 text-gray-500 uppercase font-mono">
            No families match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredFamilies.map((family) => (
              <Link
                key={family.slug || family.id}
                href={`/${encodeURIComponent(domain)}/${encodeURIComponent(
                  country
                )}/${encodeURIComponent(family.slug || family.id)}`}
                className="group block"
              >
                <div
                  className={`relative overflow-hidden bg-[#1e1e1e] border border-gray-700 rounded-sm transition-all duration-200 hover:border-yellow-500/80 ${accentShadow}`}
                  style={{
                    clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)",
                  }}
                >
                  <div className="p-6 transform -skew-x-4">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-yellow-500/40 skew-x-12" />

                    <h3
                      className={`text-xl font-bold mb-2 ${accentColor} group-hover:text-yellow-500 transform skew-x-4`}
                    >
                      {family.name || "Unknown"}
                    </h3>

                    <p className="text-gray-400 mb-3 text-sm font-mono transform skew-x-4">
                      {family.type || "N/A"}
                    </p>

                    {family.picture && (
                      <div className="overflow-hidden rounded mb-3 transform skew-x-1">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${family.picture}`}
                          alt={family.name || "family"}
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    )}

                    {family.caption && (
                      <p className="text-gray-300 text-sm truncate transform skew-x-4">
                        {family.caption}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-gray-700 group-hover:border-yellow-500/60 transition transform skew-x-4">
                      <p className="text-xs uppercase tracking-wide text-gray-400 group-hover:text-yellow-500 transition font-mono">
                        Access dossier →
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Back to domain */}
        <div className="text-center mt-16">
          <Link
            href={`/${domain}`}
            className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-700 hover:border-yellow-500 rounded-sm uppercase text-sm tracking-[0.2em] transition font-mono"
            style={{
              clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)",
            }}
          >
            <span>←</span>
            <span>Back to domain</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
