const cheerio = require("cheerio");

const { AuditError } = require("./fetchPublicPage");

function text(value) {
  return value.replace(/\s+/g, " ").trim();
}

function collectTypes(value, types = new Set()) {
  if (!value || typeof value !== "object") return types;

  for (const [key, item] of Object.entries(value)) {
    if (key === "@type") {
      for (const type of Array.isArray(item) ? item : [item]) {
        if (typeof type === "string") {
          types.add(
            type.replace(/^https?:\/\/schema.org\//, "")
          );
        }
      }
    } else if (item && typeof item === "object") {
      collectTypes(item, types);
    }
  }

  return types;
}

function scorePage({ html, url, headers = {} }) {
  const $ = Buffer.isBuffer(html)
    ? cheerio.loadBuffer(html)
    : cheerio.load(html);

  const title = text($("title").first().text());

  const description =
    $("meta")
      .filter(
        (_, element) =>
          ($(element).attr("name") || "").toLowerCase() === "description"
      )
      .first()
      .attr("content")
      ?.trim() || "";

  const schemaTypes = new Set();
  let validSchemaBlocks = 0;

  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const types = collectTypes(
        JSON.parse($(element).html())
      );

      if (types.size) {
        validSchemaBlocks += 1;
      }

      types.forEach((type) => schemaTypes.add(type));
    } catch {
      // Invalid JSON-LD earns no points.
    }
  });

  const robots = $("meta")
    .filter((_, element) =>
      /^(robots|googlebot|bingbot)$/i.test(
        $(element).attr("name") || ""
      )
    )
    .map(
      (_, element) =>
        $(element).attr("content") || ""
    )
    .get()
    .join(",");

  const noindex = /\b(noindex|none)\b/i.test(
    `${robots},${headers["x-robots-tag"] || ""}`
  );

  $(
    'script, style, template, noscript, [hidden], [aria-hidden="true"]'
  ).remove();

  const bodyText = text($("body").text());

  if (bodyText.length < 80) {
    throw new AuditError(
      "There is not enough readable HTML to score this page. It may load its content with JavaScript. Try a content-rich service page or request a manual audit."
    );
  }

  if (
    /^(just a moment|access denied|attention required|verify you are human)/i.test(
      title
    )
  ) {
    throw new AuditError(
      "The website returned an access challenge. We cannot score it reliably; try another public page."
    );
  }

  const h1Count = $("h1").filter(
    (_, element) =>
      text($(element).text()).length > 0
  ).length;

  const h2Count = $("h2").filter(
    (_, element) =>
      text($(element).text()).length > 0
  ).length;

  const answerParagraphs = $("p").filter(
    (_, element) => {
      const words = text(
        $(element).text()
      ).split(/\s+/).length;

      return words >= 20 && words <= 100;
    }
  ).length;

  const questionHeadings = $(
    "h2, h3, summary"
  ).filter((_, element) =>
    /\?|^(what|how|why|when|where|who|can|does|is)\b/i.test(
      text($(element).text())
    )
  ).length;

  const hasIdentity = $("a[href]")
    .toArray()
    .some((element) =>
      /about|team|author|company/i.test(
        `${$(element).attr("href")} ${text(
          $(element).text()
        )}`
      )
    );

  const hasContact = $("a[href]")
    .toArray()
    .some((element) =>
      /contact|^mailto:|^tel:/i.test(
        `${$(element).attr("href")} ${text(
          $(element).text()
        )}`
      )
    );

  const checks = [];

  function addCheck(
    id,
    label,
    maxPoints,
    passed,
    evidence,
    reason,
    recommendation
  ) {
    checks.push({
      id,
      label,
      maxPoints,
      points: passed ? maxPoints : 0,
      passed,
      evidence,
      reason,
      recommendation,
    });
  }

  // HTTPS
  addCheck(
    "https",
    "Secure page delivery",
    5,
    url.startsWith("https:"),
    `Final page uses ${new URL(url)
      .protocol.replace(":", "")
      .toUpperCase()}.`,
    "The final page is served without HTTPS.",
    "Enable HTTPS and redirect HTTP requests to the secure page."
  );

  // TITLE
  addCheck(
    "title",
    "Descriptive page title",
    10,
    title.length >= 10 &&
      title.length <= 70,
    `Title: ${
      title.slice(0, 100) || "not found"
    } (${title.length} characters).`,
    "The title is missing or outside this checker’s 10–70 character guideline.",
    "Write a concise title that explains the page’s subject and business context."
  );

  // META DESCRIPTION
  addCheck(
    "description",
    "Page summary",
    10,
    description.length >= 50 &&
      description.length <= 180,
    `Meta description: ${description.length} characters.`,
    "A useful meta description was not detected within the 50–180 character guideline.",
    "Add a clear page summary that describes what visitors will learn."
  );

  // H1
  addCheck(
    "h1",
    "Clear main heading",
    10,
    h1Count === 1,
    `${h1Count} non-empty H1 headings found.`,
    "The page does not have one clear H1 heading.",
    "Use one descriptive H1 that states the main subject of the page."
  );

  // STRUCTURE
  addCheck(
    "structure",
    "Scannable sections",
    10,
    h2Count >= 2,
    `${h2Count} non-empty H2 headings found.`,
    "Few clearly labelled content sections were found.",
    "Organise relevant details into useful sections with descriptive H2 headings."
  );

  // ANSWER-ORIENTED CONTENT
  addCheck(
    "answers",
    "Answer-oriented content structure",
    15,
    answerParagraphs >= 2 &&
      questionHeadings >= 1,
    `${answerParagraphs} paragraphs of 20–100 words; ${questionHeadings} question-style headings.`,
    "The page lacks the question-and-paragraph pattern used by this check.",
    "Answer a real customer question under a clear heading, using a concise explanation. This check measures structure, not answer accuracy."
  );

  // SCHEMA
  addCheck(
    "schema",
    "Machine-readable context",
    15,
    validSchemaBlocks > 0,
    validSchemaBlocks
      ? `${validSchemaBlocks} parseable JSON-LD blocks; types: ${[
          ...schemaTypes,
        ]
          .slice(0, 6)
          .join(", ")}.`
      : "No parseable JSON-LD with an @type was found.",
    "No parseable JSON-LD context was detected.",
    "Add appropriate structured data that matches visible content. A manual review must confirm schema validity and accuracy."
  );

  // BUSINESS / AUTHOR IDENTITY
  addCheck(
    "identity",
    "Business or author context",
    10,
    hasIdentity,
    hasIdentity
      ? "An about, team, company or author link was found."
      : "No recognisable identity link found.",
    "Visitors may have difficulty finding who is behind the information.",
    "Link to a useful about or author page with verifiable experience and business details."
  );

  // CONTACT
  addCheck(
    "contact",
    "Contact accessibility",
    10,
    hasContact,
    hasContact
      ? "A contact, email or phone link was found."
      : "No recognisable contact link found.",
    "A clear way to contact the business was not found.",
    "Make your contact information or contact page easy to find."
  );

  // INDEXING
  addCheck(
    "indexing",
    "Page-level indexing directives",
    5,
    !noindex,
    noindex
      ? "A noindex directive was detected."
      : "No noindex directive detected in meta tags or response headers.",
    "The page explicitly asks search engines not to index it.",
    "If this page should be public in search, review the noindex directive. Keep it on intentionally private or staging pages."
  );

  /*
   * --------------------------------
   * AEO SCORE CALCULATION
   * --------------------------------
   */

  // Original score out of 100
  const rawScore = checks.reduce(
    (sum, check) => sum + check.points,
    0
  );

  // Reduce final displayed AEO score by 30%
  // Example:
  // 100 -> 70
  // 80  -> 56
  // 60  -> 42
  // 40  -> 28
  const score = Math.round(rawScore * 0.7);

  /*
   * --------------------------------
   * RESULT
   * --------------------------------
   */

  return {
    url,

    pageTitle:
      title.slice(0, 160) ||
      new URL(url).hostname,

    score,

    level:
      score >= 60
        ? "Strong foundations"
        : score >= 40
          ? "Room to improve"
          : "Needs attention",

    checkedAt: new Date().toISOString(),

    methodologyVersion: "1.1",

    checks,

    limitations:
      "A rules-based check of one page’s initial HTML, not a platform-issued AEO score or a prediction of AI citations. JavaScript-rendered content, factual accuracy, authority, robots.txt, rankings and actual AI visibility are not evaluated. English-language heading and link patterns are used.",
  };
}

module.exports = { scorePage };
