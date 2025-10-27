"use client";

import Link from "next/link";

export default function Breadcrumb({
  domain,
  country,
  family,
  familyTitle,
  variant,
  variantTitle,
}) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      {/* Home */}
      <Link href="/" className="hover:text-green-400 transition">
        Home
      </Link>

      {/* Domain */}
      {domain && (
        <>
          <span>/</span>
          {country || family || variant ? (
            <Link
              href={`/${encodeURIComponent(domain)}`}
              className="hover:text-green-400 transition capitalize"
            >
              {decodeURIComponent(domain)}
            </Link>
          ) : (
            <span className="text-green-400 capitalize">
              {decodeURIComponent(domain)}
            </span>
          )}
        </>
      )}

      {/* Country */}
      {country && (
        <>
          <span>/</span>
          {family || variant ? (
            <Link
              href={`/${encodeURIComponent(domain)}/${encodeURIComponent(
                country
              )}`}
              className="hover:text-green-400 transition capitalize"
            >
              {decodeURIComponent(country)}
            </Link>
          ) : (
            <span className="text-green-400 capitalize">
              {decodeURIComponent(country)}
            </span>
          )}
        </>
      )}

      {/* Family */}
      {family && (
        <>
          <span>/</span>
          {variant ? (
            <Link
              href={`/${encodeURIComponent(domain)}/${encodeURIComponent(
                country
              )}/${encodeURIComponent(family)}`}
              className="hover:text-green-400 transition"
            >
              {familyTitle || decodeURIComponent(family)}
            </Link>
          ) : (
            <span className="text-green-400">
              {familyTitle || decodeURIComponent(family)}
            </span>
          )}
        </>
      )}

      {/* Variant */}
      {variant && (
        <>
          <span>/</span>
          <span className="text-green-400">
            {variantTitle || decodeURIComponent(variant)}
          </span>
        </>
      )}
    </nav>
  );
}
