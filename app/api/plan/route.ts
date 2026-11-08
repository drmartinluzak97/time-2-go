import { proxy } from "@/lib/upstream";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  return proxy(
    "/api/v5/plan",
    params,
    [
      "fromPlace",
      "toPlace",
      "time",
      "arriveBy",
      "transitModes",
      "maxTransfers",
      "numItineraries",
      "pageCursor",
      "language",
      "pedestrianProfile",
      "requireBikeTransport",
      "via",
      "viaMinimumStay",
    ],
    60,
  );
}
