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

export default function NavalContent({ content, domain, country }) {
  const specs = content?.specifications || {};

  const informations = specs["INFORMATIONS"] || {};
  const dimensions = specs["DIMENSIONS"] || {};
  const propulsion = specs["PROPULSION"] || {};
  const sensors = specs["SENSORS"] || [];
  const armaments = specs["ARMAMENTS"] || [];
  const aviationFacilities = specs["AVIATION FACILITIES"] || {};
  const service = specs["SERVICE"] || content.SERVICE;

  return (
    <article className="max-w-5xl mx-auto space-y-8">
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
        {informations.Name && (
          <span className="text-green-400">{informations.Name}</span>
        )}
      </nav>

      {/* Header */}
      <header className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="px-3 py-1 bg-blue-600 text-white text-sm tracking-wide">
            Ship
          </div>
          <div className="px-3 py-1 bg-gray-700 text-gray-300 text-sm capitalize">
            {domain}
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-green-400">
          {informations.Name}
        </h1>
        {content.picture && (
          <img
            src={content.picture}
            alt={informations.Name}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
        {content.description && (
          <p className="text-gray-300 text-lg">{content.description}</p>
        )}
      </header>

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

      {/* PROPULSION */}
      <section>
        <SectionTitle>PROPULSION</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(propulsion).map(([k, v]) => (
            <InfoRow key={k} label={k} value={v} />
          ))}
        </div>
      </section>

      {/* SENSORS */}
      {sensors.length > 0 && (
        <section>
          <SectionTitle>SENSORS</SectionTitle>
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
                  {Object.entries(s).map(([k, v]) => (
                    <InfoRow key={k} label={k} value={v} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ARMAMENTS */}
      {armaments.length > 0 && (
        <section>
          <SectionTitle>ARMAMENTS</SectionTitle>
          <div className="space-y-4">
            {armaments.map((a, i) => (
              <div
                key={i}
                className="p-4 bg-[#181818] rounded border border-gray-700"
              >
                <div className="text-sm text-gray-300 font-semibold mb-3">
                  {a.Name || `Armament ${i + 1}`}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(a).map(([k, v]) => (
                    <InfoRow key={k} label={k} value={v} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AVIATION FACILITIES */}
      {Object.keys(aviationFacilities).length > 0 && (
        <section>
          <SectionTitle>AVIATION FACILITIES</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(aviationFacilities).map(([k, v]) => (
              <InfoRow key={k} label={k} value={v} />
            ))}
          </div>
        </section>
      )}

      {/* SERVICE HISTORY */}
      {service && (
        <section>
          <SectionTitle>SERVICE HISTORY</SectionTitle>
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">
            {service}
          </p>
        </section>
      )}

      {/* Navigation */}
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
