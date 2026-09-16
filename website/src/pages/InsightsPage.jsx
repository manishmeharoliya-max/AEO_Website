import { useState } from 'react';
import { articles, categories } from '../data/insights.js';
import { PageHero } from '../components/common/PageHero.jsx';
import { BlogCard } from '../components/cards/BlogCard.jsx';
import { CTASection } from '../components/common/CTASection.jsx';

export function Insights() {
  const [filter, setFilter] = useState('All');
  const filtered = articles.filter(
    (article) => filter === 'All' || article.category === filter,
  );
  return (
    <>
      <PageHero path="/insights" label="The thinking behind the answers" />
      <section
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)] section py-[88px]',
          'max-[950px]:py-[65px] max-[720px]:py-[55px]',
        ].join(' ')}
      >
        <div
          className={[
            'category-filters flex flex-wrap gap-[10px] mb-[22px] [&_button]:border [&_button]:border-[#e2e8f0]',
            '[&_button]:py-[10px] [&_button]:px-[17px] [&_button]:bg-white [&_button]:rounded-[6px]',
            '[&_button]:text-[12px] [&_button]:text-[#64748b] [&_button:hover]:bg-[#f0f5ff]',
            '[&_.selected]:bg-[#2563eb] [&_.selected]:text-white [&_.selected]:border-[#2563eb]',
            'max-[720px]:gap-[8px] max-[720px]:[&_button]:text-[10px]',
            'max-[720px]:[&_button]:py-[9px] max-[720px]:[&_button]:px-[12px]',
          ].join(' ')}
          aria-label="Filter insights by category"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={filter === category ? 'selected' : ''}
            >
              {category}
            </button>
          ))}
        </div>
        <p className="results-count text-[11px] mb-[25px]" role="status">
          {filtered.length} insights{filter !== 'All' ? ` in ${filter}` : ''}
        </p>
        <div className="grid-3 grid grid-cols-3 gap-[22px] max-[720px]:grid-cols-[1fr] max-[720px]:gap-[18px]">
          {filtered.map((article) => (
            <BlogCard
              key={article.slug}
              article={article}
              index={articles.indexOf(article)}
            />
          ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
