# PantryPin

PantryPin turns a food photo into a practical ingredient breakdown, nutrition estimate, nearby grocery basket comparison, and a short list of cooking guides.

Requires Node.js 20.9 or newer.

## What is real in this MVP

- Food-photo analysis uses the OpenAI Responses API with a vision-capable model and a strict JSON schema when `OPENAI_API_KEY` is configured.
- Without a key, the app remains fully explorable using clearly labeled demo analysis.
- Ingredient quantities, calories, and macros are estimates because a single photo cannot reveal recipe quantities, hidden oils, or exact serving weight.
- Grocery prices are deterministic demo estimates and are labeled that way in the interface. The pricing module is isolated so a licensed retailer provider can replace it.
- Recipe cards link to searches on established cooking sites rather than copying their content.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Add an OpenAI API key to `.env.local` for real image analysis; otherwise click “Try our example bowl.”

## Test and build

```bash
npm test
npm run build
```

## Deploy the frontend to GitHub Pages

The included `.github/workflows/deploy-pages.yml` builds and publishes the static site after every push to `main`.

1. Open the repository on GitHub and go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main`, or manually run **Deploy PantryPin to GitHub Pages** from the Actions tab.

The expected URL for this repository is:

`https://nahin333.github.io/where-and-how-much/`

The Pages deployment runs in clearly labeled demo mode by default.

### Enable real photo analysis

GitHub Pages cannot run the `/api/analyze` server route, and an OpenAI key must never be placed in browser code. Deploy this repository's Next.js server/API to a serverless host, set its `OPENAI_API_KEY` and:

```text
ALLOWED_ORIGIN=https://nahin333.github.io
```

Then set `NEXT_PUBLIC_API_BASE_URL` in the Pages workflow to that API host and change `NEXT_PUBLIC_STATIC_DEMO` to `"false"`.

The optional server accepts images up to roughly 5 MB and never persists them. For a production public launch, add authentication, request rate limits, image moderation, observability, and a retailer data agreement/API.

## Live grocery pricing path

`lib/pricing.ts` is the provider boundary. A production adapter should:

1. Geocode the ZIP or ask the retailer API for nearby locations.
2. Search a normalized product query for each inferred ingredient.
3. normalize package sizes and units before comparing prices;
4. return availability, timestamp, pickup method, and retailer product URL;
5. cache short-lived results and show partial availability honestly.

Walmart pricing is not scraped by this project. Use an authorized affiliate, retailer, or grocery-commerce API and follow its terms.

## Stack

Next.js App Router, TypeScript, OpenAI Node SDK, Zod, Vitest, and hand-authored responsive CSS.
