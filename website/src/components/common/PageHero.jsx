import { pageMeta } from '../../data/metadata.js';

export function PageHero({
  path,
  label = 'A clearer path to discovery',
  title,
  description,
}) {
  const [pageTitle, pageDescription] = path ? pageMeta[path] : [title, description];
  return (
    <section
      className={[
        'page-hero pt-[72px] px-0 pb-[62px]',
        '[background:radial-gradient(ellipse_at_80%_40%,_#eef3ff,_transparent_60%),_#f9fbfe]',
        'border-b border-b-[#edf1f6] [&_h1]:max-w-[850px] [&_h1]:text-[48px] [&_p]:max-w-[730px]',
        '[&_p]:mt-[22px] [&_p]:text-[16px] max-[720px]:pt-[49px] max-[720px]:px-0 max-[720px]:pb-[42px]',
        'max-[720px]:[&_h1]:text-[38px] max-[720px]:[&_h1]:tracking-[-1.5px]',
        'max-[720px]:[&_p]:text-[14px]',
      ].join(' ')}
    >
      <div
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)]',
        ].join(' ')}
      >
        <span
          className={[
            'eyebrow flex items-center gap-[8px] text-[11px] tracking-[1.8px] uppercase font-bold',
            'text-[#2563eb] mb-[17px] max-[720px]:text-[10px] max-[720px]:tracking-[1.5px]',
          ].join(' ')}
        >
          {label}
        </span>
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
      </div>
    </section>
  );
}
