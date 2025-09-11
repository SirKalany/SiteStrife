"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ModelPage({ params: paramsPromise }) {
  const params = use(paramsPromise); // unwrap la Promise
  const { country, domain, slug, model } = params;

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:4000/countries/${country}/${domain}/${slug}/${model}`
        );

        if (!res.ok) {
          throw new Error(`Model ${model} not found`);
        }

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
  }, [country, domain, slug, model]);

  if (loading)
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-10 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-400"></div>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-10 py-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl text-red-400 mb-4">⚠️ {error}</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-600"
        >
          🏠 Home
        </Link>
      </main>
    );

  if (!content) return null;

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-4 md:px-10 py-12">
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

        {/* Header */}
        <header className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
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
          <h1 className="text-4xl md:text-5xl font-bold text-green-400">
            {content.name}
          </h1>
        </header>

        {/* Image */}
        {content.picture && (
          <div className="relative">
            <img
              src={content.picture}
              alt={content.name}
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              onError={(e) => (e.target.style.display = "none")}
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

        {/* Specifications */}
        {content.specifications && (
          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-green-300 mb-4">
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

        {/* Service */}
        {content.service && (
          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-green-300 mb-4">
              Service History
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {content.service}
              </p>
            </div>
          </section>
        )}

        {/* Navigation buttons */}
        <div className="border-t border-gray-700 pt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href={`/${domain}/${country}/${content.family}`}
            className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg transition text-white"
          >
            ← Back to family
          </Link>

          <Link
            href="/"
            className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg transition text-white"
          >
            Home
          </Link>
        </div>
      </article>
    </main>
  );
}
