"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  // Parser l'URL pour extraire les segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Déterminer le type de page
  const getPageInfo = () => {
    if (segments.length === 0) {
      return { type: 'home', title: 'Armement - Catalogue' };
    }
    
    if (segments.length === 1) {
      return { 
        type: 'domain', 
        title: `${segments[0].charAt(0).toUpperCase() + segments[0].slice(1)} Domain`,
        domain: segments[0]
      };
    }
    
    if (segments.length === 2) {
      return { 
        type: 'country', 
        title: `${segments[1].charAt(0).toUpperCase() + segments[1].slice(1)} - ${segments[0].charAt(0).toUpperCase() + segments[0].slice(1)}`,
        domain: segments[0],
        country: segments[1]
      };
    }
    
    if (segments.length === 3) {
      return { 
        type: 'article', 
        title: decodeURIComponent(segments[2]),
        domain: segments[0],
        country: segments[1],
        slug: segments[2]
      };
    }
    
    return { type: 'unknown', title: 'Page' };
  };

  const pageInfo = getPageInfo();

  // Générer les breadcrumbs
  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Home', href: '/', active: false }
    ];

    if (segments.length >= 1) {
      breadcrumbs.push({
        label: segments[0].charAt(0).toUpperCase() + segments[0].slice(1),
        href: `/${segments[0]}`,
        active: segments.length === 1
      });
    }

    if (segments.length >= 2) {
      breadcrumbs.push({
        label: segments[1].charAt(0).toUpperCase() + segments[1].slice(1),
        href: `/${segments[0]}/${segments[1]}`,
        active: segments.length === 2
      });
    }

    if (segments.length >= 3) {
      breadcrumbs.push({
        label: decodeURIComponent(segments[2]),
        href: `/${segments[0]}/${segments[1]}/${segments[2]}`,
        active: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Composant Badge pour identifier le type de page
  const PageBadge = () => {
    const badges = {
      home: null,
      domain: { text: 'Domain', color: 'bg-purple-600' },
      country: { text: 'Country', color: 'bg-blue-600' },
      article: { text: 'Article', color: 'bg-green-600' }
    };

    const badge = badges[pageInfo.type];
    if (!badge) return null;

    return (
      <div className={`px-3 py-1 ${badge.color} text-white text-sm rounded-full uppercase tracking-wide`}>
        {badge.text}
      </div>
    );
  };

  // Style différent selon le type de page
  const getHeaderStyle = () => {
    switch (pageInfo.type) {
      case 'home':
        return 'bg-gradient-to-r from-gray-900 via-[#1b1b1b] to-gray-900';
      case 'domain':
        return 'bg-gradient-to-r from-purple-900/20 via-[#1b1b1b] to-purple-900/20';
      case 'country':
        return 'bg-gradient-to-r from-blue-900/20 via-[#1b1b1b] to-blue-900/20';
      case 'article':
        return 'bg-gradient-to-r from-green-900/20 via-[#1b1b1b] to-green-900/20';
      default:
        return 'bg-[#1b1b1b]';
    }
  };

  return (
    <header className={`${getHeaderStyle()} border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumbs - ne s'affiche pas sur la home */}
        {pageInfo.type !== 'home' && (
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index > 0 && <span className="text-gray-600">/</span>}
                {crumb.active ? (
                  <span className="text-green-400 font-medium">{crumb.label}</span>
                ) : (
                  <Link 
                    href={crumb.href} 
                    className="hover:text-green-400 transition"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Titre principal et badges */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            {/* Badge et titre */}
            <div className="flex items-center space-x-3">
              <PageBadge />
              <h1 className="text-2xl md:text-3xl font-bold text-green-400">
                {pageInfo.title}
              </h1>
            </div>
          </div>

          {/* Actions contextuelles */}
          <div className="flex items-center space-x-3 mt-3 md:mt-0">
            {/* Bouton de recherche (pour plus tard) */}
            <button className="p-2 text-gray-400 hover:text-green-400 transition rounded-lg hover:bg-gray-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Menu burger pour mobile (pour plus tard) */}
            <button className="p-2 text-gray-400 hover:text-green-400 transition rounded-lg hover:bg-gray-800 md:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats contextuelles (optionnel selon la page) */}
        {pageInfo.type === 'domain' && (
          <div className="mt-3 text-sm text-gray-400">
            Select a country to explore {pageInfo.domain} vehicles
          </div>
        )}
        
        {pageInfo.type === 'country' && (
          <div className="mt-3 text-sm text-gray-400">
            Browse vehicle families from {pageInfo.country}
          </div>
        )}
      </div>
    </header>
  );
}