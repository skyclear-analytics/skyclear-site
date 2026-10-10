// SkyClear site Worker.
//
// Static files are still served straight from Cloudflare's asset store; this
// script only runs for paths that don't match a file. Its one job is to serve
// the Rent vs. Buy calculator's data from the GCS bucket that the monthly
// Cloud Run refresh job writes to, so the site never goes stale waiting for a
// manual copy.

const RVB_DATA_URL =
  "https://storage.googleapis.com/rvb-dashboard-skyclear/dashboard_data.json";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/data/rent-vs-buy.json") {
      // Cache at Cloudflare's edge for 1 hour — data only changes monthly.
      const upstream = await fetch(RVB_DATA_URL, {
        cf: { cacheTtl: 3600, cacheEverything: true },
      });
      if (!upstream.ok) {
        return new Response("Rent vs. Buy data is temporarily unavailable.", {
          status: 502,
        });
      }
      return new Response(upstream.body, {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "public, max-age=900",
        },
      });
    }

    // Everything else: normal static-asset handling (including 404s).
    return env.ASSETS.fetch(request);
  },
};
