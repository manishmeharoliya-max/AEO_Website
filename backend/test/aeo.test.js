const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const { once } = require("node:events");
const {
  normalizeUrl,
  isPublicAddress,
  resolvePublicAddress,
  fetchPublicPage,
} = require("../src/services/aeo/fetchPublicPage");
const { scorePage } = require("../src/services/aeo/scorePage");
const { createAeoRouter } = require("../src/routes/aeoRoutes");

const paragraph =
  "Our team helps small businesses explain their services clearly and answer customer questions with practical information about their process, expertise, delivery and next steps.";
const strongHtml = `<!doctype html><html><head><title>Useful services for growing businesses</title><meta name="description" content="Explore our practical services for growing businesses, with clear information about our expertise, process and customer support."><script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Example"}</script></head><body><h1>Services for growing businesses</h1><h2>How can we help your business?</h2><p>${paragraph}</p><h2>Our process</h2><p>${paragraph}</p><a href="/about">About us</a><a href="/contact">Contact us</a></body></html>`;

test("normalizes URLs and rejects credentials, protocols and nonstandard ports", () => {
  assert.equal(
    normalizeUrl("example.com/about#team").href,
    "https://example.com/about",
  );
  for (const input of [
    "",
    null,
    "file:///etc/passwd",
    "javascript:alert(1)",
    "https://user:pass@example.com",
    "https://example.com:8443",
  ]) {
    assert.throws(() => normalizeUrl(input));
  }
});

test("rejects private, mapped, metadata, multicast and reserved addresses", () => {
  for (const ip of [
    "127.0.0.1",
    "10.0.0.1",
    "192.168.1.1",
    "169.254.169.254",
    "100.64.0.1",
    "0.0.0.0",
    "224.0.0.1",
    "::1",
    "::ffff:127.0.0.1",
    "fc00::1",
    "fe80::1",
  ]) {
    assert.equal(isPublicAddress(ip), false, ip);
  }
  assert.equal(isPublicAddress("93.184.215.14"), true);
});

test("rejects mixed public/private DNS and alternate numeric localhost notation", async () => {
  await assert.rejects(
    resolvePublicAddress(normalizeUrl("example.com"), async () => [
      { address: "93.184.215.14", family: 4 },
      { address: "127.0.0.1", family: 4 },
    ]),
    /publicly accessible/,
  );
  for (const url of [
    "http://2130706433",
    "http://0x7f000001",
    "http://[::ffff:127.0.0.1]",
  ]) {
    await assert.rejects(
      resolvePublicAddress(normalizeUrl(url)),
      /publicly accessible/,
    );
  }
});

test("revalidates redirect destinations before making another request", async () => {
  let calls = 0;
  await assert.rejects(
    fetchPublicPage("example.com", {
      lookup: async () => [{ address: "93.184.215.14", family: 4 }],
      request: async (_url, address) => {
        calls += 1;
        assert.equal(address.address, "93.184.215.14");
        return { location: "http://169.254.169.254/latest/meta-data/" };
      },
    }),
    /publicly accessible/,
  );
  assert.equal(calls, 1);
});

test("caps redirects and does not fabricate results on connection failure", async () => {
  await assert.rejects(
    fetchPublicPage("example.com", {
      lookup: async () => [{ address: "93.184.215.14", family: 4 }],
      request: async () => ({ location: "/again" }),
    }),
    /redirected too many/,
  );
  await assert.rejects(
    fetchPublicPage("example.com", {
      lookup: async () => {
        throw new Error("DNS unavailable");
      },
    }),
    /could not read/,
  );
});

test("a complete fixture earns 100 with transparent weights", () => {
  const report = scorePage({ html: strongHtml, url: "https://example.com/" });
  assert.equal(report.score, 100);
  assert.equal(report.checks.length, 10);
  assert.equal(
    report.checks.reduce((sum, check) => sum + check.maxPoints, 0),
    100,
  );
  assert.ok(report.checks.every((check) => check.passed));
});

test("missing schema and noindex lower only their weighted checks", () => {
  const html = strongHtml.replace(/<script[\s\S]*?<\/script>/, "");
  const report = scorePage({
    html,
    url: "https://example.com/",
    headers: { "x-robots-tag": "noindex" },
  });
  assert.equal(report.score, 80);
  assert.deepEqual(
    report.checks.filter((check) => !check.passed).map((check) => check.id),
    ["schema", "indexing"],
  );
  assert.ok(
    report.checks
      .filter((check) => !check.passed)
      .every((check) => check.reason && check.recommendation),
  );
});

test("thin JavaScript shells and access challenges do not get a misleading score", () => {
  assert.throws(
    () =>
      scorePage({
        html: '<html><title>App</title><div id="root"></div></html>',
        url: "https://example.com/",
      }),
    /not enough readable HTML/,
  );
  assert.throws(
    () =>
      scorePage({
        html: strongHtml.replace(
          "Useful services for growing businesses",
          "Just a moment",
        ),
        url: "https://example.com/",
      }),
    /access challenge/,
  );
});

test("malformed schema receives no credit and hidden text cannot satisfy the content checks", () => {
  const html = strongHtml.replace('"@type":"Organization"', "invalid JSON");
  assert.equal(scorePage({ html, url: "https://example.com/" }).score, 85);
  assert.throws(
    () =>
      scorePage({
        html: `<div hidden>${paragraph.repeat(5)}</div>`,
        url: "https://example.com/",
      }),
    /not enough readable/,
  );
});

test("API returns an actual computed report, rejects bad inputs and limits bursts", async (context) => {
  const app = express();
  app.use(express.json());
  app.use(
    "/api/aeo",
    createAeoRouter({
      fetchPage: async (url) => ({
        url: normalizeUrl(url).href,
        html: strongHtml,
      }),
    }),
  );
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  context.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const endpoint = `http://127.0.0.1:${server.address().port}/api/aeo/analyze`;
  const submit = (url) =>
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  const response = await submit("example.com");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal((await response.json()).score, 100);
  assert.equal((await submit("file:///etc/passwd")).status, 400);
  for (let index = 0; index < 6; index += 1) await submit("example.com");
  assert.equal((await submit("example.com")).status, 429);
});
