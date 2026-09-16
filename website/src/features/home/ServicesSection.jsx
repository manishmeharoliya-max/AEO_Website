import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { services } from '../../data/services.js';
import { ServiceCard } from '../../components/cards/ServiceCard.jsx';

export function ServicesSection() {
  return (
    <section className="section py-[88px] max-[950px]:py-[65px] max-[720px]:py-[55px] secondary bg-[#f7f9fc]">
      <div
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)]',
        ].join(' ')}
      >
        <SectionHeading
          label="What we do"
          title={
            <>
              A complete AEO strategy
              <br />
              for better visibility
            </>
          }
          description="The right foundations. The right answers. A clearer way forward."
        >
          <Button to="/services" secondary>
            View All Services
          </Button>
        </SectionHeading>
        <div className="grid-3 grid grid-cols-3 gap-[22px] max-[720px]:grid-cols-[1fr] max-[720px]:gap-[18px]">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
