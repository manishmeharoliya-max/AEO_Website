import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { industries } from '../../data/industries.js';
import { IndustryCard } from '../../components/cards/IndustryCard.jsx';

export function IndustriesSection() {
  return (
    <section
      className={[
        'section py-[88px] max-[950px]:py-[65px] max-[720px]:py-[55px] site-container',
        'w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
        'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)]',
      ].join(' ')}
    >
      <SectionHeading
        label="Industries"
        title="Strategies shaped around your market"
        description="Different customers. Different questions. A strategy that fits."
      />
      <div className="grid-4 grid grid-cols-4 gap-[18px] max-[950px]:grid-cols-2 max-[720px]:gap-[12px]">
        {industries.map((industry) => (
          <IndustryCard key={industry[0]} industry={industry} />
        ))}
      </div>
    </section>
  );
}
