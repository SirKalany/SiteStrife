"use client";

import Link from "next/link";

export default function ContentHeader({ content, domain, country }) {
  return (
    <>
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

        {content.family && (
          <>
            <span>/</span>
            <Link
              href={`/${domain}/${country}/${content.family}`}
              className="hover:text-green-400 transition"
            >
              {content.familyData?.title || content.family}
            </Link>
          </>
        )}

        <span>/</span>
        <span className="text-green-400">{content.name}</span>
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
    </>
  );
}
