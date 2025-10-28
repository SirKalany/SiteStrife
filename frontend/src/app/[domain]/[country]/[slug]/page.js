"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";

export default function FamilyPage({ params: rawParams }) {
  const params = use(rawParams);
  const { country, domain, slug } = params;

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State pour gérer l'ouverture des sections variantes
  const [openSections, setOpenSections] = useState({
    Model: false,
    Prototype: false,
    Modification: false,
  });

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

  const accentColor = "text-yellow-500";
  const accentShadow = "hover:shadow-yellow-500/20";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center font-mono">
        <div className="animate-spin h-10 w-10 border-2 border-yellow-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-400 mt-4 uppercase tracking-widest text-sm">
          Loading family...
        </p>
      </main>
    );
  }

  if (error) {
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
  }

  if (!content) return null;

  return (
    <main className="min-h-screen bg-[#121212] text-white px-6 py-12 tracking-tight">
      <div className="max-w-[90%] md:max-w-[85%] mx-auto space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb
          domain={domain}
          country={country}
          family={slug}
          familyTitle={content.title}
        />

        {/* Header */}
        <header className="text-center mb-12">
          <h1
            className={`text-5xl font-extrabold mb-3 ${accentColor} uppercase tracking-[0.2em]`}
          >
            {content.title}
          </h1>

          {/* Family picture */}
          {content.picture && (
            <img
              src={`http://localhost:4000${content.picture}`}
              alt={content.title}
              className="w-full h-auto max-w-3xl mx-auto rounded-lg shadow-lg object-cover"
            />
          )}
        </header>

        {/* Description */}
        {content.description && (
          <div className="prose prose-invert max-w-none text-center md:text-left">
            <p className="text-gray-300 text-lg leading-relaxed">
              {content.description}
            </p>
          </div>
        )}

        {/* History */}
        {content.history && (
          <section className="border-t border-gray-700 pt-6">
            <h2
              className={`text-2xl font-semibold ${accentColor} mb-4 flex items-center`}
            >
              <span className="w-1 h-6 bg-yellow-500 mr-3"></span>
              History
            </h2>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {content.history}
            </p>
          </section>
        )}

        {/* Variants */}
        {content.variants?.length > 0 && (
          <section className="border-t border-gray-700 pt-6 space-y-6">
            <h2
              className={`text-2xl font-semibold ${accentColor} mb-4 flex items-center`}
            >
              <span className="w-1 h-6 bg-yellow-500 mr-3"></span>
              Variants
            </h2>

            {["Model", "Prototype", "Modification"].map((type) => {
              const variantsOfType = content.variants.filter(
                (v) => v.type === type
              );
              if (!variantsOfType.length) return null;

              return (
                <details
                  key={type}
                  open={openSections[type]}
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      [type]: !prev[type],
                    }))
                  }
                  className="mb-4 bg-[#1e1e1e] border border-gray-700 rounded-sm overflow-hidden"
                >
                  <summary className="cursor-pointer select-none px-4 py-3 text-lg font-semibold bg-[#2a2a2a] hover:bg-[#333] transition flex justify-between items-center">
                    <span className={accentColor}>{type}s</span>
                    <span className="text-gray-400 text-sm">
                      {variantsOfType.length}
                    </span>
                  </summary>
                  <div className="divide-y divide-gray-700">
                    {variantsOfType.map((variant) => (
                      <Link
                        key={variant.slug}
                        href={`/${domain}/${country}/${slug}/${variant.slug}`}
                        className={`block px-4 py-3 hover:bg-[#333] transition`}
                      >
                        <h3 className="font-semibold text-yellow-500 text-base mb-1">
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
        <div className="text-center mt-16">
          <Link
            href={`/${domain}/${country}`}
            className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-700 hover:border-yellow-500 rounded-sm uppercase text-sm tracking-[0.2em] transition font-mono"
            style={{
              clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)",
            }}
          >
            <span>←</span>
            <span>Back to families</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
