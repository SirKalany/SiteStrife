"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";

export default function DomainPage({ params }) {
  const { domain } = use(params);

  const [countries, setCountries] = useState([]);
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

        setCountries(countriesWithContent);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCountriesWithDomain();
  }, [domain]);

  const accentColor = "text-yellow-400";
  const accentBg = "bg-yellow-400";
  const accentHover = "hover:text-yellow-300";
  const accentShadow = "hover:shadow-yellow-400/20";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10 flex flex-col items-center">
        <h1
          className={`text-3xl font-semibold mb-8 ${accentColor} capitalize text-center`}
        >
          {decodeURIComponent(domain)}
        </h1>
        <div className="flex flex-col items-center space-y-4 mt-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
          <p className="text-gray-400">Loading countries...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10 flex flex-col items-center">
        <h1
          className={`text-3xl font-semibold mb-8 ${accentColor} capitalize text-center`}
        >
          {decodeURIComponent(domain)}
        </h1>
        <div className="text-center mt-16 max-w-2xl mx-auto px-4">
          <p className="text-red-400 mb-4">⚠️ Erreur de chargement</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition text-black font-semibold"
          >
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10">
      <div className="max-w-[90%] md:max-w-[80%] lg:max-w-[80%] mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb domain={domain} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${accentColor} capitalize`}
          >
            {decodeURIComponent(domain)} Armament
          </h1>
          <p className="text-gray-300 text-lg">
            Select a country to explore {decodeURIComponent(domain)} vehicle
            families
          </p>
        </div>

        {countries.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-gray-400 text-lg">
              No countries available for {decodeURIComponent(domain)} domain.
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="text-center mb-10">
              <p className="text-gray-400">
                {countries.length} countries •{" "}
                {countries.reduce((t, c) => t + c.familiesCount, 0)} families
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {countries.map((country) => (
                <Link
                  key={country.name}
                  href={`/${encodeURIComponent(domain)}/${encodeURIComponent(
                    country.name
                  )}`}
                  className="group block"
                >
                  <div
                    className={`bg-[#2a2a2a] border border-gray-600 rounded-lg p-6 h-full hover:bg-[#333] hover:border-yellow-400 transition-all duration-200 ${accentShadow}`}
                  >
                    <h3
                      className={`text-xl font-bold mb-3 ${accentColor} group-hover:text-yellow-300`}
                    >
                      {country.displayName}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {country.familiesCount} famille
                      {country.familiesCount > 1 ? "s" : ""}
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Exemples :
                      </p>
                      {country.preview.map((family, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
                          <span className="text-sm text-gray-300 truncate">
                            {family.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({family.type})
                          </span>
                        </div>
                      ))}
                      {country.familiesCount > 3 && (
                        <p className="text-xs text-gray-500 italic">
                          +{country.familiesCount - 3} autres...
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-600 group-hover:border-yellow-400 transition-colors">
                      <p className="text-sm text-gray-400 group-hover:text-yellow-400 transition-colors">
                        Explore →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Back navigation */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300 hover:text-white"
          >
            <span>←</span>
            <span>Back to all domains</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
