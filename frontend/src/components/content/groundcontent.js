"use client";

import Link from "next/link";

function InfoRow({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex justify-between items-start p-3 bg-[#1f1f1f] rounded">
      <div className="text-sm text-gray-300 font-medium">{label}</div>
      <div className="text-sm text-green-300 text-right">{value}</div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-sm tracking-widest text-gray-400 uppercase mb-3">
      {children}
    </h3>
  );
}

export default function GroundContent({ content, domain, country }) {
  const specs = content?.specifications || {};

  const informations = specs["INFORMATIONS"] || {};
  const dimensions = specs["DIMENSIONS"] || {};
  const sensors = specs["SENSORS"] || [];
  const armament = specs["ARMAMENT"] || {};
  const protection = specs["PROTECTION"] || {};
  const automotive = specs["AUTOMOTIVE"] || {};
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
      {/* BREADCRUM */}
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
        <span className="text-green-400">{content.title || content.name}</span>
      </nav>

      {/* HEADER */}
      <header className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="px-3 py-1 bg-blue-600 text-white text-sm tracking-wide">
            Model
          </div>
          <div className="px-3 py-1 bg-gray-700 text-gray-300 text-sm capitalize">
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

      {/* IMAGE */}
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

      {/* DESCRIPTION */}
      {content.description && (
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 text-lg leading-relaxed">
            {content.description}
          </p>
        </div>
      )}

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
      <section>
        <SectionTitle>PROTECTION</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(protection).map(([k, v]) => (
            <InfoRow key={k} label={k} value={v} />
          ))}
        </div>
      </section>

      {/* AUTOMOTIVE */}
      <section>
        <SectionTitle>AUTOMOTIVE</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(automotive).map(([k, v]) => (
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
