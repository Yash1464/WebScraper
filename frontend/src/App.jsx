import { useEffect, useState } from "react";
import { Sparkles, AlertTriangle } from "lucide-react";
import ScraperForm from "./components/ScraperForm";
import ResultsPanel from "./components/ResultsPanel";
import HistorySidebar from "./components/HistorySidebar";
import { scrapeUrl, getHistory, getRecord, clearHistory as clearHistoryApi } from "./api/scraperApi";

export default function App() {
  const [record, setRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch {
      // silent — history is non-critical
    }
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const toErrorMessage = (err, fallback) => {
    const data = err?.response?.data;
    if (typeof data?.error === "string") return data.error;
    if (typeof err?.message === "string") return err.message;
    return fallback;
  };

  const handleScrape = async (url, mode) => {
    setLoading(true);
    setError("");
    try {
      const result = await scrapeUrl(url, mode);
      setRecord(result);
      refreshHistory();
    } catch (err) {
      setError(
        toErrorMessage(err, "Something went wrong while scraping. Check the URL and try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistoryApi();
      setHistory([]);
      setRecord(null);
    } catch (err) {
      setError(toErrorMessage(err, "Could not clear history. Try again."));
    }
  };

  const handleSelectHistory = async (id) => {
    try {
      const full = await getRecord(id);
      setRecord(full);
    } catch (err) {
      setError(toErrorMessage(err, "Could not load that scrape from history."));
    }
  };

  return (
    <div className="min-h-screen bg-base-950 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-accent-cyan mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest">Full-Stack Tool</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-accent-indigo via-accent-pink to-accent-cyan bg-clip-text text-transparent">
            Web Scraper Pro
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Paste any URL — extract titles, headings, text, links, images & tables. Export to CSV or Excel.
          </p>
        </header>

        <ScraperForm onScrape={handleScrape} loading={loading} />

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-xl mt-4">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {typeof error === "string" ? error : "Something went wrong."}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mt-2 items-start">
          <div>
            <ResultsPanel record={record} />
            {!record && !loading && (
              <div className="mt-6 text-center text-gray-600 text-sm border border-dashed border-base-700 rounded-2xl p-10">
                Results will appear here after you scrape a URL.
              </div>
            )}
          </div>
          <HistorySidebar
            history={history}
            onSelect={handleSelectHistory}
            activeId={record?.id}
            onClear={handleClearHistory}
          />
        </div>
      </div>
    </div>
  );
}
