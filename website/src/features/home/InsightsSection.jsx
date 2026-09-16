import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { articles } from '../../data/insights.js';
import { BlogCard } from '../../components/cards/BlogCard.jsx';

export function InsightsSection() {
  return (
    <section
      className={[
        'section py-[88px] max-[950px]:py-[65px] max-[720px]:py-[55px] site-container',
        'w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
        'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)]',
      ].join(' ')}
    >
      <SectionHeading
        label="Ideas & insights"
        title={
          <>
            Learn how AI search
            <br />
            is changing discovery
          </>
        }
      >
        <Button to="/insights" secondary>
          View All Insights
        </Button>
      </SectionHeading>
      <div className="grid-3 grid grid-cols-3 gap-[22px] max-[720px]:grid-cols-[1fr] max-[720px]:gap-[18px]">
        {articles.slice(0, 3).map((article, index) => (
          <BlogCard key={article.slug} article={article} index={index} />
        ))}
      </div>
    </section>
  );
}
