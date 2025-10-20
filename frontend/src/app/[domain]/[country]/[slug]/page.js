"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function FamilyPage({ params: rawParams }) {
  // Unwrap des params avec React.use() pour Next.js 14+
  const params = use(rawParams);
  const { country, domain, slug } = params;

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:4000/countries/${encodeURIComponent(
            country
          )}/${encodeURIComponent(domain)}/${encodeURIComponent(slug)}`
        );

        if (!res.ok) throw new Error(`Famille "${slug}" introuvable`);

        const data = await res.json();
        setContent(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [country, domain, slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-green-400 rounded-full mb-4"></div>
        <p className="text-gray-400">Loading family...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-400 mb-4">⚠️ Error</h1>
        <p className="text-gray-400 mb-6">{error}</p>
        <Link
          href={`/${domain}/${country}`}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition"
        >
          Back to families
        </Link>
      </main>
    );
  }

  if (!content) return null;

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-6 md:px-10 py-12">
      <article className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
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

        {/* Header */}
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

        {/* Description */}
        {content.description && (
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 text-lg leading-relaxed">
              {content.description}
            </p>
          </div>
        )}

        {/* History */}
        {content.history && (
          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-green-300 mb-4 flex items-center">
              <span className="w-1 h-6 bg-green-400 mr-3"></span>
              History
            </h2>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {content.history}
            </p>
          </section>
        )}

        {/* Variants */}
        {content.variants && content.variants.length > 0 && (
          console.log("Variants data:", content.variants),
          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-green-300 mb-4 flex items-center">
              <span className="w-1 h-6 bg-green-400 mr-3"></span>
              Variants
            </h2>

            {/* Group variants by type */}
            {["Model", "Prototype", "Modification"].map((type) => {
              const variantsOfType = content.variants.filter(
                (v) => v.type === type
              );

              if (variantsOfType.length === 0) return null;

              return (
                <details
                  key={type}
                  className="mb-6 bg-[#222] border border-gray-700 rounded-lg overflow-hidden"
                  open
                >
                  <summary className="cursor-pointer select-none px-4 py-3 text-lg font-semibold text-green-400 bg-[#2a2a2a] hover:bg-[#333] transition flex justify-between items-center">
                    {type}s
                    <span className="text-gray-400 text-sm">
                      {variantsOfType.length}
                    </span>
                  </summary>

                  <div className="divide-y divide-gray-700">
                    {variantsOfType.map((variant) => (
                      <Link
                        key={variant.slug}
                        href={`/${domain}/${country}/${slug}/${variant.slug}`}
                        className="block px-4 py-3 hover:bg-[#333] transition"
                      >
                        <h3 className="font-semibold text-green-300 text-base mb-1">
                          {variant.name}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {variant.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </details>
              );
            })}
          </section>
        )}

        {/* Navigation back */}
        <div className="border-t border-gray-700 pt-8 flex gap-4 flex-wrap justify-center">
          <Link
            href={`/${domain}/${country}`}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition"
          >
            ← Back to families
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded text-white transition"
          >
            Home
          </Link>
        </div>
      </article>
    </main>
  );
}
