const express = require("express");
const router = express.Router();
const controller = require("../controllers/scrapeController");

router.post("/scrape", controller.scrapeUrl);
router.get("/history", controller.getHistory);
router.delete("/history", controller.clearHistory);
router.get("/history/:id", controller.getRecord);
router.get("/export/:id/csv", controller.exportCsv);
router.get("/export/:id/excel", controller.exportExcel);

module.exports = router;