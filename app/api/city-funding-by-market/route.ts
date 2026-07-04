import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const market = searchParams.get("market");
    const metric = searchParams.get("metric") === "count" ? "count" : "funding";

    if (!market) {
      return NextResponse.json({ error: "market is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rpcName =
      metric === "count" ? "get_city_deal_count_by_market" : "get_city_funding_by_market";

    const { data, error } = await supabase.rpc(rpcName, {
      market_input: market.trim(),
      limit_count: 8,
    });

    // Deal-count mode doesn't return total_funding -- normalize so the
    // frontend always gets the same shape.
    const normalized =
      metric === "count"
        ? (data ?? []).map((row: { city: string; deal_count: number }) => ({
            ...row,
            total_funding: 0,
          }))
        : data;

    if (error) {
      return NextResponse.json(
        {
          error: `Database error: ${error.message}. Make sure 015_city_funding_by_market.sql has been run.`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: normalized ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}