# PantryPin v0.1.0 — From photo to pantry

PantryPin is a first public MVP exploring a simple idea: what if a food photo could help you understand likely ingredients, estimate nutrition, compare the cost of recreating the dish, and find useful cooking resources?

## Try it

- [Live simulated demo](https://nahin333.github.io/where-and-how-much/)
- [Source and setup](https://github.com/nahin333/where-and-how-much)

This is a GitHub source release. GitHub provides downloadable source archives for the tagged version; PantryPin is not published as an npm package.

## Highlights

- Food-photo upload flow
- Dish, ingredient, calorie-range, and macro result views
- Confidence labels and visible uncertainty
- ZIP-sensitive simulated basket comparisons
- Links to searches on established cooking sites
- Responsive GitHub Pages deployment
- Optional OpenAI vision backend for self-hosted deployments
- Tests, typed data boundaries, and automated deployment
- MIT-licensed source with contribution and support guides

## Know before you try it

The public Pages build uses clearly labeled canned scenarios; it does not inspect image pixels. Store prices, locations, and pickup details are illustrative rather than live retailer data. Self-hosting with an OpenAI API key enables vision-based food estimates, while retailer pricing remains simulated.

A photo cannot reveal exact portions, hidden oils, or every ingredient. Results are estimates and are not medical advice.

## Run locally

```bash
git clone https://github.com/nahin333/where-and-how-much.git
cd where-and-how-much
npm install
cp .env.example .env.local
npm run dev
```

Feedback and contributions are welcome. If PantryPin's direction is useful to you, consider starring the repository—or fork it to explore analysis, grocery-data providers, evaluation, or UX.
