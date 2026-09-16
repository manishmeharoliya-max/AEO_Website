import { ScanSearch, FileText } from 'lucide-react';

export function AuditPreview() {
  return (
    <div
      className={[
        'audit-preview p-[28px] bg-white border border-[#dfe8f8] rounded-[13px]',
        'shadow-[0_12px_30px_#2563eb08] [&_h3]:text-[14px] [&_small]:block [&_small]:text-[9px]',
        '[&_small]:text-[#8895a7] [&_small]:mt-[12px] max-[720px]:p-[24px]',
      ].join(' ')}
    >
      <div
        className={[
          'audit-preview-header flex items-center gap-[12px] pb-[24px] border-b border-b-[#edf1f7]',
          'mb-[22px] [&>div>span]:text-[10px] [&>div>span]:text-[#8591a3]',
        ].join(' ')}
      >
        <span
          className={[
            'icon-box inline-flex w-[47px] h-[47px] items-center justify-center rounded-[11px]',
            'bg-[#eaf2ff] text-[#2563eb]',
          ].join(' ')}
        >
          <ScanSearch size={22} />
        </span>
        <div>
          <h3>Your website, at a glance</h3>
          <span>Sample Audit Preview</span>
        </div>
        <span
          className={[
            'sample-tag text-[7px] tracking-[1px] bg-[#f4f6fa] py-[4px] px-[6px] rounded-[4px]',
            'text-[#8290a3] ml-auto',
          ].join(' ')}
        >
          SAMPLE
        </span>
      </div>
      {[
        ['Content clarity', 'Strong', 'w-[82%]'],
        ['Question coverage', 'Opportunity', 'w-[48%]'],
        ['Technical accessibility', 'Good foundation', 'w-[72%]'],
        ['Authority signals', 'Needs attention', 'w-[38%]'],
      ].map(([label, status, widthClass]) => (
        <div
          className={[
            'audit-metric mb-[20px] [&>div:first-child]:flex [&>div:first-child]:justify-between',
            '[&>div:first-child]:text-[11px] [&>div:first-child]:mb-[9px]',
            '[&>div>span:last-child]:text-[#7688a3] [&>div>span:last-child]:text-[10px]',
          ].join(' ')}
          key={label}
        >
          <div>
            <span>{label}</span>
            <span>{status}</span>
          </div>
          <div
            className={[
              'metric-track h-[6px] rounded-[5px] bg-[#edf2f9] [&_i]:h-full [&_i]:block [&_i]:rounded-[5px]',
              '[&_i]:[background:linear-gradient(90deg,_#6797ef,_#8185e6)]',
            ].join(' ')}
          >
            <i className={widthClass} />
          </div>
        </div>
      ))}
      <div
        className={[
          'audit-note flex gap-[8px] items-center text-[10px] text-[#597291] bg-[#f6f8fd] p-[12px]',
          'rounded-[5px] mt-[25px]',
        ].join(' ')}
      >
        <FileText size={16} /> Clear priorities. Practical next steps.
      </div>
      <small>Illustrative indicators, not actual website results.</small>
    </div>
  );
}
