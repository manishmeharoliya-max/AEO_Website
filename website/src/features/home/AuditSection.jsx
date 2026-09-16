import { CheckList } from '../../components/ui/CheckList.jsx';
import { auditChecks } from '../../data/audit.js';
import { Button } from '../../components/ui/Button.jsx';
import { AuditPreview } from './AuditPreview.jsx';

export function AuditSection() {
  return (
    <section
      className={[
        'audit-section py-[76px] px-0 bg-[#eff5ff] border-y border-y-[#e4edfb]',
        'max-[720px]:py-[50px] max-[720px]:[&_h2]:text-[31px]',
      ].join(' ')}
    >
      <div
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)] split-grid grid',
          'grid-cols-2 gap-[78px] items-center [&>div>p]:mt-[17px] [&>div>p]:max-w-[440px]',
          'max-[1150px]:gap-[45px] max-[720px]:grid-cols-[1fr] max-[720px]:gap-[35px]',
        ].join(' ')}
      >
        <div>
          <span
            className={[
              'eyebrow flex items-center gap-[8px] text-[11px] tracking-[1.8px] uppercase font-bold',
              'text-[#2563eb] mb-[17px] max-[720px]:text-[10px] max-[720px]:tracking-[1.5px]',
            ].join(' ')}
          >
            Your starting point
          </span>
          <h2>
            Can AI platforms
            <br />
            understand your business?
          </h2>
          <p>
            Our AEO audit shows what is clear, what is missing and what you should improve
            first.
          </p>
          <CheckList items={auditChecks} />
          <Button>Request My AEO Analysis</Button>
        </div>
        <AuditPreview />
      </div>
    </section>
  );
}
