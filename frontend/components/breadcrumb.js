"use client";

import Link from "next/link";

export default function Breadcrumb({
  domain,
  country,
  family,
  familyTitle,
  model,
  modelTitle,
}) {
  return (
    <nav className="flex items-center justify-between text-sm text-gray-400 mb-6">
      {/* Left side: breadcrumb path */}
      <div className="flex items-center space-x-2">
        {/* Home */}
        <Link href="/" className="hover:text-yellow-500 transition">
          Home
        </Link>

        {/* Domain */}
        {domain && (
          <>
            <span>/</span>
            {country || family || model ? (
              <Link
                href={`/${encodeURIComponent(domain)}`}
                className="hover:text-yellow-500 transition capitalize"
              >
                {decodeURIComponent(domain)}
              </Link>
            ) : (
              <span className="text-yellow-500 capitalize">
                {decodeURIComponent(domain)}
              </span>
            )}
          </>
        )}

        {/* Country */}
        {country && (
          <>
            <span>/</span>
            {family || model ? (
              <Link
                href={`/${encodeURIComponent(domain)}/${encodeURIComponent(
                  country
                )}`}
                className="hover:text-yellow-500 transition capitalize"
              >
                {decodeURIComponent(country)}
              </Link>
            ) : (
              <span className="text-yellow-500 capitalize">
                {decodeURIComponent(country)}
              </span>
            )}
          </>
        )}

        {/* Family */}
        {family && (
          <>
            <span>/</span>
            {model || modelTitle ? (
              <Link
                href={`/${encodeURIComponent(domain)}/${encodeURIComponent(
                  country
                )}/${encodeURIComponent(family)}`}
                className="hover:text-yellow-500 transition"
              >
                {familyTitle || decodeURIComponent(family)}
              </Link>
            ) : (
              <span className="text-yellow-500">
                {familyTitle || decodeURIComponent(family)}
              </span>
            )}
          </>
        )}

        {/* Model */}
        {modelTitle && (
          <>
            <span>/</span>
            <span className="text-yellow-500">{modelTitle}</span>
          </>
        )}
      </div>

      {/* Contact */}
      <Link
        href="/contact"
        className="px-4 py-2 border border-gray-700 hover:border-yellow-500 rounded-sm uppercase tracking-widest text-xs transition font-mono"
        style={{
          clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)",
        }}
      >
        Contact
      </Link>
    </nav>
  );
}
