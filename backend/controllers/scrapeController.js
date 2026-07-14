const { v4: uuidv4 } = require("uuid");
const scraperService = require("../services/scraperService");
const exportService = require("../services/exportService");
const historyStore = require("../services/historyStore");

async function scrapeUrl(req, res) {
  const { url, mode } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "A valid 'url' is required." });
  }

  try {
    new URL(url); // throws if malformed
  } catch {
    return res.status(400).json({ error: "URL is not valid. Include http(s)://" });
  }

  try {
    const result = await scraperService.scrape(url, mode || "auto");

    const record = {
      id: uuidv4(),
      url,
      title: result.title,
      mode: result.mode,
      counts: result.counts,
      scrapedAt: new Date().toISOString(),
      data: result,
    };

    historyStore.addRecord(record);

    res.json(record);
  } catch (err) {
    console.error("Scrape error:", err.message);
    res.status(500).json({
      error: "Failed to scrape the URL. It may be blocking bots, unreachable, or timed out.",
      details: err.message,
    });
  }
}

async function getHistory(req, res) {
  const records = historyStore.readAll().map(({ data, ...meta }) => meta);
  res.json(records);
}

async function clearHistory(req, res) {
  historyStore.clearAll();
  res.json({ success: true, message: "History cleared" });
}

async function getRecord(req, res) {
  const record = historyStore.getById(req.params.id);
  if (!record) return res.status(404).json({ error: "Record not found" });
  res.json(record);
}

async function exportCsv(req, res) {
  const record = historyStore.getById(req.params.id);
  if (!record) return res.status(404).json({ error: "Record not found" });

  const csv = exportService.toCsv(record.data);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="scrape-${record.id}.csv"`
  );
  res.send(csv);
}

async function exportExcel(req, res) {
  const record = historyStore.getById(req.params.id);
  if (!record) return res.status(404).json({ error: "Record not found" });

  const buffer = exportService.toExcel(record.data);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="scrape-${record.id}.xlsx"`
  );
  res.send(buffer);
}

module.exports = { scrapeUrl, getHistory, getRecord, exportCsv, exportExcel, clearHistory };