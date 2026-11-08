import { proxy } from "@/lib/upstream";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  return proxy(
    "/api/v5/stoptimes",
    params,
    ["stopId", "n", "time", "arriveBy", "pageCursor", "language", "radius", "mode"],
    30,
  );
}
