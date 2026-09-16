import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Globe,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Search,
  BrainCircuit,
  Gauge,
} from 'lucide-react';

import {
  analyzeWebsite,
  normalizeWebsiteUrl,
} from './api/analyzeWebsite.js';

import { AuditResults } from './components/AuditResults.jsx';
import { PricingPlans } from './components/PricingPlans.jsx';

/* =========================================
   LOADING STEPS
========================================= */

const loadingSteps = [
  {
    icon: Search,
    text: 'Reading website structure',
  },
  {
    icon: Globe,
    text: 'Checking technical signals',
  },
  {
    icon: BrainCircuit,
    text: 'Analysing AI readiness',
  },
  {
    icon: Gauge,
    text: 'Calculating your AEO score',
  },
];

const headingWords = ['How', 'ready', 'is', 'your', 'website'];

/* =========================================
   MAIN COMPONENT
========================================= */

export function AeoCheckerSection() {
  const [searchParams] = useSearchParams();
  const [website, setWebsite] = useState((searchParams.get('website') || '').slice(0, 2048));
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  /* Scroll animation state */
  const [isVisible, setIsVisible] = useState(false);

  const requestRef = useRef(null);
  const resultsRef = useRef(null);
  const sectionRef = useRef(null);

  /* =========================================
     CANCEL REQUEST ON UNMOUNT
  ========================================= */

  useEffect(() => {
    return () => requestRef.current?.abort();
  }, []);

  /* =========================================
     SCROLL REVEAL ANIMATION
  ========================================= */

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Animation sirf first time chalegi
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  /* =========================================
     LOADING STEP ANIMATION
  ========================================= */

  useEffect(() => {
    if (!loading) {
      setLoadingStep(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingStep((current) =>
        current < loadingSteps.length - 1
          ? current + 1
          : current
      );
    }, 2200);

    return () => clearInterval(interval);
  }, [loading]);

  /* =========================================
     FOCUS RESULTS
  ========================================= */

  useEffect(() => {
    if (result) {
      resultsRef.current?.focus({
        preventScroll: true,
      });
    }
  }, [result]);

  /* =========================================
     SUBMIT
  ========================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError('');
    setResult(null);

    let url;

    try {
      url = normalizeWebsiteUrl(website);
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    const controller = new AbortController();

    requestRef.current = controller;

    const timeout = setTimeout(() => {
      controller.abort();
    }, 30000);

    setLoading(true);
    setLoadingStep(0);

    try {
      const analysis = await analyzeWebsite(
        url,
        controller.signal
      );

      setResult(analysis);
    } catch (requestError) {
      setError(
        requestError.name === 'AbortError'
          ? 'The analysis took too long. Please try again.'
          : requestError.message
      );
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      id="aeo-checker"
      aria-labelledby="checker-heading"
      className="
        relative
        overflow-hidden
        border-y
        border-slate-200/80
        bg-[#f8faff]
        py-20
        sm:py-24
        lg:py-28
      "
    >
      {/* =====================================
          BACKGROUND GLOW - LEFT
      ====================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-48
          top-20
          h-[450px]
          w-[450px]
          rounded-full
          bg-blue-300/20
          blur-[120px]
        "
      />

      {/* =====================================
          BACKGROUND GLOW - RIGHT
      ====================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-48
          top-0
          h-[500px]
          w-[500px]
          rounded-full
          bg-violet-300/20
          blur-[130px]
        "
      />

      {/* =====================================
          GRID BACKGROUND
      ====================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.25]

          [background-image:linear-gradient(#dbe5f5_1px,transparent_1px),linear-gradient(90deg,#dbe5f5_1px,transparent_1px)]
          [background-size:45px_45px]

          [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]
        "
      />

      {/* =====================================
          CONTAINER
      ====================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-6xl
          px-5
          sm:px-7
          lg:px-8
        "
      >
        {/* ===================================
            HEADER
        ==================================== */}

        <div className="mx-auto max-w-4xl text-center">

          {/* BADGE */}

          <div
            className={`
              mb-6
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-200/80
              bg-white/80
              px-4
              py-2
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-blue-600
              shadow-sm
              backdrop-blur-md

              ${
                isVisible
                  ? 'badge-visible'
                  : 'reveal-hidden'
              }
            `}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  animate-ping
                  rounded-full
                  bg-blue-400
                  opacity-50
                "
              />

              <span
                className="
                  relative
                  inline-flex
                  h-2
                  w-2
                  rounded-full
                  bg-blue-600
                "
              />
            </span>

            Free AEO Readiness Check
          </div>

          {/* =================================
              ANIMATED MAIN HEADING
          ================================== */}

          <h2
            id="checker-heading"
            className="
              mx-auto
              max-w-[950px]
              text-[36px]
              font-bold
              leading-[1.07]
              tracking-[-0.04em]
              text-slate-900

              sm:text-[44px]
              md:text-[52px]
              lg:text-[58px]
            "
          >
            <span className="block">
              {headingWords.map((word, index) => (
                <span
                  key={word}
                  className={`
                    mr-[0.22em]
                    inline-block

                    ${
                      isVisible
                        ? 'heading-word-visible'
                        : 'heading-word-hidden'
                    }
                  `}
                  style={{
                    animationDelay: `${150 + index * 110}ms`,
                  }}
                >
                  {word}
                </span>
              ))}
            </span>

            <span
              className={`
                mt-1
                inline-block

                bg-gradient-to-r
                from-blue-600
                via-violet-600
                to-indigo-600

                bg-[length:200%_auto]
                bg-clip-text
                text-transparent

                ${
                  isVisible
                    ? 'heading-gradient-visible'
                    : 'heading-word-hidden'
                }
              `}
            >
              for AI-powered search?
            </span>
          </h2>

          {/* =================================
              DESCRIPTION
          ================================== */}

          <p
            className={`
              mx-auto
              mt-6
              max-w-2xl
              text-sm
              leading-7
              text-slate-500

              sm:text-[15px]

              ${
                isVisible
                  ? 'description-visible'
                  : 'reveal-hidden'
              }
            `}
          >
            Enter any public page URL and discover how well
            your website is structured for answer engines,
            AI search and modern discovery.
          </p>
        </div>

        {/* ===================================
            PROCESS STEPS
        ==================================== */}

        <div
          className={`
            mx-auto
            mt-9
            flex
            max-w-2xl
            items-center
            justify-center
            gap-2

            sm:gap-4

            ${
              isVisible
                ? 'process-visible'
                : 'reveal-hidden'
            }
          `}
        >
          <ProcessStep
            number="01"
            text="Enter URL"
          />

          <ProcessLine />

          <ProcessStep
            number="02"
            text="We Analyse"
          />

          <ProcessLine />

          <ProcessStep
            number="03"
            text="Get Score"
          />
        </div>

        {/* ===================================
            CHECKER CARD
        ==================================== */}

        <div
          className={`
            relative
            mx-auto
            mt-12
            max-w-4xl

            ${
              isVisible
                ? 'checker-visible'
                : 'reveal-hidden'
            }
          `}
        >
          {/* CARD GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              -inset-1
              rounded-3xl

              bg-gradient-to-r
              from-blue-400/20
              via-violet-400/20
              to-indigo-400/20

              blur-2xl
            "
          />

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            noValidate
            aria-busy={loading}
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white/95
              p-3

              shadow-[0_20px_60px_rgba(15,23,42,0.08)]

              backdrop-blur-xl
            "
          >
            <div
              className="
                flex
                flex-col
                gap-3

                sm:flex-row
                sm:items-center
              "
            >
              {/* =============================
                  URL INPUT
              ============================== */}

              <div
                className={`
                  group
                  flex
                  min-w-0
                  flex-1
                  items-center
                  gap-3
                  rounded-xl
                  border
                  bg-slate-50
                  px-4

                  transition-all
                  duration-300

                  ${
                    error
                      ? `
                        border-red-300
                        bg-red-50/30
                      `
                      : `
                        border-slate-200

                        focus-within:border-blue-400
                        focus-within:bg-white
                        focus-within:ring-4
                        focus-within:ring-blue-500/5
                      `
                  }
                `}
              >
                <Globe
                  size={20}
                  className="
                    shrink-0
                    text-slate-400

                    transition-colors
                    duration-300

                    group-focus-within:text-blue-600
                  "
                />

                <input
                  id="checker-website"
                  aria-label="Your website URL"
                  name="website"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="Enter your website — example.com"
                  value={website}
                  onChange={(event) => {
                    setWebsite(event.target.value);

                    if (error) {
                      setError('');
                    }
                  }}
                  required
                  maxLength={2048}
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                  aria-describedby={
                    error
                      ? 'checker-error'
                      : 'checker-help'
                  }
                  className="
                    min-w-0
                    flex-1
                    border-0
                    bg-transparent
                    py-[17px]
                    text-sm
                    text-slate-900
                    outline-none

                    placeholder:text-slate-400

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />

                {website.length > 4 && !error && (
                  <CheckCircle2
                    size={18}
                    className="
                      shrink-0
                      text-emerald-500
                    "
                  />
                )}
              </div>

              {/* =============================
                  SUBMIT BUTTON
              ============================== */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  relative

                  inline-flex
                  min-h-[54px]
                  shrink-0
                  items-center
                  justify-center
                  gap-2.5

                  overflow-hidden
                  rounded-xl

                  bg-gradient-to-r
                  from-blue-600
                  to-blue-700

                  px-7

                  text-xs
                  font-semibold
                  text-white

                  shadow-lg
                  shadow-blue-600/20

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:shadow-xl
                  hover:shadow-blue-600/25

                  active:translate-y-0

                  disabled:cursor-not-allowed
                  disabled:opacity-70

                  sm:min-w-[200px]
                "
              >
                {/* BUTTON SHINE */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    -left-[80%]
                    w-[45%]
                    -skew-x-12
                    bg-white/20

                    transition-all
                    duration-700

                    group-hover:left-[130%]
                  "
                />

                {loading ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="
                        animate-spin
                        motion-reduce:animate-none
                      "
                    />

                    Analysing Website...
                  </>
                ) : (
                  <>
                    Check My AEO Score

                    <ArrowRight
                      size={17}
                      className="
                        transition-transform
                        duration-300

                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}
              </button>
            </div>

            {/* =============================
                HELPER TEXT
            ============================== */}

            <div
              id="checker-help"
              className="
                mt-3
                flex
                items-center
                justify-center
                gap-2
                px-2

                text-center
                text-[10px]
                text-slate-400
              "
            >
              <ShieldCheck
                size={13}
                className="
                  shrink-0
                  text-slate-500
                "
              />

              <span>
                No signup required · Free page-level analysis ·
                Results in seconds
              </span>
            </div>

            {/* =============================
                ERROR
            ============================== */}

            {error && (
              <div
                id="checker-error"
                role="alert"
                className="
                  mt-3
                  rounded-lg
                  border
                  border-red-100
                  bg-red-50
                  px-4
                  py-3

                  text-xs
                  text-red-600
                "
              >
                {error}
              </div>
            )}
          </form>
        </div>

        {/* ===================================
            LOADING STATE
        ==================================== */}

        {loading && (
          <div
            role="status"
            className="
              loading-reveal
              mx-auto
              mt-8
              max-w-3xl
              rounded-2xl
              border
              border-slate-200
              bg-white/80
              p-5

              shadow-sm
              backdrop-blur-xl

              sm:p-6
            "
          >
            {/* LOADING HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-5
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    text-slate-700
                  "
                >
                  Analysing your website
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    text-slate-400
                  "
                >
                  Running AEO readiness checks...
                </p>
              </div>

              <span
                className="
                  text-xs
                  font-bold
                  text-blue-600
                "
              >
                {Math.round(
                  ((loadingStep + 1) /
                    loadingSteps.length) *
                    100
                )}
                %
              </span>
            </div>

            {/* =============================
                PROGRESS BAR
            ============================== */}

            <div
              className="
                mt-4
                h-1.5
                overflow-hidden
                rounded-full
                bg-slate-100
              "
            >
              <div
                className="
                  h-full
                  rounded-full

                  bg-gradient-to-r
                  from-blue-600
                  via-indigo-500
                  to-violet-600

                  transition-all
                  duration-700
                  ease-out
                "
                style={{
                  width: `${
                    ((loadingStep + 1) /
                      loadingSteps.length) *
                    100
                  }%`,
                }}
              />
            </div>

            {/* =============================
                LOADING STEPS
            ============================== */}

            <div
              className="
                mt-5
                grid
                grid-cols-1
                gap-2

                min-[480px]:grid-cols-2
                sm:grid-cols-4
              "
            >
              {loadingSteps.map((step, index) => {
                const Icon = step.icon;

                const completed =
                  index < loadingStep;

                const active =
                  index === loadingStep;

                return (
                  <div
                    key={step.text}
                    className={`
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      px-3
                      py-3

                      text-[10px]
                      font-medium

                      transition-all
                      duration-300

                      ${
                        active
                          ? `
                            bg-blue-50
                            text-blue-700
                            ring-1
                            ring-blue-100
                          `
                          : completed
                            ? `
                              bg-emerald-50/50
                              text-emerald-600
                            `
                            : `
                              text-slate-400
                            `
                      }
                    `}
                  >
                    {completed ? (
                      <CheckCircle2
                        size={15}
                        className="shrink-0"
                      />
                    ) : (
                      <Icon
                        size={15}
                        className={`
                          shrink-0

                          ${
                            active
                              ? 'animate-pulse'
                              : ''
                          }
                        `}
                      />
                    )}

                    <span>
                      {step.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================
            RESULTS
        ==================================== */}

        {result && !loading && (
          <div
            ref={resultsRef}
            tabIndex={-1}
            aria-label="Your website analysis"
            className="
              result-reveal
              mt-12
              outline-none
            "
          >
            {/* SUCCESS MESSAGE */}

            <div
              className="
                mb-6
                flex
                flex-wrap
                items-center
                justify-center
                gap-2

                text-center
                text-xs
                font-medium
                text-emerald-600
              "
            >
              <CheckCircle2
                size={16}
                className="shrink-0"
              />

              <span>
                Analysis complete for
              </span>

              <span
                className="
                  max-w-[300px]
                  truncate
                  font-semibold
                "
              >
                {result.url}
              </span>
            </div>

            <AuditResults result={result} />

            <PricingPlans website={result.url} />
          </div>
        )}

        {/* ===================================
            BOTTOM NOTE
        ==================================== */}

        {!result && !loading && (
          <div
            className={`
              mx-auto
              mt-7
              flex
              max-w-xl
              items-start
              justify-center
              gap-2

              text-center
              text-[10px]
              leading-5
              text-slate-400

              ${
                isVisible
                  ? 'note-visible'
                  : 'reveal-hidden'
              }
            `}
          >
            <Sparkles
              size={13}
              className="
                mt-1
                shrink-0
                text-slate-500
              "
            />

            <p>
              Your score is calculated from measurable page
              signals — not randomly generated. It represents
              AEO readiness, not guaranteed AI recommendations.
            </p>
          </div>
        )}
      </div>

      {/* =====================================
          ALL ANIMATIONS
      ====================================== */}

      <style>
        {`
          /* -----------------------------
             HEADING WORD
          ------------------------------ */

          @keyframes wordReveal {
            0% {
              opacity: 0;
              transform: translateY(35px);
              filter: blur(7px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }

          /* -----------------------------
             GRADIENT HEADING
          ------------------------------ */

          @keyframes gradientReveal {
            0% {
              opacity: 0;
              transform: translateY(30px);
              filter: blur(7px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }

          @keyframes gradientMove {
            0% {
              background-position: 0% center;
            }

            50% {
              background-position: 100% center;
            }

            100% {
              background-position: 0% center;
            }
          }

          /* -----------------------------
             GENERAL REVEAL
          ------------------------------ */

          @keyframes revealUp {
            0% {
              opacity: 0;
              transform: translateY(22px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* -----------------------------
             CHECKER CARD
          ------------------------------ */

          @keyframes checkerReveal {
            0% {
              opacity: 0;
              transform:
                translateY(30px)
                scale(0.97);
            }

            100% {
              opacity: 1;
              transform:
                translateY(0)
                scale(1);
            }
          }

          /* -----------------------------
             RESULTS
          ------------------------------ */

          @keyframes resultReveal {
            0% {
              opacity: 0;
              transform:
                translateY(25px)
                scale(0.99);
            }

            100% {
              opacity: 1;
              transform:
                translateY(0)
                scale(1);
            }
          }

          /* -----------------------------
             HIDDEN
          ------------------------------ */

          .reveal-hidden {
            opacity: 0;
            transform: translateY(20px);
          }

          .heading-word-hidden {
            opacity: 0;
            transform: translateY(35px);
            filter: blur(7px);
          }

          /* -----------------------------
             BADGE
          ------------------------------ */

          .badge-visible {
            animation:
              revealUp
              600ms
              cubic-bezier(0.22, 1, 0.36, 1)
              forwards;
          }

          /* -----------------------------
             HEADING WORDS
          ------------------------------ */

          .heading-word-visible {
            opacity: 0;

            animation:
              wordReveal
              700ms
              cubic-bezier(0.22, 1, 0.36, 1)
              forwards;
          }

          /* -----------------------------
             GRADIENT TEXT
          ------------------------------ */

          .heading-gradient-visible {
            opacity: 0;

            animation:
              gradientReveal
                750ms
                cubic-bezier(0.22, 1, 0.36, 1)
                750ms
                forwards,

              gradientMove
                4s
                ease-in-out
                1.6s
                infinite;
          }

          /* -----------------------------
             DESCRIPTION
          ------------------------------ */

          .description-visible {
            opacity: 0;

            animation:
              revealUp
              650ms
              cubic-bezier(0.22, 1, 0.36, 1)
              900ms
              forwards;
          }

          /* -----------------------------
             PROCESS
          ------------------------------ */

          .process-visible {
            opacity: 0;

            animation:
              revealUp
              650ms
              cubic-bezier(0.22, 1, 0.36, 1)
              1050ms
              forwards;
          }

          /* -----------------------------
             CHECKER
          ------------------------------ */

          .checker-visible {
            opacity: 0;

            animation:
              checkerReveal
              750ms
              cubic-bezier(0.22, 1, 0.36, 1)
              1150ms
              forwards;
          }

          /* -----------------------------
             NOTE
          ------------------------------ */

          .note-visible {
            opacity: 0;

            animation:
              revealUp
              600ms
              cubic-bezier(0.22, 1, 0.36, 1)
              1350ms
              forwards;
          }

          /* -----------------------------
             LOADING
          ------------------------------ */

          .loading-reveal {
            animation:
              revealUp
              450ms
              ease-out
              forwards;
          }

          /* -----------------------------
             RESULT
          ------------------------------ */

          .result-reveal {
            animation:
              resultReveal
              600ms
              cubic-bezier(0.22, 1, 0.36, 1)
              forwards;
          }

          /* -----------------------------
             ACCESSIBILITY
          ------------------------------ */

          @media (prefers-reduced-motion: reduce) {
            .reveal-hidden,
            .heading-word-hidden,
            .badge-visible,
            .heading-word-visible,
            .heading-gradient-visible,
            .description-visible,
            .process-visible,
            .checker-visible,
            .note-visible,
            .loading-reveal,
            .result-reveal {
              opacity: 1 !important;
              transform: none !important;
              filter: none !important;
              animation: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}

/* =========================================
   PROCESS STEP
========================================= */

function ProcessStep({ number, text }) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
      "
    >
      <span
        className="
          grid
          h-7
          w-7
          shrink-0
          place-items-center
          rounded-full

          border
          border-blue-100
          bg-blue-50

          text-[9px]
          font-bold
          text-blue-600
        "
      >
        {number}
      </span>

      <span
        className="
          hidden
          whitespace-nowrap

          text-[11px]
          font-medium
          text-slate-500

          sm:block
        "
      >
        {text}
      </span>
    </div>
  );
}

/* =========================================
   PROCESS LINE
========================================= */

function ProcessLine() {
  return (
    <div
      className="
        h-px
        w-6

        bg-gradient-to-r
        from-blue-200
        to-violet-200

        sm:w-12
      "
    />
  );
}
