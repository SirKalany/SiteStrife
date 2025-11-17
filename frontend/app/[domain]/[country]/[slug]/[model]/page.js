"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import GroundContent from "@/components/content/groundContent";
import AirContent from "@/components/content/airContent";
import NavalContent from "@/components/content/navalContent";
import HeavyContent from "@/components/content/heavyContent";
import InfantryContent from "@/components/content/infantryContent";

export default function ModelPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
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
      <main className="min-h-screen bg-[#1b1b1b] text-white flex items-center justify-center px-4 py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center px-4 py-10">
        <h1 className="text-2xl text-red-400 mb-4">{error}</h1>
        <p className="text-gray-400">
          Return to{" "}
          <a
            href={`/${domain}/${country}/${slug}`}
            className="text-yellow-400 underline"
          >
            family page
          </a>
        </p>
      </main>
    );

  if (!content) return null;

  // Sélection dynamique du component selon le domain
  const renderContent = () => {
    switch (domain) {
      case "ground":
        return (
          <GroundContent content={content} domain={domain} country={country} />
        );
      case "air":
        return (
          <AirContent content={content} domain={domain} country={country} />
        );
      case "naval":
        return (
          <NavalContent content={content} domain={domain} country={country} />
        );
      case "heavy":
        return (
          <HeavyContent content={content} domain={domain} country={country} />
        );
      case "infantry":
        return (
          <InfantryContent content={content} domain={domain} country={country} />
        );
      default:
        return (
          <GroundContent content={content} domain={domain} country={country} />
        );
    }
  };

  return (
    <main className="min-h-screen bg-[#121212] text-white px-4 py-10">
      <div className="max-w-[90%] md:max-w-[70%] lg:max-w-[80%] mx-auto">
        {renderContent()}
      </div>
    </main>
  );
}
