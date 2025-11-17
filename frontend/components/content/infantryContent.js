"use client";

import Link from "next/link";
import ContentHeader from "@/components/contentHeader";
import InfoRow from "@/components/ui/infoRow";
import SectionTitle from "@/components/ui/sectionTitle";

export default function InfantryContent({ content, domain, country }) {
  const specs = content?.specifications || {};
  const informations = specs["INFORMATIONS"] || {};
  const dimensions = specs["DIMENSIONS"] || {};
  const mechanics = specs["MECHANICS"] || {};
  const performances = specs["PERFORMANCES"] || {};
  const service = specs["SERVICE"] || content.SERVICE;
  const users = specs["USERS"] || {};

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

      {/* MECHANICS */}
      <section>
        <SectionTitle>MECHANICS</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(mechanics).map(([k, v]) => (
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
          <h2 className="text-2xl font-semibold text-yellow-500 mb-4">
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
        {content.family && (
          <Link
            href={`/${domain}/${country}/${content.family}`}
            className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-700 hover:border-yellow-500 rounded-sm uppercase text-sm tracking-[0.2em] transition font-mono"
            style={{
              clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)",
            }}
          >
            <span>←</span>
            <span>Back to family</span>
          </Link>
        )}
      </div>
    </article>
  );
}
