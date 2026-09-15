import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    agents: ["receptionniste", "generateur-site", "assistant-agenda"],
    mcp: "apps/mcp-server/src/index.mjs",
  });
}
