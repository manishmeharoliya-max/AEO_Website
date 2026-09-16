const express = require("express");
const cors = require("cors");
const { createAeoRouter } = require("./src/routes/aeoRoutes");

// The checker can run independently of the existing authentication/database server.
const app = express();
app.disable("x-powered-by");
app.use(
  cors({ origin: process.env.AEO_CLIENT_ORIGIN || "http://localhost:5173" }),
);
app.use(express.json({ limit: "4kb" }));
app.use("/api/aeo", createAeoRouter());
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", service: "aeo-checker" }),
);
app.use((error, _req, res, _next) => {
  res
    .status(error.status || 500)
    .json({ message: "Invalid request. Send a website URL as JSON." });
});

if (require.main === module) {
  const port = Number(process.env.AEO_PORT) || 5001;
  app.listen(port, () =>
    console.log(`AEO checker running on http://localhost:${port}`),
  );
}

module.exports = { app };
