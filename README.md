<<<<<<< HEAD
# Web Scraper Pro

A full-stack, general-purpose web scraper. Paste any URL and extract **titles, meta tags, headings, paragraphs, links, images, and tables** in one pass — then export the results to CSV or Excel.

## Stack
- **Backend**: Node.js, Express, Cheerio (static HTML), Puppeteer (JS-rendered pages), json2csv, xlsx
- **Frontend**: React (Vite), Tailwind CSS, lucide-react
- **Storage**: Lightweight JSON-file history (swap for MongoDB/Postgres later if you want it in your resume stack)

## How scraping works
- **Static mode**: fetches raw HTML with Axios and parses it with Cheerio. Fast, works for most blogs/news/docs sites.
- **Dynamic mode**: launches headless Chrome via Puppeteer and waits for the page to render. Needed for React/Vue/Angular SPAs.
- **Auto mode** (default): tries static first; if the page looks empty (no headings/paragraphs, almost no links — a sign it's JS-rendered), it automatically retries with Puppeteer.

## Project structure
```
web-scraper-pro/
├── backend/
│   ├── controllers/scrapeController.js
│   ├── routes/scrapeRoutes.js
│   ├── services/
│   │   ├── scraperService.js   # core extraction logic
│   │   ├── exportService.js    # CSV / Excel generation
│   │   └── historyStore.js     # JSON-file history
│   ├── data/history.json
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/ScraperForm.jsx
    │   ├── components/ResultsPanel.jsx
    │   ├── components/HistorySidebar.jsx
    │   ├── api/scraperApi.js
    │   └── App.jsx
    └── package.json
```

## Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Backend runs on `http://localhost:5000`.

> Note: Puppeteer downloads a Chromium binary on `npm install` (~200MB). If your machine/network blocks that, you can still use `static` mode without it — just don't call `dynamic`/`auto`-fallback until Puppeteer installs cleanly.

### 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs on `http://localhost:5173`.

### 3. Use it
Open `http://localhost:5173`, paste a URL (e.g. `https://en.wikipedia.org/wiki/Web_scraping`), hit **Scrape**, browse the tabs, then export to CSV or Excel.

## API Reference
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/scrape` | Body: `{ url, mode }` — scrapes and stores the result |
| GET | `/api/history` | List recent scrapes (metadata only) |
| GET | `/api/history/:id` | Full record for one scrape |
| GET | `/api/export/:id/csv` | Download CSV |
| GET | `/api/export/:id/excel` | Download multi-sheet Excel |

## Deployment (same pattern as your other projects)
- **Backend** → Render (Node web service). Set `CLIENT_URL` env var to your deployed frontend URL for CORS.
- **Frontend** → Vercel. Set `VITE_API_URL` env var to your deployed backend URL + `/api`.
- ⚠️ Puppeteer on Render's free tier can be memory-heavy — if you hit OOM errors, either upgrade the instance or disable `dynamic`/`auto` mode in production and rely on static-only scraping.

## Possible next features (good for your resume "extended" section)
- Swap JSON-file history for MongoDB (matches your Expensify stack)
- Add scheduled/recurring scrapes with node-cron
- Add a custom CSS-selector mode for power users
- Rate limiting + a job queue (BullMQ) for scraping many URLs at once
- Auth so each user only sees their own scrape history
=======
# WebScraper
>>>>>>> 08c4d1e57ed17146d4c02c84f685b4c7f3d5c43c
