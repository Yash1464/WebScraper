import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({ baseURL: API_BASE, timeout: 30000 });

export async function scrapeUrl(url, mode = "auto") {
  const { data } = await client.post("/scrape", { url, mode });
  return data;
}

export async function getHistory() {
  const { data } = await client.get("/history");
  return data;
}

export async function clearHistory() {
  const { data } = await client.delete("/history");
  return data;
}

export async function getRecord(id) {
  const { data } = await client.get(`/history/${id}`);
  return data;
}

export function exportCsvUrl(id) {
  return `${API_BASE}/export/${id}/csv`;
}

export function exportExcelUrl(id) {
  return `${API_BASE}/export/${id}/excel`;
}