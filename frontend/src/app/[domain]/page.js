"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";

export default function DomainPage({ params }) {
  const { domain } = use(params);

  const [countries, setCountries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCountriesWithDomain() {
      try {
        setLoading(true);
        setError(null);

        const countriesRes = await fetch("http://localhost:4000/countries");
        if (!countriesRes.ok) throw new Error("Impossible de charger les pays");
        const allCountries = await countriesRes.json();

        const countriesWithContent = [];

        for (const country of allCountries) {
          try {
            const res = await fetch(
              `http://localhost:4000/countries/${encodeURIComponent(
                country
              )}/domains`
            );
            if (!res.ok) continue;

            const domains = await res.json();
            if (domains.includes(domain)) {
              const famRes = await fetch(
                `http://localhost:4000/countries/${encodeURIComponent(
                  country
                )}/${encodeURIComponent(domain)}/families`
              );
              if (!famRes.ok) continue;

              const families = await famRes.json();
              if (families && families.length > 0) {
                countriesWithContent.push({
                  name: country,
                  displayName:
                    country.charAt(0).toUpperCase() + country.slice(1),
                  familiesCount: families.length,
                  preview: families.slice(0, 3),
                });
              }
            }
          } catch (e) {
            console.warn(`Erreur pour ${country}:`, e.message);
          }
        }

        // Tri alphabétique
        const sorted = countriesWithContent.sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        );

        setCountries(sorted);
        setFiltered(sorted);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCountriesWithDomain();
  }, [domain]);

  // Filtrage live
  useEffect(() => {
    const query = search.toLowerCase();
    setFiltered(
      countries.filter((c) => c.displayName.toLowerCase().includes(query))
    );
  }, [search, countries]);

  const accentColor = "text-yellow-500";
  const accentBg = "bg-yellow-500";

  // Loader
  if (loading) {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center font-mono">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-yellow-500 border-t-transparent mb-4"></div>
        <p className="text-gray-400 uppercase tracking-widest text-sm">
          Loading tactical data...
        </p>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10 flex flex-col items-center justify-center font-mono">
        <h1 className={`text-3xl font-bold mb-6 ${accentColor} uppercase`}>
          {decodeURIComponent(domain)}
        </h1>
        <p className="text-red-500 mb-4 font-semibold">
          ⚠ System failure: Data Unavailable
        </p>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={`px-6 py-2 ${accentBg} text-black rounded-sm hover:brightness-110 transition`}
        >
          Retry
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] text-white px-6 py-12 tracking-tight">
      <div className="max-w-[90%] md:max-w-[85%] mx-auto">
        <Breadcrumb domain={domain} />

        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className={`text-5xl font-extrabold mb-3 ${accentColor} uppercase tracking-[0.2em] transform inline-block`}
          >
            {decodeURIComponent(domain)}
          </h1>
          <div className="w-28 h-[2px] mx-auto bg-yellow-500 mt-2 skew-x-12" />
          <p className="mx-auto text-center text-gray-400 text-sm uppercase mt-4 tracking-widest font-mono">
            Select a nation to review classified assets
          </p>
        </div>

        {/* Search bar */}
        <div className="text-center mb-10">
          <input
            type="text"
            placeholder="Filter by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1b1b1b] border border-gray-700 text-gray-200 text-sm px-4 py-2 w-64 rounded-sm focus:outline-none focus:border-yellow-500 font-mono text-center tracking-widest"
          />
        </div>

        {/* Stats */}
        {filtered.length > 0 && (
          <div className="text-center mb-10 text-gray-500 uppercase text-xs tracking-[0.25em] font-mono">
            {filtered.length} countries •{" "}
            {filtered.reduce((t, c) => t + c.familiesCount, 0)} asset families
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center mt-16 text-gray-500 uppercase font-mono">
            No available data for "{search}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8">
            {filtered.map((country) => (
              <Link
                key={country.name}
                href={`/${encodeURIComponent(domain)}/${encodeURIComponent(
                  country.name
                )}`}
                className="group block"
              >
                <div
                  className="relative overflow-hidden bg-[#1e1e1e] border border-gray-700 rounded-sm transition-all duration-200 hover:border-yellow-500/80 hover:shadow-[0_0_15px_#c9b45840]"
                  style={{
                    clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)",
                  }}
                >
                  <div className="p-6 transform -skew-x-4">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-500/40 skew-x-12" />

                    <h3
                      className={`text-xl font-bold mb-2 ${accentColor} group-hover:text-yellow-400 transform skew-x-4`}
                    >
                      {country.displayName}
                    </h3>

                    <p className="text-gray-400 mb-3 text-sm font-mono transform skew-x-4">
                      {country.familiesCount} famille
                      {country.familiesCount > 1 ? "s" : ""}
                    </p>

                    <div className="space-y-1 text-sm">
                      <p className="text-[#808080] uppercase text-xs mb-1 tracking-wide font-mono transform skew-x-4">
                        Sample assets:
                      </p>
                      {country.preview.map((family, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 transform skew-x-4"
                        >
                          <div className="w-2 h-2 bg-yellow-500 rounded-sm opacity-70"></div>
                          <span className="text-gray-300 truncate">
                            {family.name}
                          </span>
                          <span className="text-gray-500 text-xs font-mono">
                            ({family.type})
                          </span>
                        </div>
                      ))}
                      {country.familiesCount > 3 && (
                        <p className="text-xs text-gray-500 italic font-mono transform skew-x-4">
                          +{country.familiesCount - 3} more...
                        </p>
                      )}
                    </div>

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

        {/* Back */}
        <div className="text-center mt-16">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-700 hover:border-yellow-500 rounded-sm uppercase text-sm tracking-[0.2em] transition font-mono"
            style={{
              clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)",
            }}
          >
            <span>←</span>
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
