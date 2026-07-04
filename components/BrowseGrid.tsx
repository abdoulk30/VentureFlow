"use client";

import { useState, useMemo } from "react";
import { Search, Building2, MapPin, ChevronRight } from "lucide-react";
import DetailModal, { DirectoryItem } from "@/components/DetailModal";

export default function BrowseGrid({
  items,
  emptyLabel,
}: {
  items: DirectoryItem[];
  emptyLabel: string;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<DirectoryItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const haystack = [
        item.name,
        item.city,
        item.state,
        item.description,
        ...(item.categories ?? []),
        ...(item.stage_focus ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-cardBg border border-customBorder rounded-lg px-3 py-2.5 max-w-md">
        <Search size={14} className="text-mutedText shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, city, category..."
          className="bg-transparent text-sm text-foreground placeholder-mutedText outline-none w-full"
        />
      </div>

      <p className="text-xs text-mutedText font-mono">
        {filtered.length} of {items.length} shown
      </p>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-customBorder rounded-xl p-10 text-center text-mutedText text-sm">
          {emptyLabel}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="text-left p-5 bg-cardBg border border-customBorder rounded-xl hover:border-accentPrimary/40 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-7 rounded bg-surfaceMuted border border-customBorder flex items-center justify-center shrink-0 text-accentPrimary">
                      <Building2 size={13} />
                    </div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-accentPrimary transition-colors truncate">
                      {item.name}
                    </h3>
                  </div>
                </div>
                {(item.city || item.state) && (
                  <p className="text-[11px] text-mutedText flex items-center gap-1">
                    <MapPin size={10} />
                    {[item.city, item.state].filter(Boolean).join(", ")}
                  </p>
                )}
                {item.description && (
                  <p className="text-xs text-secondaryText line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-customBorder/60 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {(item.categories ?? []).slice(0, 2).map((c) => (
                    <span
                      key={c}
                      className="text-[9px] font-mono bg-accentPrimary/10 border border-accentPrimary/20 text-accentPrimary px-1.5 py-0.5 rounded uppercase"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <ChevronRight
                  size={14}
                  className="text-mutedText group-hover:text-accentPrimary group-hover:translate-x-0.5 transition-transform shrink-0"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}