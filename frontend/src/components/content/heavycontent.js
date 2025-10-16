"use client";

import Link from "next/link";
import ContentHeader from "@/components/ContentHeader";
import InfoRow from "@/components/ui/InfoRow";
import SectionTitle from "@/components/ui/SectionTitle";

export default function HeavyContent({ content, domain, country }) {
  const specs = content?.specifications || {};
  const informations = specs["INFORMATIONS"] || {};
  const dimensions = specs["DIMENSIONS"] || {};
  const performances = specs["PERFORMANCES"] || {};
  const service = specs["SERVICE"] || content.SERVICE;

  return (
    <article className="max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <ContentHeader content={content} domain={domain} country={country} />

      {/* INFORMATIONS */}
      <section>
        <SectionTitle>INFORMATIONS</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(informations).map(([k, v]) => (
            <InfoRow key={k} label={k} value={v} />
          ))}
        </div>
      </section>

      {/* DIMENSIONS */}
      <section>
        <SectionTitle>DIMENSIONS</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(dimensions).map(([k, v]) => (
            <InfoRow key={k} label={k} value={v} />
          ))}
        </div>
      </section>

      {/* PERFORMANCES */}
      <section>
        <SectionTitle>PERFORMANCES</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(performances).map(([k, v]) => (
            <InfoRow key={k} label={k} value={v} />
          ))}
        </div>
      </section>

      {/* SERVICE */}
      {service && (
        <section className="border-t border-gray-700 pt-6">
          <h2 className="text-2xl font-semibold text-green-300 mb-4">
            Service History
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {service}
            </p>
          </div>
        </section>
      )}

      {/* USERS */}
      {users.length > 0 && (
        <section>
          <SectionTitle>USERS</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {users.map((user, index) => (
              <InfoRow
                key={index}
                label={user.Country}
                value={user.Description}
              />
            ))}
          </div>
        </section>
      )}

      {/* NAVIGATION */}
      <div className="border-t border-gray-700 pt-8 flex flex-wrap gap-4 justify-center">
        <Link
          href={`/${domain}/${country}`}
          className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg transition text-white"
        >
          ← Back to {country}
        </Link>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg transition text-white"
        >
          Home
        </Link>
      </div>
    </article>
  );
}
