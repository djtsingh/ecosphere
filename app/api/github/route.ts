import { NextResponse } from "next/server";

import { getGitHubSnapshot } from "@/lib/github";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET(): Promise<NextResponse> {
  try {
    const snapshot = await getGitHubSnapshot();
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=3600"
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to fetch GitHub data"
      },
      { status: 503 }
    );
  }
}