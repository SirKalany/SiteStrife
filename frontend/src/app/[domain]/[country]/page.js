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
          <div className="w-28 h-[2px] mx-auto bg-yellow-500 mt-2 skew-x-12" />
          <p className="mx-auto text-center text-gray-400 text-sm uppercase mt-4 tracking-widest font-mono">
            Select a family to explore {domain} vehicles
          </p>
        </div>

        {families.length === 0 ? (
          <div className="text-center mt-16 text-gray-500 uppercase font-mono">
            No families available for {country} in the {domain} domain.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {families.map((family) => (
              <Link
                key={family.slug || family.id}
                href={`/${encodeURIComponent(domain)}/${encodeURIComponent(
                  country
                )}/${encodeURIComponent(family.slug || family.id)}`}
                className="group block"
              >
                {/* Container incliné */}
                <div
                  className={`relative overflow-hidden bg-[#1e1e1e] border border-gray-700 rounded-sm transition-all duration-200 hover:border-yellow-500/80 ${accentShadow}`}
                  style={{
                    clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)",
                  }}
                >
                  {/* Wrapper pour compenser le skew */}
                  <div className="p-6 transform -skew-x-4">
                    {/* Bande supérieure */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-500/40 skew-x-12" />

                    {/* Nom de la famille */}
                    <h3
                      className={`text-xl font-bold mb-2 ${accentColor} group-hover:text-yellow-500 transform skew-x-4`}
                    >
                      {family.name}
                    </h3>

                    {/* Type */}
                    <p className="text-gray-400 mb-3 text-sm font-mono transform skew-x-4">
                      {family.type}
                    </p>

                    {/* Image */}
                    {family.picture && (
                      <div className="overflow-hidden rounded mb-3 transform skew-x-1">
                        <img
                          src={`http://localhost:4000${family.picture}`}
                          alt={family.name}
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    )}

                    {/* Caption */}
                    {family.caption && (
                      <p className="text-gray-300 text-sm truncate transform skew-x-4">
                        {family.caption}
                      </p>
                    )}

                    {/* Bas de carte */}
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
