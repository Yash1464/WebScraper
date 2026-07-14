require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const scrapeRoutes = require("./routes/scrapeRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Web Scraper Pro API is running" });
});

app.use("/api", scrapeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.use(cors({origin:"https://web-scraper-orcin-nine.vercel.app/"}));


app.listen(PORT, () => {
  console.log(`🚀 Web Scraper Pro backend running on http://localhost:${PORT}`);
});
