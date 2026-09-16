import {
  Search,
  CornerDownRight,
  Sparkles,
  Globe,
  Check,
  ChartNoAxesCombined,
  ArrowUp,
} from 'lucide-react';

export function AnswerVisual({
  businessName = 'Your business',
  domain = 'yourwebsite.com',
  visibility = 'Growing',
  contentClarity = 'Strong',
  entitySignals = 'Improved',
  query = 'Which company can improve my AI search visibility?',
  chartData = [12, 19, 16, 28, 24, 36, 43],
}) {
  return (
    <div
      className="
        relative isolate h-[420px] w-full
        max-[950px]:scale-[0.92] max-[950px]:origin-right
        max-[720px]:mx-auto max-[720px]:h-[425px]
        max-[720px]:max-w-[470px] max-[720px]:scale-100
        max-[380px]:h-[420px]
      "
      aria-label="Illustrative AI answer interface"
    >
      {/* Background Orbits */}
      <div
        className="
          absolute left-[50px] top-[5px] -z-10
          h-[405px] w-[405px] rounded-full
          border border-[#dae4f6]/40
          max-[950px]:left-0 max-[950px]:max-w-full
          max-[720px]:left-[15px]
        "
      />

      <div
        className="
          absolute left-[90px] top-[44px] -z-10
          h-[325px] w-[325px] rounded-full
          border border-[#dae4f6]/40
          max-[950px]:left-0 max-[950px]:max-w-full
          max-[720px]:left-[15px]
        "
      />

      {/* Query Card */}
      <div
        className="
          absolute left-[5px] right-[22px] top-[30px] z-20
          flex -rotate-2 items-center gap-3
          rounded-xl border border-[#e5eaf2]
          bg-white px-4 py-[18px]
          text-[12px] leading-[1.65]
          shadow-[0_8px_26px_rgba(41,79,132,0.06)]
          transition-transform duration-300
          hover:rotate-0 hover:-translate-y-1
          max-[950px]:left-0 max-[950px]:right-0 max-[950px]:text-[10px]
          max-[720px]:left-[2px] max-[720px]:right-[25px]
          max-[720px]:top-[27px] max-[720px]:text-[12px]
          max-[380px]:gap-2 max-[380px]:px-3
          max-[380px]:py-[15px] max-[380px]:text-[10px]
        "
      >
        <div className="rounded-lg bg-[#f0f5ff] p-[9px] text-[#2563eb]">
          <Search size={19} />
        </div>

        <span className="text-slate-600">
          {query}
        </span>

        <CornerDownRight
          size={17}
          className="ml-auto shrink-0 text-[#95a2b4]"
        />
      </div>

      {/* AI Answer Card */}
      <div
        className="
          absolute left-[29px] right-0 top-[127px]
          rounded-xl border border-[#dce5f2]
          bg-white px-[23px] py-[21px]
          shadow-[0_12px_35px_rgba(54,82,132,0.055)]
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-[0_18px_45px_rgba(54,82,132,0.10)]
          max-[1150px]:p-[19px]
          max-[950px]:left-2
          max-[720px]:left-5 max-[720px]:right-[10px]
          max-[720px]:top-[130px]
          max-[380px]:left-[5px] max-[380px]:right-0
          max-[380px]:p-[17px]
        "
      >
        {/* Answer Header */}
        <div className="mb-[18px] flex items-center justify-between">
          <span className="flex items-center gap-2 text-[11px] font-semibold text-[#2563eb]">
            <Sparkles size={17} />
            AI-powered answer
          </span>

          <span
            className="
              text-[6px] tracking-[0.65px] text-[#8795a9]
              max-[950px]:hidden
              max-[720px]:block max-[720px]:text-[6px]
              max-[380px]:hidden
            "
          >
            ILLUSTRATIVE EXAMPLE
          </span>
        </div>

        {/* Answer */}
        <p className="max-w-[340px] text-[11px] leading-[1.85] text-[#708096]">
          Look for a partner that combines{' '}
          <strong className="font-medium text-[#37465c]">
            clear content, technical expertise
          </strong>{' '}
          and a research-led approach.
        </p>

        {/* Recommendation */}
        <div
          className="
            mt-[14px] flex items-center gap-[10px]
            rounded-lg border border-[#e6edfd]
            bg-[#f6f8fe] p-3
          "
        >
          <div
            className="
              grid h-[31px] w-[31px] shrink-0
              place-items-center rounded-lg
              bg-[#edf2ff] text-[#2563eb]
            "
          >
            <Sparkles size={17} />
          </div>

          <div className="flex min-w-0 flex-col gap-[3px]">
            <strong className="truncate text-[11px] font-semibold text-slate-700">
              {businessName}
            </strong>

            <span className="text-[8px] text-[#7b8a9e]">
              Expertise that answers the question.
            </span>
          </div>

          <span
            className="
              ml-auto rounded bg-[#e7efff]
              px-[5px] py-[2px]
              text-[8px] text-[#2563eb]
            "
          >
            1
          </span>
        </div>

        {/* Fake Answer Lines */}
        <div className="my-[15px] grid gap-[6px]">
          <div className="h-1 w-[95%] animate-pulse rounded bg-[#edf1f7]" />
          <div className="h-1 w-[65%] animate-pulse rounded bg-[#edf1f7]" />
        </div>

        {/* Source */}
        <div
          className="
            flex items-center gap-[13px]
            border-t border-[#edf1f7] pt-[11px]
            text-[8px] text-[#8190a4]
          "
        >
          <span className="flex items-center gap-1">
            <Globe size={12} />
            {domain}
          </span>

          <span className="flex items-center gap-1 text-[#448779]">
            <Check size={12} />
            Relevant source
          </span>
        </div>
      </div>

      {/* Visibility Card */}
      <div
        className="
          absolute bottom-[35px] right-[-13px] z-30
          flex rotate-2 items-center gap-[10px]
          rounded-[10px] border border-[#e0e9f2]
          bg-white px-[18px] py-[14px]
          shadow-[0_8px_23px_rgba(38,77,138,0.07)]
          transition-all duration-300
          hover:rotate-0 hover:scale-[1.03]
          max-[1150px]:right-[-7px]
          max-[720px]:bottom-[33px] max-[720px]:right-0
          max-[380px]:bottom-[36px] max-[380px]:p-3
        "
      >
        <div
          className="
            grid h-[35px] w-[35px] place-items-center
            rounded-lg bg-[#eefaf6] text-[#28997e]
          "
        >
          <ChartNoAxesCombined size={20} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[9px] text-[#7e8da1]">
            AI visibility
          </span>

          <strong className="flex items-center gap-1 text-[12px] text-[#23866b]">
            {visibility}
            <ArrowUp size={12} />
          </strong>
        </div>

        {/* Dynamic Chart */}
        <div className="flex h-[45px] items-end gap-1 pl-[10px]">
          {chartData.map((height, index) => (
            <div
              key={index}
              className="
                w-[5px] rounded-sm bg-[#8fd5c2]
                transition-all duration-500
                last:bg-[#31a38a]
              "
              style={{ height: `${height}px` }}
            />
          ))}
        </div>
      </div>

      {/* AEO Signals */}
      <div
        className="
          absolute bottom-[3px] left-[3px]
          flex items-center gap-[5px]
          whitespace-nowrap rounded-md
          border border-[#e5ebf3]
          bg-white px-[13px] py-[10px]
          text-[8px] text-[#7a889c]
          shadow-[0_4px_15px_rgba(38,77,138,0.03)]
          max-[950px]:left-0 max-[950px]:px-2 max-[950px]:text-[7px]
          max-[720px]:bottom-0 max-[720px]:left-[5px]
          max-[720px]:text-[8px]
          max-[380px]:left-0 max-[380px]:text-[7px]
        "
      >
        <span className="h-[5px] w-[5px] rounded-full bg-[#4caf8c]" />

        Content clarity:
        <strong className="font-medium text-[#466254]">
          {contentClarity}
        </strong>

        <span className="mx-[6px] h-[10px] w-px bg-[#e4e9ee]" />

        Entity signals:
        <strong className="font-medium text-[#466254]">
          {entitySignals}
        </strong>
      </div>

      {/* Caption */}
      <span
        className="
          absolute bottom-[-23px] left-[55px]
          text-[8px] tracking-[0.2px] text-[#9ba5b5]
          max-[720px]:bottom-[-22px] max-[720px]:left-5
          max-[380px]:left-[10px] max-[380px]:text-[7px]
        "
      >
        Better information. Better understanding. More opportunity.
      </span>
    </div>
  );
}