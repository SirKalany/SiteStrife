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
  const protection = specs["PROTECTION"] || {};
  const automotive = specs["AUTOMOTIVE"] || {};
  const performances = specs["PERFORMANCES"] || {};
  const armament = specs["ARMAMENT"] || specs["Armament"] || {};
  const ammo =
    specs["AVAILABLE AMMUNITION"] || specs["Available Ammunition"] || [];

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
        <span className="text-green-400">{content.title || content.name}</span>
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
          {content.name || content.title}
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
          <InfoRow
            label="Name"
            value={informations.Name || content.name || content.title}
          />
          <InfoRow label="Type" value={informations.Type} />
          <InfoRow label="Manufacturer" value={informations.Manufacturer} />
          <InfoRow
            label="Design Period"
            value={informations["Design Period"]}
          />
          <InfoRow
            label="Manufacturing Period"
            value={informations["Manufacturing Period"]}
          />
          <InfoRow
            label="Service Period"
            value={informations["Service Period"]}
          />
        </div>
      </section>

      {/* DIMENSIONS */}
      <section>
        <SectionTitle>DIMENSIONS</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoRow label="Mass" value={dimensions.Mass} />
          <InfoRow label="Crew" value={dimensions.Crew} />
          <InfoRow
            label="Ground Clearance"
            value={dimensions["Ground Clearance"]}
          />
          <InfoRow
            label="Ground Pressure"
            value={
              dimensions["Ground Preassure"] || dimensions["Ground Pressure"]
            }
          />
          <InfoRow label="Length" value={dimensions.Length} />
          <InfoRow
            label="Barrel Overhang"
            value={dimensions["Barrel Overhang"]}
          />
          <InfoRow label="Width" value={dimensions.Width} />
          <InfoRow label="Height" value={dimensions.Height} />
        </div>
      </section>

      {/* ARMAMENT */}
      <section>
        <SectionTitle>ARMAMENT</SectionTitle>

        {armament.Primary && (
          <div className="mb-6 p-4 bg-[#181818] rounded border border-gray-700">
            <div className="text-sm text-gray-300 font-semibold mb-3">
              Primary Armament
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow label="Name" value={armament.Primary.Name} />
              <InfoRow label="Ammunition" value={armament.Primary.Ammunition} />
              <InfoRow
                label="Vertical Guidance"
                value={armament.Primary["Vertical Guidance"]}
              />
              <InfoRow
                label="Horizontal Guidance"
                value={armament.Primary["Horizontal Guidance"]}
              />
              <InfoRow label="Optics" value={armament.Primary.Optics} />
              <InfoRow label="Stabilizer" value={armament.Primary.Stabilizer} />
            </div>
          </div>
        )}

        {armament.Secondary && (
          <>
            <div className="text-sm text-gray-300 font-semibold mb-3">
              Secondary Armament
            </div>
            {Array.isArray(armament.Secondary) ? (
              armament.Secondary.map((sec, i) => (
                <div
                  key={i}
                  className="mb-4 p-4 bg-[#181818] rounded border border-gray-700"
                >
                  <div className="text-sm text-gray-400 font-semibold mb-2">
                    {sec.Name}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoRow label="Name" value={sec.Name} />
                    <InfoRow label="Ammunition" value={sec.Ammunition} />
                    <InfoRow
                      label="Vertical Guidance"
                      value={sec["Vertical Guidance"]}
                    />
                    <InfoRow
                      label="Horizontal Guidance"
                      value={sec["Horizontal Guidance"]}
                    />
                    <InfoRow label="Optics" value={sec.Optics} />
                    <InfoRow label="Stabilizer" value={sec.Stabilizer} />
                  </div>
                </div>
              ))
            ) : (
              <div className="mb-4 p-4 bg-[#181818] rounded border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoRow label="Name" value={armament.Secondary.Name} />
                  <InfoRow
                    label="Ammunition"
                    value={armament.Secondary.Ammunition}
                  />
                  <InfoRow
                    label="Vertical Guidance"
                    value={armament.Secondary["Vertical Guidance"]}
                  />
                  <InfoRow
                    label="Horizontal Guidance"
                    value={armament.Secondary["Horizontal Guidance"]}
                  />
                  <InfoRow label="Optics" value={armament.Secondary.Optics} />
                  <InfoRow
                    label="Stabilizer"
                    value={armament.Secondary.Stabilizer}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* AVAILABLE AMMUNITION */}
      {ammo && ammo.length > 0 && (
        <section>
          <SectionTitle>AVAILABLE AMMUNITION</SectionTitle>
          <div className="space-y-4">
            {ammo.map((a, i) => (
              <div
                key={i}
                className="p-4 bg-[#181818] rounded border border-gray-700"
              >
                <div className="text-sm text-gray-300 font-semibold mb-3">
                  {a.name || a.Name || `Ammunition ${i + 1}`}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoRow
                    label="Type (Caliber & Type)"
                    value={a.Type || a.type}
                  />
                  <InfoRow label="Velocity" value={a.Velocity || a.velocity} />
                  <InfoRow
                    label="Penetration"
                    value={a.Penetration || a.penetration}
                  />
                  <InfoRow label="Mass" value={a.Mass || a.mass} />
                  <InfoRow
                    label="Explosive Mass"
                    value={a["Explosive Mass"] || a.explosiveMass}
                  />
                  <InfoRow
                    label="TNT Equivalent"
                    value={a["TNT Equivalent"] || a.tnt}
                  />
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
          <InfoRow label="Armor" value={protection.Armor} />
          <InfoRow
            label="Appliqué Armor"
            value={protection["Appliqué Armor"] || protection["Applique Armor"]}
          />
          <InfoRow
            label="Passive Protection Devices"
            value={protection["Passive Protection Devices"]}
          />
          <InfoRow
            label="Active Protection Devices"
            value={protection["Active Protection Devices"]}
          />
        </div>
      </section>

      {/* AUTOMOTIVE */}
      <section>
        <SectionTitle>AUTOMOTIVE</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoRow label="Engine" value={automotive.Engine} />
          <InfoRow label="Horsepower" value={automotive.Horsepower} />
          <InfoRow
            label="Power/Weight Ratio"
            value={automotive["Power/Weight Ratio"] || automotive.powerToWeight}
          />
          <InfoRow label="Transmission" value={automotive.Transmission} />
          <InfoRow label="Gearbox" value={automotive.Gearbox} />
          <InfoRow label="Suspension" value={automotive.Suspension} />
          <InfoRow label="Fuel Type" value={automotive["Fuel Type"]} />
          <InfoRow label="Fuel Capacity" value={automotive["Fuel Capacity"]} />
        </div>
      </section>

      {/* PERFORMANCES */}
      <section>
        <SectionTitle>PERFORMANCES</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoRow
            label="Operational Range"
            value={performances["Operational Range"]}
          />
          <InfoRow label="Amphibious" value={performances.Amphibious} />
          <InfoRow
            label="On Road Speed"
            value={performances["On Road Speed"]}
          />
          <InfoRow
            label="Cross-Country Speed"
            value={performances["Cross-Country Speed"]}
          />
        </div>
      </section>

      {/* Navigation */}
      <div className="border-t border-gray-700 pt-8 flex flex-wrap gap-4 justify-center">
        <Link
          href={`/${domain}/${country}/${content.family}`}
          className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg transition text-white"
        >
          ← Back to family
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
