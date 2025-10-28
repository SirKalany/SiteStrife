"use client";

import Breadcrumb from "@/components/breadcrumb";

export default function ContentHeader({ content, domain, country }) {
  return (
    <>
      {/* HEADER */}
      <header className="flex flex-col space-y-4">
        <Breadcrumb
          domain={domain}
          country={country}
          family={content.family} // slug of the family
          familyTitle={content.familyData?.title} // display title of the family
          model={content.slug} // model slug (for URL)
          modelTitle={content.name} // model name (displayed as last breadcrumb)
        />

        <h1 className="text-4xl md:text-5xl font-bold text-yellow-500">
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
