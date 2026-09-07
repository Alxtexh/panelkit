import { NextResponse } from "next/server";

export const dynamic = "force-static";

const KEY = "7536dd7636e93d1d5f7eca797af976c8620bbc5a28c0e513db55f993b74d74ac";

export async function GET() {
  return new NextResponse(KEY, {
    headers: { "Content-Type": "text/plain" },
  });
}
