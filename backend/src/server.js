require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: false }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/podcasts", require("./routes/podcastRoutes"));
app.use("/api/episodes", require("./routes/episodeRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((e) => {
    console.error("DB connection failed", e);
    process.exit(1);
  });

module.exports = app; // for testing
