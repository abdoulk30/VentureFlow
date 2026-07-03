"use client";

import { X, Globe, MapPin, Tag, Layers } from "lucide-react";

export interface DirectoryItem {
  id: number;
  name: string;
  website_url: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  description: string | null;
  categories: string[] | null;
  stage_focus?: string[] | null; // investors only
  year_founded?: number | null; // startups only
  status?: string | null; // startups only
}

export default function DetailModal({
  item,
  onClose,
}: {
  item: DirectoryItem;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-cardBg border border-customBorder rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-cardBg border-b border-customBorder px-6 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">{item.name}</h2>
            {(item.city || item.state) && (
              <p className="text-xs text-mutedText flex items-center gap-1 mt-1">
                <MapPin size={11} />
                {[item.city, item.state].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-mutedText hover:text-white transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {item.description && (
            <p className="text-sm text-neutral-300 leading-relaxed">
              {item.description}
            </p>
          )}

          {item.status && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-wider text-mutedText">
                Status
              </span>
              <span className="px-2 py-0.5 rounded bg-surfaceMuted border border-customBorder text-white">
                {item.status}
              </span>
            </div>
          )}

          {item.year_founded && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-wider text-mutedText">
                Founded
              </span>
              <span className="text-white">{item.year_founded}</span>
            </div>
          )}

          {item.categories && item.categories.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-mutedText mb-2 flex items-center gap-1.5">
                <Tag size={11} /> Categories
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.categories.map((c) => (
                  <span
                    key={c}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-accentPrimary/10 border border-accentPrimary/20 text-accentPrimary"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.stage_focus && item.stage_focus.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-mutedText mb-2 flex items-center gap-1.5">
                <Layers size={11} /> Stage Focus
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.stage_focus.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-accentSuccess/10 border border-accentSuccess/20 text-accentSuccess"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.website_url && (
            <a
              href={
                item.website_url.startsWith("http")
                  ? item.website_url
                  : `https://${item.website_url}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full mt-2 px-4 py-2.5 bg-accentPrimary hover:bg-accentPrimary/90 text-white text-xs font-semibold rounded-lg transition-colors uppercase tracking-wider"
            >
              <Globe size={14} />
              Visit Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}