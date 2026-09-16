export function ProcessStep({ step, index }) {
  return (
    <div
      className={[
        "process-step relative [&:not(:last-child):after]:content-['']",
        '[&:not(:last-child):after]:h-[1px] [&:not(:last-child):after]:absolute',
        '[&:not(:last-child):after]:top-[23px] [&:not(:last-child):after]:left-[65px]',
        '[&:not(:last-child):after]:right-[-14px]',
        '[&:not(:last-child):after]:[background:linear-gradient(90deg,_#d7e3fb,_#e2e8f0)]',
        '[&_h3]:text-[16px] [&_h3]:mb-[8px] [&_p]:text-[12px] max-[720px]:pl-[68px]',
        'max-[720px]:min-h-[78px] max-[720px]:[&:not(:last-child):after]:w-[1px]',
        'max-[720px]:[&:not(:last-child):after]:h-auto',
        'max-[720px]:[&:not(:last-child):after]:left-[23px]',
        'max-[720px]:[&:not(:last-child):after]:top-[55px]',
        'max-[720px]:[&:not(:last-child):after]:bottom-[-19px]',
        'max-[720px]:[&:not(:last-child):after]:right-auto max-[720px]:[&_p]:text-[13px]',
        'max-[720px]:[&_h3]:text-[17px] max-[720px]:[&_h3]:pt-[1px]',
      ].join(' ')}
    >
      <span
        className={[
          'step-number grid place-items-center w-[46px] h-[46px] border border-[#dce6fa] bg-[#f4f7ff]',
          'text-[#2563eb] rounded-[50%] text-[14px] font-[650] mb-[21px] max-[720px]:absolute',
          'max-[720px]:left-0 max-[720px]:top-0',
        ].join(' ')}
      >
        0{index + 1}
      </span>
      <h3>{step[0]}</h3>
      <p>{step[1]}</p>
    </div>
  );
}
