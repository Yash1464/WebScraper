require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const scrapeRoutes = require("./routes/scrapeRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://web-scraper-orcin-nine.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Web Scraper Pro API is running" });
});

app.use("/api", scrapeRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Web Scraper Pro backend running on port ${PORT}`);
});