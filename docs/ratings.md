# Community ratings

Paper ratings use a small Cloudflare Worker with Durable Object storage. A visitor can keep one current 1–5 rating per paper and browser. Updating a rating replaces that browser's previous vote; clicking the selected star again removes it. The website displays the live average and vote count.

The public catalogue remains on GitHub Pages. The Worker accepts writes only from the published site origin and the local preview origin. It stores a one-way hash of the browser-generated voter ID rather than the raw value. This is a lightweight community signal, not an authenticated scientific ranking.

The live endpoint is `https://awesome-gea-ratings.ratings-worker.workers.dev/ratings`.

To redeploy or move the service:

1. Deploy `ratings-worker/worker.mjs` with `ratings-worker/wrangler.jsonc` from a Cloudflare account.
2. Add the resulting HTTPS endpoint, including `/ratings`, to `meta.ratingsApiUrl` in `data/resources.json`.
3. Run `npm run build`, then publish the generated site.

Until the endpoint is configured, personal ratings remain on the visitor's device and the community average is visibly marked as pending.
