import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { process } from '../../data/process.js';
import { ProcessStep } from './ProcessStep.jsx';

export function ProcessSection() {
  return (
    <section
      className={[
        'section py-[88px] max-[950px]:py-[65px] max-[720px]:py-[55px] site-container',
        'w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
        'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)]',
      ].join(' ')}
    >
      <SectionHeading
        label="Our process"
        title="From unclear content to trusted answers"
        description="A considered approach, with a clear purpose at every step."
        center
      />
      <div
        className={[
          'process-grid grid grid-cols-4 gap-[36px] pt-[6px] max-[720px]:grid-cols-[1fr]',
          'max-[720px]:gap-[27px]',
        ].join(' ')}
      >
        {process.map((step, index) => (
          <ProcessStep step={step} index={index} key={step[0]} />
        ))}
      </div>
    </section>
  );
}
