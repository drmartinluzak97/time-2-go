import { proxy } from "@/lib/upstream";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  return proxy("/api/v1/geocode", params, ["text", "language", "type", "place", "placeBias"], 86400);
}
