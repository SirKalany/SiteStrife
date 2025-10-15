"use client";

import Link from "next/link";
import ContentHeader from "@/components/ContentHeader";
import InfoRow from "@/components/InfoRow";
import SectionTitle from "@/components/SectionTitle";

export default function AirContent({ content, domain, country }) {
  const specs = content?.specifications || {};
  const informations = specs["INFORMATIONS"] || {};
  const dimensions = specs["DIMENSIONS"] || {};
  const armament = specs["ARMAMENT"] || {};
  const protection = specs["PROTECTION"] || {};
  const automotive = specs["AUTOMOTIVE"] || {};
  const avionics = specs["AVIONICS"] || [];
  const performances = specs["PERFORMANCES"] || {};

  const renderArmamentCategory = (title, list) => {
    if (!list || list.length === 0) return null;
    return (
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-blue-400 mb-2">{title}</h4>
        {list.map((a, i) => (
          <div
            key={i}
            className="p-4 bg-[#181818] rounded border border-gray-700"
          >
            <div className="text-sm text-gray-300 font-semibold mb-3">
              {a.Name || `${title.slice(0, -1)} ${i + 1}`}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(a)
                .filter(([_, v]) => v && v !== "")
                .map(([k, v]) => (
                  <InfoRow key={k} label={k} value={v} />
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <article className="max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <ContentHeader content={content} domain={domain} country={country} />

      {/* INFORMATIONS */}
      {Object.keys(informations).length > 0 && (
        <section>
          <SectionTitle>INFORMATIONS</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(informations).map(([k, v]) => (
              <InfoRow key={k} label={k} value={v} />
            ))}
          </div>
        </section>
      )}

      {/* DIMENSIONS */}
      {Object.keys(dimensions).length > 0 && (
        <section>
          <SectionTitle>DIMENSIONS</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(dimensions).map(([k, v]) => (
              <InfoRow key={k} label={k} value={v} />
            ))}
          </div>
        </section>
      )}

      {/* ARMAMENT */}
      {(armament.Guns?.length > 0 ||
        armament.Rockets?.length > 0 ||
        armament.Missiles?.length > 0 ||
        armament.Bombs?.length > 0 ||
        armament.Others?.length > 0) && (
        <section>
          <SectionTitle>ARMAMENT</SectionTitle>
          <div className="space-y-6">
            {renderArmamentCategory("Guns", armament.Guns)}
            {renderArmamentCategory("Rockets", armament.Rockets)}
            {renderArmamentCategory("Missiles", armament.Missiles)}
            {renderArmamentCategory("Bombs", armament.Bombs)}
            {renderArmamentCategory("Others", armament.Others)}
          </div>
        </section>
      )}

      {/* PROTECTION */}
      {Object.keys(protection).length > 0 && (
        <section>
          <SectionTitle>PROTECTION</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(protection).map(([k, v]) => (
              <InfoRow key={k} label={k} value={v} />
            ))}
          </div>
        </section>
      )}

      {/* AUTOMOTIVE */}
      {Object.keys(automotive).length > 0 && (
        <section>
          <SectionTitle>AUTOMOTIVE</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(automotive).map(([k, v]) => (
              <InfoRow key={k} label={k} value={v} />
            ))}
          </div>
        </section>
      )}

      {/* AVIONICS */}
      {avionics.length > 0 && (
        <section>
          <SectionTitle>AVIONICS</SectionTitle>
          <div className="space-y-4">
            {avionics.map((a, i) => (
              <div
                key={i}
                className="p-4 bg-[#181818] rounded border border-gray-700"
              >
                <div className="text-sm text-gray-300 font-semibold mb-3">
                  {a.Name || `Avionic ${i + 1}`}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(a)
                    .filter(([_, v]) => v && v !== "")
                    .map(([k, v]) => (
                      <InfoRow key={k} label={k} value={v} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PERFORMANCES */}
      {Object.keys(performances).length > 0 && (
        <section>
          <SectionTitle>PERFORMANCES</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(performances).map(([k, v]) => (
              <InfoRow key={k} label={k} value={v} />
            ))}
          </div>
        </section>
      )}

      {/* SERVICE */}
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

      {/* USERS */}
      {content.users && (
        <section className="border-t border-gray-700 pt-6">
          <h2 className="text-2xl font-semibold text-green-300 mb-4">Users</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {content.users}
            </p>
          </div>
        </section>
      )}

      {/* NAVIGATION */}
      <div className="border-t border-gray-700 pt-8 flex flex-wrap gap-4 justify-center">
        {content.family && (
          <Link
            href={`/${domain}/${country}/${content.family}`}
            className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg transition text-white"
          >
            ← Back to family
          </Link>
        )}
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
