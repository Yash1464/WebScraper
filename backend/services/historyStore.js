const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "history.json");

function readAll() {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function writeAll(records) {
  fs.writeFileSync(DB_PATH, JSON.stringify(records, null, 2));
}

function addRecord(record) {
  const records = readAll();
  records.unshift(record); // newest first
  const trimmed = records.slice(0, 50); // keep last 50 scrapes
  writeAll(trimmed);
  return record;
}

function getById(id) {
  return readAll().find((r) => r.id === id) || null;
}

function clearAll() {
  writeAll([]);
  return [];
}

module.exports = { readAll, addRecord, getById, clearAll };