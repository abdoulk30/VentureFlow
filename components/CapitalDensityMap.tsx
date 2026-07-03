"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface CityFunding {
  city: string;
  total_funding: number;
  deal_count: number;
}

function formatUSD(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export default function CapitalDensityMap({
  marketOptions,
}: {
  marketOptions: string[];
}) {
  const [market, setMarket] = useState(marketOptions[0] ?? "");
  const [data, setData] = useState<CityFunding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (!market) return;
    setLoading(true);
    setError(null);
    fetch(`/api/city-funding-by-market?market=${encodeURIComponent(market)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setError(json.error);
          setData([]);
        } else {
          setData(json.data ?? []);
        }
      })
      .catch(() => setError("Could not load data."))
      .finally(() => setLoading(false));
  }, [market]);

  const maxFunding = Math.max(...data.map((d) => d.total_funding), 1);

  return (
    <div className="bg-cardBg border border-customBorder rounded-xl p-5">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-mutedText">
            Capital Density Map
          </p>
          <h3 className="text-sm font-semibold text-white mt-0.5">
            Total Funding by City
          </h3>
        </div>
        <select
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          className="bg-surfaceMuted border border-customBorder rounded px-3 py-1.5 text-xs text-white outline-none focus:border-accentPrimary/50"
        >
          {marketOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <p className="text-[11px] text-mutedText mb-6">
        Real total historical funding raised by companies in each city, for
        the selected industry.
      </p>

      {loading ? (
        <div className="h-52 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-mutedText" />
        </div>
      ) : error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-xs text-mutedText text-center py-10">
          No real companies found for this industry.
        </p>
      ) : (
        <div className="relative h-52 flex items-end justify-between gap-3 px-1">
          {data.map((d) => {
            const heightPct = Math.max((d.total_funding / maxFunding) * 100, 3);
            return (
              <div
                key={d.city}
                className="flex-1 h-full flex flex-col items-center justify-end relative"
                onMouseEnter={() => setHovered(d.city)}
                onMouseLeave={() => setHovered(null)}
              >
                {hovered === d.city && (
                  <div className="absolute bottom-full mb-2 z-10 bg-surfaceMuted border border-customBorder rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                    <p className="text-xs font-semibold text-white">{d.city}</p>
                    <p className="text-[11px] text-mutedText">
                      {formatUSD(d.total_funding)} &middot; {d.deal_count} companies
                    </p>
                  </div>
                )}
                <div
                  className="w-full rounded-t bg-gradient-to-t from-accentPrimary to-accentPrimary/60 transition-all cursor-default"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[10px] text-mutedText mt-2 text-center leading-tight">
                  {d.city}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}