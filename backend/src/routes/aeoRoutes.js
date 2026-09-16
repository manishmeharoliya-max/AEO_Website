const express = require("express");
const { fetchPublicPage } = require("../services/aeo/fetchPublicPage");
const { scorePage } = require("../services/aeo/scorePage");

function createAeoRouter({ fetchPage = fetchPublicPage } = {}) {
  const router = express.Router();
  const clients = new Map();
  let activeRequests = 0;

  router.post("/analyze", async (req, res) => {
    res.set("Cache-Control", "no-store");
    const now = Date.now();
    for (const [key, value] of clients) {
      if (value.expiresAt <= now) clients.delete(key);
    }
    const key = req.ip;
    const client = clients.get(key) || { count: 0, expiresAt: now + 60000 };
    if (
      client.count >= 8 ||
      activeRequests >= 4 ||
      (!clients.has(key) && clients.size >= 1000)
    ) {
      res.set("Retry-After", "60");
      return res
        .status(429)
        .json({
          message: "Too many checks right now. Please try again in one minute.",
        });
    }
    client.count += 1;
    clients.set(key, client);
    activeRequests += 1;

    try {
      const page = await fetchPage(req.body?.url);
      return res.json(scorePage(page));
    } catch (error) {
      return res.status(error.status || 502).json({
        message: error.status
          ? error.message
          : "We could not analyse this page. Please try again.",
      });
    } finally {
      activeRequests -= 1;
    }
  });

  return router;
}

module.exports = { createAeoRouter };
