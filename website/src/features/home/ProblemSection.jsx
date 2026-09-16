import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { MessageCircle, ShieldCheck, ChartNoAxesCombined } from 'lucide-react';

export function ProblemSection() {
  return (
    <section
      className={[
        'section py-[88px] max-[950px]:py-[65px] max-[720px]:py-[55px] site-container',
        'w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
        'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)]',
      ].join(' ')}
    >
      <SectionHeading
        label="Why AEO matters"
        title={
          <>
            Search behaviour is changing.
            <br />
            Your strategy should too.
          </>
        }
        description="Customers are no longer relying only on a list of blue links. They ask detailed questions, compare solutions and expect direct answers. If your website is unclear, incomplete or difficult to trust, AI platforms may choose another source."
        center
      />
      <div
        className={[
          'grid-3 grid grid-cols-3 gap-[22px] max-[720px]:grid-cols-[1fr] max-[720px]:gap-[18px]',
          'problem-grid max-[720px]:[&.problem-grid]:gap-[13px]',
        ].join(' ')}
      >
        {[
          [
            MessageCircle,
            'Customers Ask Complete Questions',
            'People use natural and conversational language instead of short keywords.',
          ],
          [
            ShieldCheck,
            'AI Selects Reliable Sources',
            'Clear, accurate and well-structured information is easier to understand and reference.',
          ],
          [
            ChartNoAxesCombined,
            'Visibility Goes Beyond Rankings',
            'Brands now need to measure mentions, citations and presence inside generated answers.',
          ],
        ].map(([I, title, description], i) => (
          <div
            className={[
              'problem-card py-[26px] px-[25px] border border-[#e2e8f0] rounded-[12px] [&_h3]:text-[16px]',
              '[&_h3]:mt-[20px] [&_h3]:mx-0 [&_h3]:mb-[10px] [&_p]:text-[13px] max-[720px]:p-[23px]',
              'max-[720px]:[&_h3]:mt-[17px]',
            ].join(' ')}
            key={title}
          >
            <span
              className={[
                [
                  'icon-box inline-flex w-[47px] h-[47px] items-center justify-center rounded-[11px]',
                  'bg-[#eaf2ff] text-[#2563eb]',
                ].join(' '),
                [
                  'tone-0',
                  'tone-1 [&.tone-1]:bg-[#f1edff] [&.tone-1]:text-[#7952ce]',
                  'tone-2 [&.tone-2]:bg-[#eaf7f5] [&.tone-2]:text-[#368e85]',
                ][i],
              ].join(' ')}
            >
              <I size={23} />
            </span>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
