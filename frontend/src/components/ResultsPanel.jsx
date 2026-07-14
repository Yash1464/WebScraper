import { useState } from "react";
import {
  FileText,
  Heading,
  Link2,
  Image as ImageIcon,
  Table as TableIcon,
  Info,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { exportCsvUrl, exportExcelUrl } from "../api/scraperApi";

const TABS = [
  { key: "overview", label: "Overview", icon: Info },
  { key: "headings", label: "Headings", icon: Heading },
  { key: "paragraphs", label: "Paragraphs", icon: FileText },
  { key: "links", label: "Links", icon: Link2 },
  { key: "images", label: "Images", icon: ImageIcon },
  { key: "tables", label: "Tables", icon: TableIcon },
];

export default function ResultsPanel({ record }) {
  const [tab, setTab] = useState("overview");

  if (!record) return null;
  const { data, id } = record;

  return (
    <div className="bg-base-800/60 border border-base-700 rounded-2xl shadow-lg overflow-hidden mt-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-base-700">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-100 truncate">
            {data.title || "Untitled page"}
          </p>
          <p className="text-xs text-gray-500 truncate">{data.pageUrl}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <a
            href={exportCsvUrl(id)}
            className="flex items-center gap-1.5 text-xs bg-base-900 border border-base-700 hover:border-accent-cyan text-gray-200 px-3 py-2 rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </a>
          <a
            href={exportExcelUrl(id)}
            className="flex items-center gap-1.5 text-xs bg-base-900 border border-base-700 hover:border-accent-amber text-gray-200 px-3 py-2 rounded-lg transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-base-700 px-2">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 text-xs px-4 py-3 whitespace-nowrap border-b-2 transition ${
              tab === key
                ? "border-accent-indigo text-accent-cyan"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
            {key !== "overview" && (
              <span className="ml-1 text-[10px] bg-base-700 px-1.5 py-0.5 rounded-full">
                {data.counts?.[key] ?? 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-[420px] overflow-y-auto text-sm">
        {tab === "overview" && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Title" value={data.title} />
            <Field label="Scrape Mode" value={data.mode} />
            <Field label="Meta Description" value={data.meta?.description} />
            <Field label="Meta Keywords" value={data.meta?.keywords} />
            <Field label="OG Title" value={data.meta?.ogTitle} />
            <Field label="OG Image" value={data.meta?.ogImage} isLink />
          </dl>
        )}

        {tab === "headings" && (
          <ul className="space-y-1.5">
            {data.headings.length === 0 && <Empty />}
            {data.headings.map((h, i) => (
              <li key={i} className="flex gap-2 items-baseline">
                <span className="text-[10px] uppercase text-accent-cyan bg-base-900 px-1.5 py-0.5 rounded">
                  {h.tag}
                </span>
                <span className="text-gray-300">{h.text}</span>
              </li>
            ))}
          </ul>
        )}

        {tab === "paragraphs" && (
          <div className="space-y-3">
            {data.paragraphs.length === 0 && <Empty />}
            {data.paragraphs.map((p, i) => (
              <p key={i} className="text-gray-300 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        )}

        {tab === "links" && (
          <ul className="space-y-1.5">
            {data.links.length === 0 && <Empty />}
            {data.links.map((l, i) => (
              <li key={i} className="truncate">
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-cyan hover:underline"
                >
                  {l.text || l.url}
                </a>
              </li>
            ))}
          </ul>
        )}

        {tab === "images" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.images.length === 0 && <Empty />}
            {data.images.map((img, i) => (
              <div
                key={i}
                className="bg-base-900 border border-base-700 rounded-lg overflow-hidden"
              >
                <img
                  src={img.url}
                  alt={img.alt || ""}
                  className="w-full h-24 object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <p className="text-[10px] text-gray-500 p-1.5 truncate">
                  {img.alt || "no alt text"}
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === "tables" && (
          <div className="space-y-6">
            {data.tables.length === 0 && <Empty />}
            {data.tables.map((table, ti) => (
              <div key={ti} className="overflow-x-auto">
                <p className="text-xs text-gray-500 mb-1">Table {ti + 1}</p>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    {table.map((row, ri) => (
                      <tr key={ri} className="border-b border-base-700">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-2 py-1 text-gray-300">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, isLink }) {
  return (
    <div>
      <dt className="text-[11px] uppercase text-gray-500">{label}</dt>
      <dd className="text-gray-200 truncate">
        {value ? (
          isLink ? (
            <a href={value} target="_blank" rel="noreferrer" className="text-accent-cyan hover:underline">
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          <span className="text-gray-600 italic">not found</span>
        )}
      </dd>
    </div>
  );
}

function Empty() {
  return <p className="text-gray-600 italic text-xs">Nothing found for this category.</p>;
}
