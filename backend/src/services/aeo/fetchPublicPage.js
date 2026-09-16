const http = require("node:http");
const https = require("node:https");
const dns = require("node:dns/promises");
const { isIP } = require("node:net");
const {
  createGunzip,
  createInflate,
  createBrotliDecompress,
} = require("node:zlib");
const ipaddr = require("ipaddr.js");

const MAX_BYTES = 1024 * 1024;
const DEADLINE_MS = 12000;

class AuditError extends Error {
  constructor(message, status = 422) {
    super(message);
    this.status = status;
  }
}

function normalizeUrl(value) {
  if (typeof value !== "string" || !value.trim() || value.length > 2048) {
    throw new AuditError("Enter a valid public website URL.", 400);
  }

  let url;
  try {
    const input = value.trim();
    url = new URL(
      /^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`,
    );
  } catch {
    throw new AuditError(
      "Enter a valid website URL, such as https://example.com.",
      400,
    );
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.port
  ) {
    throw new AuditError(
      "Use a public HTTP or HTTPS URL without login details or a custom port.",
      400,
    );
  }

  url.hash = "";
  return url;
}

function isPublicAddress(address) {
  try {
    // Also rejects IPv4-mapped IPv6, loopback, private, reserved and link-local ranges.
    return ipaddr.parse(address).range() === "unicast";
  } catch {
    return false;
  }
}

async function resolvePublicAddress(url, lookup = dns.lookup) {
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(hostname)
    ? [{ address: hostname, family: isIP(hostname) }]
    : await lookup(hostname, { all: true, verbatim: true });

  if (
    !addresses.length ||
    addresses.some(({ address }) => !isPublicAddress(address))
  ) {
    throw new AuditError(
      "This checker accepts publicly accessible websites only.",
      400,
    );
  }

  return addresses[0];
}

function requestPage(url, address, signal) {
  return new Promise((resolve, reject) => {
    const transport = url.protocol === "https:" ? https : http;
    const request = transport.get(
      url,
      {
        agent: false,
        signal,
        // Pin the verified DNS result so the connection cannot resolve to a private IP later.
        lookup: (_hostname, options, callback) => {
          if (options.all) callback(null, [address]);
          else callback(null, address.address, address.family);
        },
        headers: {
          "User-Agent": "AnswerEdgeReadinessChecker/1.0",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Encoding": "gzip, deflate, br",
        },
        maxHeaderSize: 16384,
      },
      (response) => {
        const status = response.statusCode;
        if ([301, 302, 303, 307, 308].includes(status)) {
          const location = response.headers.location;
          response.destroy();
          if (!location)
            return reject(
              new AuditError("The website returned an invalid redirect."),
            );
          return resolve({ location });
        }

        if (status < 200 || status >= 300) {
          response.destroy();
          return reject(
            new AuditError(
              `The website returned HTTP ${status}. Try a publicly accessible page.`,
            ),
          );
        }

        if (
          !/^(text\/html|application\/xhtml\+xml)(;|$)/i.test(
            response.headers["content-type"] || "",
          )
        ) {
          response.destroy();
          return reject(
            new AuditError("This URL did not return an HTML web page."),
          );
        }

        const encoding = response.headers["content-encoding"];
        const decompressors = {
          gzip: createGunzip,
          deflate: createInflate,
          br: createBrotliDecompress,
        };
        if (encoding && encoding !== "identity" && !decompressors[encoding]) {
          response.destroy();
          return reject(
            new AuditError(
              "The website uses an unsupported response encoding.",
            ),
          );
        }

        const stream = decompressors[encoding]
          ? response.pipe(decompressors[encoding]())
          : response;
        const chunks = [];
        let bytes = 0;
        let wireBytes = 0;
        const fail = (error) => {
          reject(error);
          stream.destroy();
          response.destroy();
          request.destroy();
        };

        response.on("data", (chunk) => {
          wireBytes += chunk.length;
          if (wireBytes > MAX_BYTES)
            fail(
              new AuditError(
                "The page is too large for this quick check. Try a smaller service page.",
              ),
            );
        });
        response.on("error", fail);
        stream.on("error", fail);
        stream.on("data", (chunk) => {
          bytes += chunk.length;
          if (bytes > MAX_BYTES) {
            fail(
              new AuditError(
                "The page is too large for this quick check. Try a smaller service page.",
              ),
            );
            return;
          }
          chunks.push(chunk);
        });
        stream.on("end", () =>
          resolve({ html: Buffer.concat(chunks), headers: response.headers }),
        );
      },
    );

    request.on("error", reject);
  });
}

async function fetchPublicPage(
  input,
  { lookup = dns.lookup, request = requestPage } = {},
) {
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(
        new AuditError(
          "The website took too long to respond. Please try again.",
          504,
        ),
      );
    }, DEADLINE_MS);
  });

  const operation = async () => {
    let url = normalizeUrl(input);
    for (let redirect = 0; redirect <= 3; redirect += 1) {
      const address = await resolvePublicAddress(url, lookup);
      controller.signal.throwIfAborted();
      const response = await request(url, address, controller.signal);
      if (!response.location) return { ...response, url: url.href };
      // Every redirect must pass URL and DNS validation again.
      url = normalizeUrl(new URL(response.location, url).href);
    }
    throw new AuditError(
      "The website redirected too many times. Try its final page URL.",
    );
  };

  try {
    return await Promise.race([operation(), timeout]);
  } catch (error) {
    if (error instanceof AuditError) throw error;
    if (controller.signal.aborted)
      throw new AuditError(
        "The website took too long to respond. Please try again.",
        504,
      );
    throw new AuditError(
      "We could not read this website. It may be unavailable or block automated checks.",
    );
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  AuditError,
  normalizeUrl,
  isPublicAddress,
  resolvePublicAddress,
  fetchPublicPage,
};
