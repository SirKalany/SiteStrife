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
          modelTitle={content.name} // model name
        />

        <h1 className="text-4xl md:text-5xl font-bold text-yellow-500">
          {content.name}
        </h1>
      </header>

      {/* MODEL PICTURE */}
      {content.picture && (
        <img
          src={`http://localhost:4000${content.picture}`}
          alt={content.name}
          className="w-full h-64 md:h-100 object-cover rounded-lg shadow-lg"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}

      {/* DESCRIPTION */}
      {content.description && (
        <div className="prose prose-invert max-w-none mt-6">
          <p className="text-gray-300 text-lg leading-relaxed">
            {content.description}
          </p>
        </div>
      )}
    </>
  );
}