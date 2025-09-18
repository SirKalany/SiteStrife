"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import GroundContent from "@/components/content/groundcontent";
import AirContent from "@/components/content/aircontent";
import NavalContent from "@/components/content/navalcontent";
import HeavyContent from "@/components/content/heavycontent";
import InfantryContent from "@/components/content/infantrycontent";

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
      <main className="min-h-screen bg-[#1b1b1b] text-white px-10 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-400"></div>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen bg-[#1b1b1b] text-white px-10 py-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl text-red-400 mb-4">{error}</h1>
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
    <main className="min-h-screen bg-[#1b1b1b] text-white px-4 md:px-10 py-12">
      {renderContent()}
    </main>
  );
}
