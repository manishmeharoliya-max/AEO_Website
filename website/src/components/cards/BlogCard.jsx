import { Link } from 'react-router-dom';
import { Sparkles, Search, Check, ArrowRight } from 'lucide-react';

export function BlogCard({ article, index = 0 }) {
  return (
    <Link
      className={[
        'blog-card hover:[transform:translateY(-4px)] hover:border-[#c3d5f6]',
        'hover:shadow-[0_12px_28px_#1736560a] border border-[#e2e8f0] rounded-[12px]',
        'overflow-hidden flex flex-col [transition:transform_0.2s,_box-shadow_0.2s] bg-white',
      ].join(' ')}
      to={`/insights/${article.slug}`}
    >
      <div
        className={[
          [
            'blog-art h-[180px] bg-[#edf3ff] relative overflow-hidden flex items-center justify-center',
            'gap-[18px] max-[950px]:gap-[10px] max-[720px]:h-[190px]',
          ].join(' '),
          ['art-0', 'art-1 [&.art-1]:bg-[#f0edfa]', 'art-2 [&.art-2]:bg-[#eaf4f4]'][
            index % 3
          ],
        ].join(' ')}
        aria-hidden="true"
      >
        {index % 3 === 0 ? (
          <>
            <span
              className={[
                'art-question text-[52px] leading-[1] text-[#79a0ef] font-[450] bg-[#ffffffc0]',
                'shadow-[0_5px_15px_#7394bc10] w-[72px] h-[80px] border border-[white] rounded-[12px] grid',
                'place-items-center [transform:rotate(-9deg)] mb-[10px]',
              ].join(' ')}
            >
              ?
            </span>
            <div
              className={[
                'art-answer w-[120px] bg-white rounded-[9px] [transform:rotate(7deg)] p-[15px] grid',
                'gap-[7px] mb-[8px] shadow-[0_5px_15px_#7394bc10] [&_svg]:text-[#6e91e8] [&_svg]:mb-[3px]',
                '[&_i]:h-[4px] [&_i]:bg-[#dce7fa] [&_i]:rounded-[2px] [&_i:last-child]:w-[60%]',
              ].join(' ')}
            >
              <Sparkles size={24} />
              <i />
              <i />
              <i />
            </div>
            <span
              className={[
                'art-label absolute bottom-[15px] left-0 right-0 text-center text-[9px] tracking-[0.7px]',
                'text-[#7f91af]',
              ].join(' ')}
            >
              From questions to answers
            </span>
          </>
        ) : index % 3 === 1 ? (
          <>
            <span
              className={[
                'art-search flex items-center gap-[7px] py-[18px] px-[15px] border border-[#ffffffb0]',
                'bg-[#ffffffb8] text-[#7683ae] rounded-[10px] font-[550] text-[18px] mb-[13px]',
                '[transform:rotate(-6deg)] max-[950px]:text-[15px] max-[950px]:py-[14px] max-[950px]:px-[10px]',
                'max-[950px]:[&_svg]:w-[19px] max-[720px]:text-[22px] max-[720px]:py-[18px] max-[720px]:px-[20px]',
              ].join(' ')}
            >
              <Search /> SEO
            </span>
            <span className="art-plus text-[#a99dc4] text-[21px] mb-[15px]">+</span>
            <span
              className={[
                'art-aeo flex items-center gap-[7px] py-[18px] px-[15px] border border-[#ffffffb0]',
                'bg-[#ffffffb8] text-[#8770c9] rounded-[10px] font-[550] text-[18px] mb-[13px]',
                '[transform:rotate(6deg)] max-[950px]:text-[15px] max-[950px]:py-[14px] max-[950px]:px-[10px]',
                'max-[950px]:[&_svg]:w-[19px] max-[720px]:text-[22px] max-[720px]:py-[18px] max-[720px]:px-[20px]',
              ].join(' ')}
            >
              <Sparkles /> AEO
            </span>
            <span
              className={[
                'art-label absolute bottom-[15px] left-0 right-0 text-center text-[9px] tracking-[0.7px]',
                'text-[#7f91af]',
              ].join(' ')}
            >
              One connected strategy
            </span>
          </>
        ) : (
          <>
            <div
              className={[
                'art-document grid gap-[9px] bg-[#ffffffcf] py-[17px] px-[21px] rounded-[7px] w-[185px]',
                '[transform:rotate(-5deg)] shadow-[0_7px_15px_#518e8510] mb-[16px] [&>span]:h-[6px]',
                '[&>span]:w-[60%] [&>span]:bg-[#a9c9c6] [&>i]:h-[4px] [&>i]:bg-[#dcebea] [&>div]:text-[8px]',
                '[&>div]:flex [&>div]:gap-[4px] [&>div]:text-[#60958a] [&>div]:pt-[4px]',
              ].join(' ')}
            >
              <span />
              <i />
              <i />
              <div>
                <Check size={13} /> Clear. Useful. Structured.
              </div>
            </div>
            <span
              className={[
                'art-label absolute bottom-[15px] left-0 right-0 text-center text-[9px] tracking-[0.7px]',
                'text-[#7f91af]',
              ].join(' ')}
            >
              Write for understanding
            </span>
          </>
        )}
      </div>
      <div
        className={[
          'blog-content p-[23px] flex flex-col flex-1 [&_h3]:text-[17px] [&_h3]:mb-[10px]',
          '[&_p]:text-[12px] [&_p]:mb-[22px] [&>.text-link]:mt-auto [&>.text-link]:text-[11px]',
          'max-[950px]:p-[19px] max-[720px]:p-[24px] max-[720px]:[&_h3]:text-[19px]',
          'max-[720px]:[&_p]:text-[13px]',
        ].join(' ')}
      >
        <div
          className={[
            'blog-meta flex justify-between gap-[8px] text-[9px] text-[#93a0b2] mb-[12px]',
            '[&>span:first-child]:text-[#6382b8] max-[720px]:text-[10px]',
          ].join(' ')}
        >
          <span>{article.category}</span>
          <span>{article.time} min read</span>
        </div>
        <h3>{article.title}</h3>
        <p>{article.description}</p>
        <span
          className={[
            'text-link text-[#2563eb] inline-flex items-center gap-[10px] text-[12px] font-semibold',
            'hover:gap-[14px]',
          ].join(' ')}
        >
          Read insight <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}
