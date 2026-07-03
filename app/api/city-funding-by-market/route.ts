import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const market = searchParams.get("market");

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

    const { data, error } = await supabase.rpc("get_city_funding_by_market", {
      market_input: market.trim(),
      limit_count: 8,
    });

    if (error) {
      return NextResponse.json(
        {
          error: `Database error: ${error.message}. Make sure 015_city_funding_by_market.sql has been run.`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}