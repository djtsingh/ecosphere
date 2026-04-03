import { NextResponse } from "next/server";

import { answerPortfolioQuestion } from "@/lib/ask";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { question } = (await request.json()) as { question?: string };

    if (!question?.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const answer = await answerPortfolioQuestion(question);
    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to answer question"
      },
      { status: 500 }
    );
  }
}