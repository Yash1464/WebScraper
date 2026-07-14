const { Parser } = require("json2csv");
const XLSX = require("xlsx");

/**
 * Flattens the nested scrape result into simple row arrays per data type
 * so it can be exported cleanly to CSV / Excel sheets.
 */
function buildSheets(data) {
  return {
    Overview: [
      { field: "Page URL", value: data.pageUrl },
      { field: "Title", value: data.title },
      { field: "Meta Description", value: data.meta?.description },
      { field: "Meta Keywords", value: data.meta?.keywords },
      { field: "OG Title", value: data.meta?.ogTitle },
      { field: "OG Image", value: data.meta?.ogImage },
      { field: "Scrape Mode", value: data.mode },
    ],
    Headings: (data.headings || []).map((h) => ({
      tag: h.tag,
      text: h.text,
    })),
    Paragraphs: (data.paragraphs || []).map((p, i) => ({
      index: i + 1,
      text: p,
    })),
    Links: (data.links || []).map((l) => ({
      url: l.url,
      anchor_text: l.text,
    })),
    Images: (data.images || []).map((img) => ({
      url: img.url,
      alt_text: img.alt,
    })),
    Tables: (data.tables || []).flatMap((table, tIdx) =>
      table.map((row, rIdx) => ({
        table_index: tIdx + 1,
        row_index: rIdx + 1,
        row_data: row.join(" | "),
      }))
    ),
  };
}

/**
 * Builds a single CSV string. If multiple data types have content,
 * they're stacked with section headers for readability.
 */
function toCsv(data) {
  const sheets = buildSheets(data);
  const chunks = [];

  for (const [sectionName, rows] of Object.entries(sheets)) {
    if (!rows.length) continue;
    chunks.push(`# ${sectionName}`);
    const parser = new Parser({ fields: Object.keys(rows[0]) });
    chunks.push(parser.parse(rows));
    chunks.push("");
  }

  return chunks.join("\n");
}

/**
 * Builds a multi-sheet .xlsx workbook, one sheet per data type.
 */
function toExcel(data) {
  const sheets = buildSheets(data);
  const wb = XLSX.utils.book_new();

  for (const [sectionName, rows] of Object.entries(sheets)) {
    const sheetData = rows.length ? rows : [{ info: "No data found" }];
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, sectionName.substring(0, 31));
  }

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}

module.exports = { toCsv, toExcel };
