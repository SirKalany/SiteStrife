"use client";

import Link from "next/link";

function InfoRow({ label, value }) {
  if (!value) return null;
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

export default function AirContent({ content, domain, country }) {
  const specs = content?.specifications || {};

  const informations = specs["INFORMATIONS"] || {};
  const dimensions = specs["DIMENSIONS"] || {};
  const internalArmament = specs["INTERNAL ARMAMENT"] || [];
  const internalAmmo = specs["AVAILABLE INTERNAL AMMUNITION"] || [];
  const hardpointAmmo = specs["AVAILABLE HARDPOINTS AMMUNITION"] || [];
  const protection = specs["PROTECTION"] || {};
  const automotive = specs["AUTOMOTIVE"] || {};
  const avionics = specs["AVIONICS"] || [];
  const performances = specs["PERFORMANCES"] || {};

  return (
    <article className="max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-green-400 transition">Home</Link>
        <span>/</span>
        <Link href={`/${domain}`} className="hover:text-green-400 transition capitalize">{domain}</Link>
        <span>/</span>
        <Link href={`/${domain}/${country}`} className="hover:text-green-400 transition capitalize">{country}</Link>
        <span>/</span>
        {content.family && (
          <>
            <Link
              href={`/${domain}/${country}/${content.family}`}
              className="hover:text-green-400 transition"
            >
              {content.familyData?.title || content.family}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-green-400">{content.name}</span>
      </nav>

      {/* Header */}
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

      {/* Image */}
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

      {/* Description */}
      {content.description && (
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 text-lg leading-relaxed">{content.description}</p>
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

      {/* INTERNAL ARMAMENT */}
      {internalArmament.length > 0 && (
        <section>
          <SectionTitle>INTERNAL ARMAMENT</SectionTitle>
          <div className="space-y-4">
            {internalArmament.map((w, i) => (
              <div key={i} className="p-4 bg-[#181818] rounded border border-gray-700">
                <div className="text-sm text-gray-300 font-semibold mb-3">
                  {w.Name || `Weapon ${i + 1}`}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoRow label="Ammunition" value={w.Ammunition} />
                  <InfoRow label="Rate Of Fire" value={w["Rate Of Fire"]} />
                  <InfoRow label="Effective Range" value={w["Effective Range"]} />
                  <InfoRow label="Feed System" value={w["Feed System"]} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AVAILABLE INTERNAL AMMUNITION */}
      {internalAmmo.length > 0 && (
        <section>
          <SectionTitle>AVAILABLE INTERNAL AMMUNITION</SectionTitle>
          <div className="space-y-4">
            {internalAmmo.map((a, i) => (
              <div key={i} className="p-4 bg-[#181818] rounded border border-gray-700">
                <div className="text-sm text-gray-300 font-semibold mb-3">
                  {a.Name || `Ammo ${i + 1}`}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoRow label="Type" value={a.Type} />
                  <InfoRow label="Velocity" value={a.Velocity} />
                  <InfoRow label="Penetration" value={a.Penetration} />
                  <InfoRow label="Mass" value={a.Mass} />
                  <InfoRow label="Explosive Mass" value={a["Explosive Mass"]} />
                  <InfoRow label="TNT Equivalent" value={a["TNT Equivalent"]} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AVAILABLE HARDPOINTS AMMUNITION */}
      {hardpointAmmo.length > 0 && (
        <section>
          <SectionTitle>AVAILABLE HARDPOINTS AMMUNITION</SectionTitle>
          <div className="space-y-4">
            {hardpointAmmo.map((a, i) => (
              <div key={i} className="p-4 bg-[#181818] rounded border border-gray-700">
                <div className="text-sm text-gray-300 font-semibold mb-3">
                  {a.Name || `Hardpoint Ammo ${i + 1}`}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoRow label="Type" value={a.Type} />
                  <InfoRow label="Mass" value={a.Mass} />
                  <InfoRow label="Explosive Mass" value={a["Explosive Mass"]} />
                  <InfoRow label="TNT Equivalent" value={a["TNT Equivalent"]} />
                  <InfoRow label="Effective Range" value={a["Effective Range"]} />
                </div>
              </div>
            ))}
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

      {/* AVIONICS */}
      {avionics.length > 0 && (
        <section>
          <SectionTitle>AVIONICS</SectionTitle>
          <div className="space-y-4">
            {avionics.map((a, i) => (
              <div key={i} className="p-4 bg-[#181818] rounded border border-gray-700">
                <div className="text-sm text-gray-300 font-semibold mb-3">
                  {a.Name || `Avionic ${i + 1}`}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoRow label="Type" value={a.Type} />
                  <InfoRow label="Functions" value={a.Functions} />
                  <InfoRow label="Range" value={a.Range} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
          <h2 className="text-2xl font-semibold text-green-300 mb-4">Service History</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {content.service}
            </p>
          </div>
        </section>
      )}

      {/* Navigation */}
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
