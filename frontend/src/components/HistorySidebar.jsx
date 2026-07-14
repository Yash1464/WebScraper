import { useState } from "react";
import { Clock, ExternalLink, Trash2 } from "lucide-react";

export default function HistorySidebar({ history, onSelect, activeId, onClear }) {
  const [confirming, setConfirming] = useState(false);

  const handleClearClick = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    onClear();
    setConfirming(false);
  };

  return (
    <aside className="bg-base-800/60 border border-base-700 rounded-2xl p-4 shadow-lg h-fit">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-300">
          <Clock className="w-4 h-4" />
          <h2 className="text-sm font-medium">Recent Scrapes</h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearClick}
            onBlur={() => setConfirming(false)}
            className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border transition ${
              confirming
                ? "bg-red-500/20 border-red-500 text-red-300"
                : "border-base-700 text-gray-500 hover:text-red-300 hover:border-red-500/50"
            }`}
          >
            <Trash2 className="w-3 h-3" />
            {confirming ? "Confirm?" : "Clear"}
          </button>
        )}
      </div>

      {history.length === 0 && (
        <p className="text-xs text-gray-600 italic">No scrapes yet. Try one above.</p>
      )}

      <ul className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {history.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onSelect(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition ${
                activeId === item.id
                  ? "bg-accent-indigo/15 border-accent-indigo"
                  : "border-base-700 hover:border-gray-500"
              }`}
            >
              <p className="text-gray-200 truncate flex items-center gap-1">
                <ExternalLink className="w-3 h-3 shrink-0 text-gray-500" />
                {item.title || item.url}
              </p>
              <p className="text-gray-600 truncate mt-0.5">{item.url}</p>
              <p className="text-gray-700 mt-0.5">
                {new Date(item.scrapedAt).toLocaleString()}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
