import {
  Sparkles,
  MessageCircle,
  Command,
  Mic,
  Search,
  ArrowUpRight,
} from 'lucide-react';

const platforms = [
  {
    name: 'Google AI Overviews',
    shortName: 'Google AI',
    icon: Sparkles,
    description: 'AI-generated search answers',
  },
  {
    name: 'ChatGPT',
    shortName: 'ChatGPT',
    icon: MessageCircle,
    description: 'Conversational discovery',
  },
  {
    name: 'Bing Copilot',
    shortName: 'Copilot',
    icon: Command,
    description: 'AI-powered search',
  },
  {
    name: 'Voice Search',
    shortName: 'Voice',
    icon: Mic,
    description: 'Spoken answers',
  },
  {
    name: 'Traditional Search',
    shortName: 'Search',
    icon: Search,
    description: 'Organic discovery',
  },
];

export function PlatformStrip() {
  return (
    <section
      className="
        relative overflow-hidden
        border-y border-[#eef1f6]
        bg-white
        py-8
        max-[720px]:py-7
      "
    >
      {/* Background Glow */}
      <div
        className="
          pointer-events-none
          absolute left-1/2 top-1/2
          h-[180px] w-[700px]
          -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-gradient-to-r
          from-blue-100/40
          via-violet-100/30
          to-blue-100/40
          blur-[70px]
        "
      />

      <div
        className="
          relative z-10
          mx-auto
          w-[min(1180px,calc(100%-80px))]
          max-[1150px]:w-[calc(100%-56px)]
          max-[720px]:w-[calc(100%-40px)]
          max-[380px]:w-[calc(100%-32px)]
        "
      >
        {/* Top Label */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className="
                absolute inline-flex h-full w-full
                animate-ping rounded-full
                bg-blue-400 opacity-50
              "
            />

            <span
              className="
                relative inline-flex
                h-2 w-2 rounded-full
                bg-blue-500
              "
            />
          </span>

          <p
            className="
              text-center
              text-[10px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-[#8b96a6]
              max-[720px]:text-[9px]
            "
          >
            Build visibility across modern search experiences
          </p>
        </div>

        {/* Platform Cards */}
        <div
          className="
            grid grid-cols-5 gap-3

            max-[950px]:grid-cols-3
            max-[720px]:grid-cols-2
            max-[420px]:grid-cols-1
          "
        >
          {platforms.map((platform, index) => {
            const Icon = platform.icon;

            return (
              <div
                key={platform.name}
                className="
                  group
                  relative
                  cursor-default
                  overflow-hidden
                  rounded-xl
                  border border-transparent
                  px-4 py-3.5

                  transition-all
                  duration-300
                  ease-out

                  hover:-translate-y-1
                  hover:border-[#e1e9fb]
                  hover:bg-white
                  hover:shadow-[0_12px_35px_rgba(37,99,235,0.08)]
                "
                style={{
                  animation: `platformFadeUp 0.5s ease-out ${
                    index * 0.08
                  }s both`,
                }}
              >
                {/* Hover Gradient */}
                <div
                  className="
                    pointer-events-none
                    absolute inset-0
                    bg-gradient-to-br
                    from-[#eff5ff]
                    via-white
                    to-[#f7f4ff]

                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />

                <div className="relative z-10 flex items-center gap-3">
                  
                  {/* Icon */}
                  <div
                    className="
                      grid h-10 w-10
                      shrink-0
                      place-items-center
                      rounded-[10px]
                      border border-[#e7edf8]
                      bg-[#f7f9fd]
                      text-[#718096]

                      transition-all
                      duration-300

                      group-hover:scale-105
                      group-hover:border-[#dce7ff]
                      group-hover:bg-[#edf4ff]
                      group-hover:text-[#2563eb]
                    "
                  >
                    <Icon size={19} strokeWidth={1.8} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span
                        className="
                          truncate
                          text-[12px]
                          font-semibold
                          text-[#536176]

                          transition-colors
                          duration-300

                          group-hover:text-[#253b5c]
                        "
                      >
                        {platform.name}
                      </span>

                      <ArrowUpRight
                        size={11}
                        className="
                          shrink-0
                          translate-y-1
                          text-[#2563eb]
                          opacity-0

                          transition-all
                          duration-300

                          group-hover:translate-y-0
                          group-hover:opacity-100
                        "
                      />
                    </div>

                    <span
                      className="
                        mt-0.5 block
                        text-[8px]
                        text-[#9aa5b5]

                        opacity-0
                        transition-all
                        duration-300

                        group-hover:opacity-100
                      "
                    >
                      {platform.description}
                    </span>
                  </div>
                </div>

                {/* Bottom Active Line */}
                <div
                  className="
                    absolute bottom-0
                    left-1/2
                    h-[2px]
                    w-0
                    -translate-x-1/2
                    rounded-full

                    bg-gradient-to-r
                    from-[#2563eb]
                    to-[#7c3aed]

                    transition-all
                    duration-300

                    group-hover:w-[55%]
                  "
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Text */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div
            className="
              h-px w-8
              bg-gradient-to-r
              from-transparent
              to-[#dbe4f2]
            "
          />

          <span
            className="
              text-[8px]
              tracking-[0.05em]
              text-[#a1abba]
            "
          >
            One strategy. Multiple discovery channels.
          </span>

          <div
            className="
              h-px w-8
              bg-gradient-to-l
              from-transparent
              to-[#dbe4f2]
            "
          />
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes platformFadeUp {
            from {
              opacity: 0;
              transform: translateY(12px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </section>
  );
}