import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Computes a REAL composite funding-likelihood score from historical_deals,
// made of 4 independently-computed real sub-metrics (see
// 007_funding_likelihood.sql for exact methodology on each). No fabricated
// numbers, no ML model, no baseline/default score -- if there's no matching
// historical data, we say so instead of returning a number.
//
// Wrapped in try/catch so any unexpected failure always returns a readable
// JSON error instead of a bare 500 with no explanation.
export async function POST(request: Request) {
  try {
    const { city, market, stage } = await request.json();

    if (!city || !market || !stage) {
      return NextResponse.json(
        { error: "City, industry, and funding stage are all required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .rpc("get_funding_likelihood", {
        city_input: city.trim(),
        market_input: market.trim(),
        stage_input: stage.trim(),
      })
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: `Database error: ${error.message}. Make sure 007_funding_likelihood.sql has been run in Supabase.`,
        },
        { status: 500 }
      );
    }

    const result = data as {
      total_matches: number;
      sector_alignment: number | null;
      city_density: number | null;
      stage_fit: number | null;
      trend_velocity: number | null;
      total_score: number | null;
    };

    if (!result || !result.total_matches || result.total_matches === 0) {
      return NextResponse.json({
        hasData: false,
        totalMatches: 0,
        message:
          "We couldn't find any real historical companies matching this city and industry. Try a nearby major city, or a broader industry.",
      });
    }

    return NextResponse.json({
      hasData: true,
      totalMatches: result.total_matches,
      totalScore: result.total_score ?? 0,
      breakdown: {
        sectorAlignment: result.sector_alignment ?? 0,
        cityDensity: result.city_density ?? 0,
        stageFit: result.stage_fit ?? 0,
        trendVelocity: result.trend_velocity ?? 0,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: `Unexpected server error: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 500 }
    );
  }
}