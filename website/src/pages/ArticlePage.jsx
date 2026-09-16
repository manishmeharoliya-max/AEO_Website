import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/insights.js';
import { NotFound } from './NotFoundPage.jsx';
import { PageHero } from '../components/common/PageHero.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { Button } from '../components/ui/Button.jsx';

export function Article() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return <NotFound />;
  return (
    <>
      <PageHero
        label={`${article.category} · ${article.time} min planned read`}
        title={article.title}
        description={article.description}
      />
      <section
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)] article-placeholder',
          'max-w-[780px] [&_.info-callout]:mb-[35px] [&_h2]:text-[25px] [&>p]:my-[18px] [&>p]:mx-0',
          '[&>.button]:mt-[10px] max-[720px]:[&_h2]:text-[22px] section py-[88px] max-[950px]:py-[65px]',
          'max-[720px]:py-[55px]',
        ].join(' ')}
      >
        <Link
          className={[
            'text-link text-[#2563eb] inline-flex items-center gap-[10px] text-[12px] font-semibold',
            'hover:gap-[14px]',
          ].join(' ')}
          to="/insights"
        >
          ← Back to all insights
        </Link>
        <div
          className={[
            'info-callout p-[22px] bg-[#f3f7ff] border border-[#e1eafb] rounded-[10px] flex gap-[14px]',
            'mt-[28px] [&>svg]:text-[#2563eb] [&_h3]:text-[13px] [&_h3]:mb-[7px] [&_p]:text-[12px]',
          ].join(' ')}
        >
          <Icon name="FileText" size={28} />
          <div>
            <h2>This insight is being prepared</h2>
            <p>
              This is an editorial preview. The full article will be added here after
              review.
            </p>
          </div>
        </div>
        <h2>A useful place to start</h2>
        <p>
          Review your most important pages from a customer’s point of view. Can someone
          quickly understand what you offer, who it is for and why your information is
          reliable? Make a note of the questions the page leaves unanswered.
        </p>
        <p>For a review specific to your business, start with an AEO analysis.</p>
        <Button>Get Free AEO Analysis</Button>
      </section>
    </>
  );
}
