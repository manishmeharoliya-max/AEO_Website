import { useLocation } from 'react-router-dom';
import { articles } from '../../data/insights.js';
import { pageMeta } from '../../data/metadata.js';
import { useEffect } from 'react';
import { brand } from '../../config/brand.js';

export function SEO() {
  const { pathname } = useLocation();
  const article = articles.find((a) => pathname === `/insights/${a.slug}`);
  const meta = article
    ? [article.title, article.description]
    : pageMeta[pathname] || [
        'Page not found',
        'The page you are looking for could not be found.',
      ];
  useEffect(() => {
    document.title = `${meta[0]} | ${brand.name}`;
    document.querySelector('meta[name="description"]').content = meta[1];
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = brand.domain + pathname;
  }, [pathname, meta[0], meta[1]]);
  const schema = [
    {
      '@type': 'Organization',
      name: brand.name,
      url: brand.domain,
      description: brand.tagline,
    },
    {
      '@type': 'WebSite',
      name: brand.name,
      url: brand.domain,
    },
  ];
  if (pathname !== '/' && pageMeta[pathname])
    schema.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: brand.domain,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: meta[0],
          item: brand.domain + pathname,
        },
      ],
    });
  if (article)
    schema.push({
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      articleSection: article.category,
      creativeWorkStatus: 'Editorial preview',
      url: brand.domain + pathname,
    });
  if (pathname === '/services')
    schema.push({
      '@type': 'Service',
      name: 'Answer Engine Optimization Services',
      provider: {
        '@type': 'Organization',
        name: brand.name,
      },
      description: meta[1],
    });
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': schema,
      })}
    </script>
  );
}
