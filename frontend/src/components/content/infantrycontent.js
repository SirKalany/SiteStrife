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

export default function InfantryContent({ content, domain, country }) {
  const specs = content?.specifications || {};

  const informations = specs["INFORMATIONS"] || {};
  const dimensions = specs["DIMENSIONS"] || {};
  const mechanics = specs["MECHANICS"] || {};
  const performances = specs["PERFORMANCES"] || {};

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
        <span className="text-green-400">
          {informations.Name || content.title}
        </span>
      </nav>

      {/* Header */}
      <header className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="px-3 py-1 bg-blue-600 text-white text-sm tracking-wide">
            Infantry
          </div>
          <div className="px-3 py-1 bg-gray-700 text-gray-300 text-sm capitalize">
            {domain}
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-green-400">
          {informations.Name || content.title}
        </h1>
        {content.picture && (
          <img
            src={content.picture}
            alt={content.name}
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
