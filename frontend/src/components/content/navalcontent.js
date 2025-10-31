"use client";

import Link from "next/link";
import ContentHeader from "@/components/ContentHeader";
import InfoRow from "@/components/ui/InfoRow";
import SectionTitle from "@/components/ui/SectionTitle";

export default function NavalContent({ content, domain, country }) {
  const specs = content?.specifications || {};
  const informations = specs["INFORMATIONS"] || {};
  const dimensions = specs["DIMENSIONS"] || {};
  const automotive = specs["AUTOMOTIVE"] || {};
  const sensors = specs["SENSORS"] || [];
  const armaments = specs["ARMAMENT"] || {};
  const protection = specs["PROTECTION"] || {};
  const aviationFacilities = specs["AVIATION FACILITIES"] || {};
  const performances = specs["PERFORMANCES"] || {};
  const service = specs["SERVICE"] || content?.SERVICE;
  const users = specs["USERS"] || {};

  const renderArmamentCategory = (title, list) => {
    if (!list || list.length === 0) return null;
    return (
      <div>
        <h4 className="text-blue-400 font-semibold mb-2">{title}</h4>
        <div className="space-y-4">
          {items.map((a, i) => (
            <div
              key={i}
              className="p-4 bg-[#181818] rounded border border-gray-700"
            >
              {a.Name && (
                <div className="text-sm text-gray-300 font-semibold mb-3">
                  {a.Name}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(a)
                  .filter(([k]) => k !== "Name")
                  .map(([k, v]) => (
                    <InfoRow key={k} label={k} value={v} />
                  ))}
              </div>
            </div>
          ))}
        </div>
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

      {/* PROPULSION */}
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

      {/* SENSORS */}
      {sensors.length > 0 && (
        <section>
          <SectionTitle>SENSORS</SectionTitle>
          {sensors.map((s, i) => (
            <div
              key={i}
              className="p-4 bg-[#181818] rounded border border-gray-700 mb-4"
            >
              {s.Name && (
                <div className="text-sm text-gray-300 font-semibold mb-3">
                  {s.Name}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(s)
                  .filter(([k]) => k !== "Name")
                  .map(([k, v]) => (
                    <InfoRow key={k} label={k} value={v} />
                  ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ARMAMENTS */}
      {armaments && Object.keys(armaments).length > 0 && (
        <section>
          <SectionTitle>ARMAMENTS</SectionTitle>
          <div className="space-y-6">
            {renderArmamentCategory("Guns", armaments.Guns || [])}
            {renderArmamentCategory("Rockets", armaments.Rockets || [])}
            {renderArmamentCategory("Missiles", armaments.Missiles || [])}
            {renderArmamentCategory("Others", armaments.Others || [])}
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

      {/* SERVICE HISTORY */}
      {service && (
        <section>
          <SectionTitle>SERVICE HISTORY</SectionTitle>
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">
            {service}
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
