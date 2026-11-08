// Server-side proxy helper for the MOTIS API.
// Default upstream is the public Transitous instance; set MOTIS_API_URL to point
// at your own MOTIS server later (no frontend changes needed).

const UPSTREAM = (process.env.MOTIS_API_URL || "https://api.transitous.org").replace(/\/$/, "");
const USER_AGENT = process.env.MOTIS_USER_AGENT || "time-2-go/0.1 (+https://github.com/drmartinluzak97/time-2-go)";

export async function proxy(
  path: string,
  incoming: URLSearchParams,
  allowed: readonly string[],
  cacheSeconds: number,
): Promise<Response> {
  const params = new URLSearchParams();
  for (const key of allowed) {
    const value = incoming.get(key);
    if (value !== null && value !== "") params.set(key, value.slice(0, 500));
  }

  try {
    const res = await fetch(`${UPSTREAM}${path}?${params.toString()}`, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      next: { revalidate: cacheSeconds },
      signal: AbortSignal.timeout(20000),
    });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": res.ok
          ? `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 2}`
          : "no-store",
      },
    });
  } catch (err) {
    console.error(`[proxy] ${path} failed:`, err);
    return Response.json({ error: "upstream_unavailable" }, { status: 502 });
  }
}
