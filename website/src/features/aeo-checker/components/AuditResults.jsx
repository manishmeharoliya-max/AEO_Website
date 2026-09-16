import { CircleCheck, TriangleAlert, ArrowDown, ExternalLink } from 'lucide-react';

export function AuditResults({ result }) {
  const issues = result.checks
    .filter((check) => !check.passed)
    .sort((a, b) => b.maxPoints - a.maxPoints);
  const passedCount = result.checks.length - issues.length;
  const missedPoints = issues.reduce((total, issue) => total + issue.maxPoints, 0);
  return (
    <div
      className={[
        'checker-results bg-white border border-[#dce6f5] p-[32px] rounded-[12px]',
        'max-[720px]:py-[21px] max-[720px]:px-[17px]',
      ].join(' ')}
    >
      <div
        className={[
          'score-summary flex gap-[30px] items-center max-[720px]:flex-col max-[720px]:text-center',
          'max-[720px]:gap-[20px]',
        ].join(' ')}
      >
        <div
          className="score-ring relative h-[145px] w-[145px] shrink-0 max-[720px]:h-[130px] max-[720px]:w-[130px]"
          aria-label={`AEO readiness score ${result.score} out of 100`}
        >
          <svg
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full -rotate-90"
          >
            <circle
              cx="50"
              cy="50"
              r="46.5"
              fill="none"
              strokeWidth="7"
              className="stroke-[#e8effa]"
            />
            <circle
              cx="50"
              cy="50"
              r="46.5"
              fill="none"
              strokeWidth="7"
              pathLength="100"
              strokeDasharray={`${result.score} 100`}
              className="stroke-[#2563eb]"
            />
          </svg>
          <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full bg-white">
            <strong className="text-[43px] leading-[1.1] text-[#102a43]">
              {result.score}
            </strong>
            <span className="mt-[5px] text-[12px] text-[#64748b]">/ 100</span>
          </div>
        </div>
        <div
          className={[
            'score-copy min-w-0 [&_.eyebrow]:mb-[8px] [&_h3]:text-[25px] [&>a:not(.text-link)]:inline-flex',
            '[&>a:not(.text-link)]:gap-[8px] [&>a:not(.text-link)]:items-center',
            '[&>a:not(.text-link)]:max-w-full [&>a:not(.text-link)]:text-[12px]',
            '[&>a:not(.text-link)]:text-[#2563eb] [&>a:not(.text-link)]:[overflow-wrap:anywhere]',
            '[&>a:not(.text-link)]:my-[9px] [&>a:not(.text-link)]:mx-0 [&_p]:text-[13px] [&_p]:mb-[12px]',
            'max-[720px]:[&_.eyebrow]:justify-center',
          ].join(' ')}
        >
          <span
            className={[
              'eyebrow flex items-center gap-[8px] text-[11px] tracking-[1.8px] uppercase font-bold',
              'text-[#2563eb] mb-[17px] max-[720px]:text-[10px] max-[720px]:tracking-[1.5px]',
            ].join(' ')}
          >
            Your page-level AEO readiness
          </span>
          <h3>{result.level}</h3>
          <a href={result.url} target="_blank" rel="noopener noreferrer">
            {result.url}
            <ExternalLink size={13} />
          </a>
          <p>
            {passedCount} of {result.checks.length} checks passed.{' '}
            {issues.length
              ? `${issues.length} opportunities to review below.`
              : 'All quick checks passed. A deeper review can evaluate content quality and actual visibility.'}
          </p>
          {missedPoints > 0 && (
            <p className="font-semibold text-amber-700">
              {missedPoints} points are currently missed across the checks below. Those
              points can only be earned by improving the page and running a new check.
            </p>
          )}
          <a
            className={[
              'text-link text-[#2563eb] inline-flex items-center gap-[10px] text-[12px] font-semibold',
              'hover:gap-[14px]',
            ].join(' ')}
            href="#aeo-plans-heading"
          >
            Explore improvement plans <ArrowDown size={14} />
          </a>
        </div>
      </div>
      <p className="score-limitations mt-[24px] p-[17px] bg-[#f7f9fc] rounded-[7px] text-[11px]">
        {result.limitations}
      </p>
      <div
        className={[
          'findings-heading flex justify-between gap-[15px] mt-[29px] mx-0 mb-[17px] items-center',
          '[&_span]:text-[11px] [&_span]:text-[#64748b] max-[720px]:flex-col max-[720px]:items-start',
        ].join(' ')}
      >
        <h3>
          {issues.length
            ? 'What is holding this score back?'
            : 'Your quick-check foundations look good.'}
        </h3>
        <span>{issues.length} items to review</span>
      </div>
      <div className="findings-list grid gap-[13px]">
        {issues.map((issue) => (
          <article
            className={[
              'finding-card border border-[#e2e8f0] p-[20px] rounded-[9px] flex items-start gap-[13px]',
              '[&>svg]:text-[#b7791f] [&>svg]:mt-[2px] [&>div]:flex-1 [&>div]:min-w-0 [&_h4]:text-[14px]',
              '[&_h4]:font-semibold [&_h4]:text-[#102a43] [&_h4]:mt-0 [&_h4]:mx-0 [&_h4]:mb-[6px] [&_p]:text-[12px]',
              '[&_p]:[overflow-wrap:anywhere] max-[720px]:py-[15px] max-[720px]:px-[12px] max-[720px]:flex-wrap',
              'max-[720px]:gap-[9px] max-[720px]:[&>div]:basis-[calc(100%_-_35px)]',
            ].join(' ')}
            key={issue.id}
          >
            <TriangleAlert size={20} />
            <div>
              <h4>{issue.label}</h4>
              <p>{issue.reason}</p>
              <p className="finding-evidence mt-[7px] text-[#576980]">
                Observed: {issue.evidence}
              </p>
              <div
                className={[
                  'finding-fix bg-[#f5f8ff] py-[12px] px-[14px] mt-[12px] rounded-[6px] [&_strong]:text-[11px]',
                  '[&_strong]:text-[#2563eb]',
                ].join(' ')}
              >
                <strong>How to improve</strong>
                <p>{issue.recommendation}</p>
              </div>
            </div>
            <span
              className={[
                'finding-points text-[10px] text-[#856a29] whitespace-nowrap bg-[#fff9e9] py-[5px] px-[8px]',
                'rounded-[5px] max-[720px]:ml-[29px]',
              ].join(' ')}
            >
              {issue.maxPoints} points
            </span>
          </article>
        ))}
      </div>
      <details
        className={[
          'all-checks border-t border-t-[#e2e8f0] mt-[25px] pt-[19px] [&_summary]:text-[13px]',
          '[&_summary]:font-semibold [&_summary]:text-[#2563eb] [&_summary]:cursor-pointer',
          '[&>p]:text-[11px] [&>p]:py-[15px]',
        ].join(' ')}
      >
        <summary>See all checks and score breakdown</summary>
        <p>
          Each check earns its full weight when it passes, or zero when it does not.
          Weights total 100. These are our readiness guidelines, not AI platform
          requirements.
        </p>
        {result.checks.map((check) => (
          <div
            className={[
              'check-result flex justify-between items-start gap-[15px] border-b border-b-[#eef2f7]',
              'py-[13px] px-0 text-[12px] [&>span]:flex [&>span]:flex-wrap [&>span]:gap-[8px]',
              '[&>span]:min-w-0 [&_svg]:text-[#64748b] [&_small]:basis-[100%] [&_small]:text-[#64748b]',
              '[&_small]:text-[11px] [&_small]:[overflow-wrap:anywhere] [&>strong]:whitespace-nowrap',
            ].join(' ')}
            key={check.id}
          >
            <span>
              {check.passed ? <CircleCheck size={17} /> : <TriangleAlert size={17} />}
              {check.label}
              <small>{check.evidence}</small>
            </span>
            <strong>
              {check.points}/{check.maxPoints}
            </strong>
          </div>
        ))}
      </details>
    </div>
  );
}
