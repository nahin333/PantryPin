# Contributing to PantryPin

Thanks for helping make food estimates more useful, transparent, and accessible. PantryPin is an early-stage project, so focused improvements and clear bug reports have an outsized impact.

## Project status

The public GitHub Pages site is a simulated demo. It does not inspect uploaded image pixels, and its grocery prices, distances, availability, and pickup times are illustrative. A self-hosted deployment can use OpenAI vision for food analysis, but grocery data remains simulated until an authorized retailer provider is added.

Good contribution areas include:

- accessibility and responsive-interface improvements;
- tests for analysis, pricing, and API behavior;
- clearer uncertainty and source labels;
- privacy, security, and deployment hardening;
- retailer-provider interfaces that use authorized APIs;
- documentation, examples, and evaluation datasets that are safe to redistribute.

## Before you start

Search the [existing issues](https://github.com/nahin333/where-and-how-much/issues) before opening a new one. For a substantial feature or architectural change, open a feature request first so scope and approach can be discussed before significant work begins.

Never submit credentials, private food photos, personal information, proprietary datasets, or scraped retailer data. Live retailer integrations must follow the provider's terms and clearly identify the source and freshness of returned data.

## Development setup

Prerequisites:

- Node.js 22 (see `.node-version`)
- npm

Set up your fork:

```bash
git clone https://github.com/YOUR-USERNAME/where-and-how-much.git
cd where-and-how-much
npm ci
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. The app works in demo mode without credentials. To test vision analysis, add your own `OPENAI_API_KEY` to `.env.local`; API use may incur charges from the provider. Never use a `NEXT_PUBLIC_*` variable for a secret.

## Quality checks

Run the same checks expected in continuous integration before opening a pull request:

```bash
npm test
npm run typecheck
npm run build
```

Add or update tests when behavior changes. If a change is primarily visual, include before-and-after screenshots or a short recording in the pull request.

## Pull requests

1. Create a focused branch from the latest `main`.
2. Keep the change small enough to review and avoid unrelated formatting churn.
3. Explain the user problem, the chosen approach, and important tradeoffs.
4. Link the relevant issue with `Closes #123` when applicable.
5. Update documentation and environment examples when setup or behavior changes.
6. Confirm that estimates, simulated values, and external data remain labeled honestly.
7. Wait for CI to pass and address review feedback.

Use clear, imperative commit subjects such as `Add API request validation tests`. Maintainers may squash commits when merging.

## Reporting problems

Use the repository's issue forms for reproducible bugs, feature proposals, and [setup or usage questions](https://github.com/nahin333/where-and-how-much/issues/new?template=question.yml). Do not report security vulnerabilities in a public issue; follow [SECURITY.md](SECURITY.md) instead.
