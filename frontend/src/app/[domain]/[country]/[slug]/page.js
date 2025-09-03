"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function VehiclePage({ params }) {
  const { domain, country, slug } = use(params);

  const [item, setItem] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Métadonnées des véhicules du pays/domain
        const metaRes = await fetch(
          `http://localhost:4000/${country}/${domain}`
        );
        if (!metaRes.ok) throw new Error("Failed to load vehicle list");
        const meta = await metaRes.json();
        const foundItem = meta.find((x) => x.slug === slug);
        if (!foundItem) throw new Error("Vehicle not found");
        setItem(foundItem);

        // Contenu détaillé
        const contentRes = await fetch(
          `http://localhost:4000/${country}/${domain}/${slug}`
        );
        if (!contentRes.ok) throw new Error("Failed to load vehicle content");
        setContent(await contentRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [domain, country, slug]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!item || !content) return null;

  // ⚡ Rendu "famille"
  if (content.kind === "family") {
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-10 py-12 flex flex-col items-center">
        <article className="w-full max-w-4xl space-y-8">
          <h1 className="text-4xl font-bold text-green-400">{content.title}</h1>

          {content.description && (
            <p className="text-gray-300">{content.description}</p>
          )}

          {content.history && (
            <section className="border-t border-gray-700 pt-4 mt-6">
              <h2 className="text-2xl text-green-300 mb-2">History</h2>
              <p className="text-gray-300 whitespace-pre-line">
                {content.history}
              </p>
            </section>
          )}

          {content.variants && (
            <section className="border-t border-gray-700 pt-4 mt-6">
              <h2 className="text-2xl text-green-300 mb-2">Variants</h2>
              <ul className="flex flex-wrap gap-4">
                {content.variants.map((v) => (
                  <li key={v.slug}>
                    <Link
                      href={`/${domain}/${country}/${v.slug}`}
                      className="px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded hover:bg-[#333] text-green-400"
                    >
                      {v.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>
    );
  }

  // ⚡ Rendu "modèle"
  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-10 py-12 flex flex-col items-center">
      <article className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-green-400">
          {item.name || item.nom}
        </h1>

        {item.picture && (
          <img
            src={item.picture}
            alt={item.name || item.nom}
            className="w-full h-64 object-cover rounded shadow mx-auto"
          />
        )}

        {content.description && (
          <p className="text-gray-300">{content.description}</p>
        )}

        {content.caracteristiques && (
          <section className="border-t border-gray-700 pt-4 mt-6">
            <h2 className="text-2xl text-green-300 mb-2">Specifications</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {content.caracteristiques.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </section>
        )}

        {content.design && (
          <section className="border-t border-gray-700 pt-4 mt-6">
            <h2 className="text-2xl text-green-300 mb-2">Design</h2>
            <p className="text-gray-300 whitespace-pre-line">
              {content.design}
            </p>
          </section>
        )}

        {content.service && (
          <section className="border-t border-gray-700 pt-4 mt-6">
            <h2 className="text-2xl text-green-300 mb-2">Service</h2>
            <p className="text-gray-300 whitespace-pre-line">
              {content.service}
            </p>
          </section>
        )}
      </article>
    </main>
  );
}
