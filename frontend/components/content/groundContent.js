"use client";

import Link from "next/link";
import ContentHeader from "@/components/contentHeader";
import InfoRow from "@/components/ui/infoRow";
import SectionTitle from "@/components/ui/sectionTitle";

export default function GroundContent({ content, domain, country }) {
  const specs = content?.specifications || {};
  const informations = specs["INFORMATIONS"] || {};
  const dimensions = specs["DIMENSIONS"] || {};
  const sensors = specs["SENSORS"] || [];
  const armament = specs["ARMAMENT"] || {};
  const protection = specs["PROTECTION"] || {};
  const automotive = specs["AUTOMOTIVE"] || {};
  const performances = specs["PERFORMANCES"] || {};
  const users = specs["USERS"] || [];
  const service = specs["SERVICE"] || [];

  const renderArmamentCategory = (title, list) => {
    if (!list || list.length === 0) return null;
    return (
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-yellow-500 mb-2">{title}</h4>
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

      {/* SENSORS */}
      {sensors.length > 0 && (
        <section>
          <SectionTitle>SENSORS & ELECTRONICS</SectionTitle>
          <div className="space-y-4">
            {sensors.map((s, i) => (
              <div
                key={i}
                className="p-4 bg-[#181818] rounded border border-gray-700"
              >
                <div className="text-sm text-gray-300 font-semibold mb-3">
                  {s.Name || `Sensor ${i + 1}`}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoRow label="Type" value={s.Type} />
                  <InfoRow label="Purpose" value={s.Purpose} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ARMAMENT */}
      {(armament.Guns?.length > 0 ||
        armament.Rockets?.length > 0 ||
        armament.Missiles?.length > 0 ||
        armament.Others?.length > 0) && (
        <section>
          <SectionTitle>ARMAMENT</SectionTitle>
          <div className="space-y-6">
            {renderArmamentCategory("Guns", armament.Guns)}
            {renderArmamentCategory("Rockets", armament.Rockets)}
            {renderArmamentCategory("Missiles", armament.Missiles)}
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
      {service && (
        <section className="border-t border-gray-700 pt-6">
          <h2 className="text-2xl font-semibold text-yellow-500 mb-4 flex items-center">
            <span className="w-1 h-6 bg-yellow-500 mr-3"></span>
            Service History
          </h2>
          <p className="text-gray-300 whitespace-pre-line leading-relaxed text-justify">
            {service.replace(/\\n/g, "\n")}
          </p>
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
