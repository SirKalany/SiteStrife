"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function VehiclePage({ params }) {
  const { domain, country, slug } = use(params);

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // ⚡ Nouvelle API unifiée - elle détecte automatiquement famille vs modèle
        const contentRes = await fetch(
          `http://localhost:4000/${encodeURIComponent(
            domain
          )}/${encodeURIComponent(country)}/${encodeURIComponent(slug)}`
        );

        if (!contentRes.ok) {
          throw new Error(`Article ${slug} not found`);
        }

        const contentData = await contentRes.json();
        setContent(contentData);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [domain, country, slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-10 py-12 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col items-center space-y-4 mt-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            <p className="text-gray-400">Loading article...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-10 py-12 flex flex-col items-center">
        <div className="w-full max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">
            ⚠️ Article not found
          </h1>
          <p className="text-gray-400 mb-6">{error}</p>

          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
            >
              Retry
            </button>
            <Link
              href={`/${domain}/${country}`}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
            >
              Back to families
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!content) return null;

  // ⚡ Rendu "famille"
  if (content.kind === "family") {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-4 md:px-10 py-12">
        <article className="max-w-4xl mx-auto space-y-8">
          {/* Navigation breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-green-400 transition">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/${domain}`}
              className="hover:text-green-400 transition capitalize"
            >
              {domain}
            </Link>
            <span>/</span>
            <Link
              href={`/${domain}/${country}`}
              className="hover:text-green-400 transition capitalize"
            >
              {country}
            </Link>
            <span>/</span>
            <span className="text-green-400">{content.title}</span>
          </nav>

          {/* En-tête */}
          <header>
            <div className="flex items-center space-x-4 mb-4">
              <div className="px-3 py-1 bg-green-600 text-white text-sm rounded-full uppercase tracking-wide">
                Family
              </div>
              <div className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full capitalize">
                {domain}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
              {content.title}
            </h1>
          </header>

          {/* Description principale */}
          {content.description && (
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed">
                {content.description}
              </p>
            </div>
          )}

          {/* Histoire */}
          {content.history && (
            <section className="border-t border-gray-700 pt-6">
              <h2 className="text-2xl font-semibold text-green-300 mb-4 flex items-center">
                <span className="w-1 h-6 bg-green-400 mr-3"></span>
                History
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {content.history}
                </p>
              </div>
            </section>
          )}

          {/* Variantes/Modèles enrichis */}
          {(content.variants || content.models) && (
            <section className="border-t border-gray-700 pt-6">
              <h2 className="text-2xl font-semibold text-green-300 mb-6 flex items-center">
                <span className="w-1 h-6 bg-green-400 mr-3"></span>
                Variants & Models
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(content.variants || content.models || []).map((variant) => (
                  <Link
                    key={variant.slug || variant.id}
                    href={`/${domain}/${country}/${variant.slug || variant.id}`}
                    className="group block"
                  >
                    <div className="p-4 bg-[#2a2a2a] border border-gray-600 rounded-lg hover:bg-[#333] hover:border-green-400 transition-all duration-200">
                      {/* Image si disponible */}
                      {variant.picture && (
                        <div className="aspect-video w-full mb-3 overflow-hidden rounded">
                          <img
                            src={variant.picture}
                            alt={variant.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}

                      <h3 className="font-semibold text-green-400 group-hover:text-green-300 mb-2">
                        {variant.name}
                      </h3>

                      {variant.type && (
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                          {variant.type}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Model</span>
                        <span className="text-green-400 group-hover:text-green-300">
                          View →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
    );
  }

  // ⚡ Rendu "modèle"
  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-4 md:px-10 py-12">
      <article className="max-w-4xl mx-auto space-y-8">
        {/* Navigation breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-green-400 transition">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/${domain}`}
            className="hover:text-green-400 transition capitalize"
          >
            {domain}
          </Link>
          <span>/</span>
          <Link
            href={`/${domain}/${country}`}
            className="hover:text-green-400 transition capitalize"
          >
            {country}
          </Link>
          <span>/</span>
          {content.family && (
            <>
              <Link
                href={`/${domain}/${country}/${content.family}`}
                className="hover:text-green-400 transition"
              >
                {content.familyData?.title || content.family}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-green-400">{content.name}</span>
        </nav>

        {/* En-tête */}
        <header>
          <div className="flex items-center space-x-4 mb-6">
            <div
              className="px-3 py-1 bg-blue-600 text-white text-sm tracking-wide"
              style={{
                clipPath:
                  "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
              }}
            >
              Model
            </div>
            <div
              className="px-3 py-1 bg-gray-700 text-gray-300 text-sm capitalize"
              style={{
                clipPath:
                  "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
              }}
            >
              {domain}
            </div>
            {content.family && (
              <Link
                href={`/${domain}/${country}/${content.family}`}
                className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-sm rounded-full transition"
              >
                Family: {content.familyData?.title || content.family}
              </Link>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
            {content.name}
          </h1>
        </header>

        {/* Image principale */}
        {content.picture && (
          <div className="relative">
            <img
              src={content.picture}
              alt={content.name}
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Description */}
        {content.description && (
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 text-lg leading-relaxed">
              {content.description}
            </p>
          </div>
        )}

        {/* Spécifications */}
        {content.specifications && (
          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-green-300 mb-4 flex items-center">
              <span className="w-1 h-6 bg-green-400 mr-3"></span>
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(content.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between p-3 bg-[#2a2a2a] rounded-lg"
                >
                  <span className="text-gray-400 capitalize font-medium">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </span>
                  <span className="text-green-400 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Caractéristiques (format liste) */}
        {content.caracteristiques && (
          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-green-300 mb-4 flex items-center">
              <span className="w-1 h-6 bg-green-400 mr-3"></span>
              Characteristics
            </h2>
            <ul className="space-y-2">
              {content.caracteristiques.map((line, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-300">{line}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Design */}
        {content.design && (
          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-green-300 mb-4 flex items-center">
              <span className="w-1 h-6 bg-green-400 mr-3"></span>
              Design
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {content.design}
              </p>
            </div>
          </section>
        )}

        {/* Service */}
        {content.service && (
          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-green-300 mb-4 flex items-center">
              <span className="w-1 h-6 bg-green-400 mr-3"></span>
              Service History
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {content.service}
              </p>
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="border-t border-gray-700 pt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href={`/${domain}/${country}`}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300 hover:text-white"
          >
            ← Back to families
          </Link>

          {content.family && (
            <Link
              href={`/${domain}/${country}/${content.family}`}
              className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg transition text-white"
            >
              View family: {content.familyData?.title || content.family}
            </Link>
          )}

          <Link
            href="/"
            className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg transition text-white"
          >
            🏠 Home
          </Link>
        </div>
      </article>
    </main>
  );
}
