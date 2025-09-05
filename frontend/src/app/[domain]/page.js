"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DomainPage({ params }) {
  const { domain } = use(params);

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCountriesWithContent() {
      try {
        setLoading(true);
        setError(null);

        // ⚡ Récupérer tous les pays disponibles
        const countriesRes = await fetch(`http://localhost:4000/countries`);
        if (!countriesRes.ok) {
          throw new Error("Impossible de charger les pays");
        }
        const allCountries = await countriesRes.json();

        // ⚡ Vérifier quels pays ont du contenu pour ce domaine
        const countriesWithContent = [];
        
        for (const country of allCountries) {
          try {
            const checkRes = await fetch(
              `http://localhost:4000/${encodeURIComponent(domain)}/${encodeURIComponent(country)}`
            );
            
            if (checkRes.ok) {
              const families = await checkRes.json();
              if (families && families.length > 0) {
                countriesWithContent.push({
                  name: country,
                  displayName: country.charAt(0).toUpperCase() + country.slice(1),
                  familiesCount: families.length,
                  // Prendre quelques familles pour un aperçu
                  preview: families.slice(0, 3)
                });
              }
            }
          } catch (countryError) {
            // Si un pays spécifique échoue, on continue avec les autres
            console.warn(`Erreur pour le pays ${country}:`, countryError.message);
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

    fetchCountriesWithContent();
  }, [domain]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-semibold mb-8 text-green-400 capitalize">
          {decodeURIComponent(domain)}
        </h1>
        
        <div className="flex flex-col items-center space-y-4 mt-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <p className="text-gray-400">Loading countries...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-semibold mb-8 text-green-400 capitalize">
          {decodeURIComponent(domain)}
        </h1>
        
        <div className="text-center mt-16">
          <p className="text-red-400 mb-4">⚠️ Erreur de chargement</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
          >
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-4 py-10">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-green-400 capitalize">
          {decodeURIComponent(domain)} Armament
        </h1>
        <p className="text-gray-300 text-lg">
          Select a country to explore {decodeURIComponent(domain)} vehicle families
        </p>
      </div>

      {countries.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-gray-400 text-lg">
            No countries available for {decodeURIComponent(domain)} domain.
          </p>
          <Link 
            href="/" 
            className="inline-block mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition"
          >
            ← Back to domains
          </Link>
        </div>
      ) : (
        <>
          {/* Stats rapides */}
          <div className="text-center mb-8">
            <p className="text-gray-400">
              {countries.length} countries • {' '}
              {countries.reduce((total, country) => total + country.familiesCount, 0)} families
            </p>
          </div>

          {/* Grille des pays */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.map((country) => (
              <Link
                key={country.name}
                href={`/${encodeURIComponent(domain)}/${encodeURIComponent(country.name)}`}
                className="group block"
              >
                <div className="bg-[#2a2a2a] border border-gray-600 rounded-lg p-6 h-full hover:bg-[#333] hover:border-green-400 transition-all duration-200 hover:shadow-lg hover:shadow-green-400/20">
                  {/* Nom du pays */}
                  <h3 className="text-xl font-bold text-green-400 mb-3 group-hover:text-green-300">
                    {country.displayName}
                  </h3>
                  
                  {/* Stats */}
                  <p className="text-gray-400 mb-4">
                    {country.familiesCount} famille{country.familiesCount > 1 ? 's' : ''}
                  </p>
                  
                  {/* Aperçu des familles */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Exemples :
                    </p>
                    {country.preview.map((family, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
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
                  
                  {/* Indicateur hover */}
                  <div className="mt-4 pt-4 border-t border-gray-600 group-hover:border-green-400 transition-colors">
                    <p className="text-sm text-gray-400 group-hover:text-green-400 transition-colors">
                      Explore →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      
      {/* Navigation retour */}
      <div className="text-center mt-12">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300 hover:text-white"
        >
          <span>←</span>
          <span>Back to all domains</span>
        </Link>
      </div>
    </main>
  );
}