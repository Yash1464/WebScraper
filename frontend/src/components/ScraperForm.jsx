import { useState } from "react";
import { Search, Zap, Globe, Loader2 } from "lucide-react";

const MODES = [
  { value: "auto", label: "Auto", icon: Zap, hint: "Fast, falls back to JS rendering if needed" },
  { value: "static", label: "Static", icon: Globe, hint: "Fastest — plain HTML only" },
  { value: "dynamic", label: "Dynamic", icon: Loader2, hint: "Slower — for React/Vue/JS-heavy sites" },
];

export default function ScraperForm({ onScrape, loading }) {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState("auto");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a URL to scrape.");
      return;
    }
    try {
      new URL(url);
    } catch {
      setError("That doesn't look like a valid URL. Include https://");
      return;
    }
    setError("");
    onScrape(url.trim(), mode);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-800/60 border border-base-700 rounded-2xl p-5 shadow-lg backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/blog-post"
            className="w-full bg-base-900 border border-base-700 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-indigo transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-accent-indigo to-accent-pink text-white font-medium px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Scraping...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" /> Scrape
            </>
          )}
        </button>
      </div>

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      <div className="flex flex-wrap gap-2 mt-4">
        {MODES.map(({ value, label, icon: Icon, hint }) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            title={hint}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition ${
              mode === value
                ? "bg-accent-indigo/20 border-accent-indigo text-accent-cyan"
                : "border-base-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            <Icon className="w-3 h-3" /> {label}
          </button>
        ))}
      </div>
    </form>
  );
}
