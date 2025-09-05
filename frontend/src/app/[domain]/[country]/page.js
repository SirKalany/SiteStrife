"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

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

        // ⚡ Récupérer les familles pour ce pays/domaine
        // Nouveau format: /domain/country
        const res = await fetch(
          `http://localhost:4000/${encodeURIComponent(domain)}/${encodeURIComponent(country)}`
        );
        
        if (!res.ok) {
          throw new Error(`Failed to load families for ${country}/${domain}`);
        }

        const familiesData = await res.json();
        setFamilies(familiesData);
      } catch (err) {
        console.error("Erreur lors du chargement des familles:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFamilies();
  }, [domain, country]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-8 text-green-400 capitalize">
            {decodeURIComponent(country)} - {decodeURIComponent(domain)}
          </h1>
          
          <div className="flex flex-col items-center space-y-4 mt-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            <p className="text-gray-400">Loading vehicle families...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-8 text-green-400 capitalize">
            {decodeURIComponent(country)} - {decodeURIComponent(domain)}
          </h1>
          
          <div className="text-center mt-16">
            <p className="text-red-400 mb-4">⚠️ Erreur de chargement</p>
            <p className="text-gray-400 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition mr-4"
            >
              Réessayer
            </button>
            <Link 
              href={`/${domain}`}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
            >
              Retour aux pays
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10">
      {/* En-tête */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Link 
            href="/" 
            className="text-gray-400 hover:text-green-400 transition"
          >
            Home
          </Link>
          <span className="text-gray-600">/</span>
          <Link 
            href={`/${domain}`}
            className="text-gray-400 hover:text-green-400 transition capitalize"
          >
            {decodeURIComponent(domain)}
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-green-400 capitalize font-medium">
            {decodeURIComponent(country)}
          </span>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-green-400">
          {decodeURIComponent(country).charAt(0).toUpperCase() + decodeURIComponent(country).slice(1)}
        </h1>
        <h2 className="text-2xl text-gray-300 capitalize mb-2">
          {decodeURIComponent(domain)} Vehicle Families
        </h2>
        <p className="text-gray-400">
          {families.length} famille{families.length > 1 ? 's' : ''} disponible{families.length > 1 ? 's' : ''}
        </p>
      </div>

      {families.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-gray-400 text-lg mb-6">
            No vehicle families found for {decodeURIComponent(country)} in {decodeURIComponent(domain)} domain.
          </p>
          <Link 
            href={`/${domain}`}
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition"
          >
            ← Back to countries
          </Link>
        </div>
      ) : (
        <>
          {/* Grille des familles */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {families.map((family) => (
              <Link
                key={family.id || family.slug}
                href={`/${encodeURIComponent(domain)}/${encodeURIComponent(country)}/${encodeURIComponent(family.slug)}`}
                className="group block"
              >
                <div className="bg-[#2a2a2a] border border-gray-600 rounded-lg overflow-hidden h-full hover:bg-[#333] hover:border-green-400 transition-all duration-200 hover:shadow-lg hover:shadow-green-400/20">
                  {/* Image */}
                  {family.picture && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={family.picture}
                        alt={family.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/placeholder-vehicle.jpg'; // fallback image
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Contenu */}
                  <div className="p-6">
                    {/* Nom */}
                    <h3 className="text-xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors">
                      {family.name}
                    </h3>
                    
                    {/* Type */}
                    {family.type && (
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-400 uppercase tracking-wide">
                          {family.type}
                        </span>
                      </div>
                    )}
                    
                    {/* Caption/Description courte */}
                    {family.caption && (
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {family.caption}
                      </p>
                    )}
                    
                    {/* Indicateur */}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        Vehicle Family
                      </span>
                      <span className="text-sm text-gray-400 group-hover:text-green-400 transition-colors">
                        Learn more →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center space-x-4 mt-12">
            <Link 
              href={`/${domain}`}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300 hover:text-white"
            >
              <span>←</span>
              <span>Back to countries</span>
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg transition text-white"
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}