import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button.jsx';
import { ShieldCheck } from 'lucide-react';
import { AnswerVisual } from './AnswerVisual.jsx';

const headings = [
  {
    normal: ['Make', 'Your', 'Business', 'the'],
    highlight: ['Answer', 'AI', 'Recommends'],
  },
  {
    normal: ['Make', 'Your', 'Business', 'the'],
    highlight: ['Brand', 'AI', 'Discovers'],
  },
  {
    normal: ['Make', 'Your', 'Business', 'the'],
    highlight: ['Source', 'AI', 'Recognizes'],
  },
];

export function HeroSection() {
  const [headingIndex, setHeadingIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  const currentHeading = headings[headingIndex];

  const allWords = [
    ...currentHeading.normal.map((word) => ({
      word,
      highlight: false,
    })),

    ...currentHeading.highlight.map((word) => ({
      word,
      highlight: true,
    })),
  ];

  useEffect(() => {
    let timeout;

    // Type next word
    if (wordIndex < allWords.length) {
      timeout = setTimeout(() => {
        setWordIndex((current) => current + 1);
      }, 500);
    }

    // All words complete
    else {
      timeout = setTimeout(() => {
        setWordIndex(0);

        setHeadingIndex(
          (current) => (current + 1) % headings.length
        );
      }, 2600);
    }

    return () => clearTimeout(timeout);
  }, [wordIndex, headingIndex, allWords.length]);

  return (
    <section
      className="
        relative overflow-hidden
        bg-[radial-gradient(ellipse_at_83%_43%,_#eff4ff_0%,_transparent_45%)]
        px-0 pb-[71px] pt-[20px]

        min-[1450px]:py-[90px]

        max-[950px]:pb-[60px]
        max-[950px]:pt-[55px]

        max-[720px]:pb-[45px]
        max-[720px]:pt-[41px]
      "
    >
      <div
        className="
          mx-auto grid
          w-[min(1180px,calc(100%-80px))]
          grid-cols-[1.13fr_1fr]
          items-center
          gap-7

          max-[1150px]:w-[calc(100%-56px)]
          max-[1150px]:gap-6

          max-[950px]:grid-cols-[1.05fr_1fr]
          max-[950px]:gap-3

          max-[720px]:w-[calc(100%-40px)]
          max-[720px]:grid-cols-1
          max-[720px]:gap-8

          max-[380px]:w-[calc(100%-32px)]
        "
      >
        {/* LEFT */}
        <div>

          {/* Badge */}
          <div
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              rounded-md
              border border-[#e2eafa]
              bg-[#f4f7fe]
              px-3 py-2
              text-[10px]
              font-semibold
              text-[#48638f]

              max-[950px]:text-[8px]

              max-[720px]:mb-[22px]
              max-[720px]:text-[9px]
            "
          >
            <span
              className="
                h-[5px]
                w-[5px]
                rounded-full
                bg-[#4a7ce8]
              "
            />

            Answer Engine Optimization for Modern Search
          </div>

          {/* ======================= */}
          {/* WORD TYPE HEADING */}
          {/* ======================= */}

          <h1
            className="
              mb-[23px]
              min-h-[182px]

              text-[56px]
              font-bold
              leading-[1.08]
              tracking-[-0.03em]
              text-[#102a43]

              min-[1450px]:text-[62px]

              max-[1150px]:text-[49px]

              max-[950px]:text-[44px]

              max-[720px]:min-h-[150px]
              max-[720px]:text-[clamp(40px,8.5vw,58px)]

              max-[380px]:text-[38px]
            "
          >
            {/* First Line */}
            <span className="block">
              {allWords.slice(0, 2).map((item, index) => {
                if (index >= wordIndex) return null;

                return (
                  <AnimatedWord
                    key={`${headingIndex}-${index}`}
                    word={item.word}
                    highlight={item.highlight}
                  />
                );
              })}
            </span>

            {/* Second Line */}
            <span className="block">
              {allWords.slice(2, 4).map((item, index) => {
                const actualIndex = index + 2;

                if (actualIndex >= wordIndex) return null;

                return (
                  <AnimatedWord
                    key={`${headingIndex}-${actualIndex}`}
                    word={item.word}
                    highlight={item.highlight}
                  />
                );
              })}
            </span>

            {/* Gradient Dynamic Line */}
            <span className="block">
              {allWords.slice(4).map((item, index) => {
                const actualIndex = index + 4;

                if (actualIndex >= wordIndex) return null;

                return (
                  <AnimatedWord
                    key={`${headingIndex}-${actualIndex}`}
                    word={item.word}
                    highlight
                  />
                );
              })}

              {/* Typing Cursor */}
              <span
                className="
                  ml-1
                  inline-block
                  h-[0.85em]
                  w-[3px]
                  translate-y-[4px]
                  animate-pulse
                  rounded-full
                  bg-[#2563eb]
                "
              />
            </span>
          </h1>

          {/* Description */}
          <p
            className="
              mb-[27px]
              max-w-[470px]
              text-[15px]
              leading-[1.85]
              text-[#64748b]

              max-[950px]:text-[13px]

              max-[720px]:max-w-[480px]
              max-[720px]:text-[14px]
            "
          >
            We help businesses improve their visibility across
            Google AI Overviews, ChatGPT, Bing Copilot and other
            AI-powered search experiences.
          </p>

          {/* CTA */}
          <div
            className="
              flex flex-wrap gap-3

              max-[380px]:flex-col
              max-[380px]:items-stretch
            "
          >
            <Button to="/#aeo-checker">
              Check Your Free AEO Score
            </Button>

            <Button secondary to="/services">
              Explore Our Services
            </Button>
          </div>

          {/* Trust */}
          <div
            className="
              mt-[22px]
              flex
              items-start
              gap-[9px]
              text-[10px]
              leading-[1.8]
              text-[#8490a1]
            "
          >
            <ShieldCheck
              size={16}
              className="
                mt-[3px]
                shrink-0
                text-[#7e93ad]
              "
            />

            <span>
              No false promises. No guaranteed citations.
              <br />
              Just a clear, research-led strategy.
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full">
          <AnswerVisual />
        </div>
      </div>
    </section>
  );
}

/* ===================================== */
/* INDIVIDUAL WORD ANIMATION */
/* ===================================== */

function AnimatedWord({ word, highlight = false }) {
  return (
    <span
      className={`
        mr-[0.22em]
        inline-block

        animate-[wordReveal_0.45s_cubic-bezier(0.16,1,0.3,1)_both]

        ${
          highlight
            ? `
              bg-gradient-to-r
              from-[#2563eb]
              via-[#5946e5]
              to-[#7c3aed]
              bg-clip-text
              text-transparent
            `
            : 'text-[#102a43]'
        }
      `}
    >
      {word}

      <style>
        {`
          @keyframes wordReveal {
            0% {
              opacity: 0;
              transform: translateY(12px);
              filter: blur(5px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }
        `}
      </style>
    </span>
  );
}