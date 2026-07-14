const axios = require("axios");
const cheerio = require("cheerio");

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
};

/**
 * Normalizes a relative URL against a base URL. Returns null if invalid.
 */
function resolveUrl(base, href) {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

/**
 * Extracts every supported data type from loaded HTML using Cheerio.
 * This is the "scrape all types" core — title, meta, headings,
 * paragraphs, links, images, and tables.
 */
function extractAll(html, pageUrl) {
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim() || null;

  const meta = {
    description:
      $('meta[name="description"]').attr("content")?.trim() || null,
    keywords: $('meta[name="keywords"]').attr("content")?.trim() || null,
    ogTitle: $('meta[property="og:title"]').attr("content")?.trim() || null,
    ogImage: $('meta[property="og:image"]').attr("content")?.trim() || null,
  };

  const headings = [];
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const text = $(el).text().trim();
    if (text) headings.push({ tag: el.tagName.toLowerCase(), text });
  });

  const paragraphs = [];
  $("p").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 1) paragraphs.push(text);
  });

  const linksSet = new Map();
  $("a[href]").each((_, el) => {
    const href = resolveUrl(pageUrl, $(el).attr("href"));
    const text = $(el).text().trim();
    if (href && !linksSet.has(href)) {
      linksSet.set(href, { url: href, text: text || null });
    }
  });
  const links = Array.from(linksSet.values());

  const imagesSet = new Map();
  $("img[src]").each((_, el) => {
    const src = resolveUrl(pageUrl, $(el).attr("src"));
    const alt = $(el).attr("alt") || null;
    if (src && !imagesSet.has(src)) {
      imagesSet.set(src, { url: src, alt });
    }
  });
  const images = Array.from(imagesSet.values());

  const tables = [];
  $("table").each((_, tableEl) => {
    const rows = [];
    $(tableEl)
      .find("tr")
      .each((_, tr) => {
        const cells = [];
        $(tr)
          .find("th, td")
          .each((_, cell) => cells.push($(cell).text().trim()));
        if (cells.length) rows.push(cells);
      });
    if (rows.length) tables.push(rows);
  });

  return {
    pageUrl,
    title,
    meta,
    headings,
    paragraphs,
    links,
    images,
    tables,
    counts: {
      headings: headings.length,
      paragraphs: paragraphs.length,
      links: links.length,
      images: images.length,
      tables: tables.length,
    },
  };
}

/**
 * Fast path: fetch static HTML with axios + parse with Cheerio.
 * Works for server-rendered pages (most blogs, news sites, docs, etc).
 */
async function scrapeStatic(url) {
  const res = await axios.get(url, {
    headers: DEFAULT_HEADERS,
    timeout: 15000,
    maxRedirects: 5,
  });
  return extractAll(res.data, url);
}

/**
 * Slow path: render the page in headless Chrome via Puppeteer.
 * Needed for React/Vue/Angular SPAs or sites that hydrate content with JS.
 */
async function scrapeDynamic(url) {
  const puppeteer = require("puppeteer");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(DEFAULT_HEADERS["User-Agent"]);
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: Number(process.env.PUPPETEER_TIMEOUT) || 20000,
    });
    const html = await page.content();
    return extractAll(html, url);
  } finally {
    await browser.close();
  }
}

/**
 * Entry point used by the controller.
 * mode: "auto" | "static" | "dynamic"
 * "auto" tries static first (fast, cheap) and falls back to Puppeteer
 * if the static pass returns suspiciously little content.
 */
async function scrape(url, mode = "auto") {
  if (mode === "dynamic") return { ...(await scrapeDynamic(url)), mode: "dynamic" };
  if (mode === "static") return { ...(await scrapeStatic(url)), mode: "static" };

  // auto mode
  const staticResult = await scrapeStatic(url);
  const looksEmpty =
    staticResult.counts.paragraphs === 0 &&
    staticResult.counts.headings === 0 &&
    staticResult.counts.links < 3;

  if (looksEmpty) {
    const dynamicResult = await scrapeDynamic(url);
    return { ...dynamicResult, mode: "dynamic (auto fallback)" };
  }
  return { ...staticResult, mode: "static" };
}

module.exports = { scrape, extractAll };
