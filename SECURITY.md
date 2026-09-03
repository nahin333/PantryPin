# Security Policy

PantryPin handles user-supplied images and can connect to paid third-party APIs, so reports that protect user data or credentials are taken seriously.

## Supported versions

| Version | Security updates |
| --- | --- |
| `main` and `0.1.x` | Supported |
| `< 0.1.0` | Not supported |

Only the latest code on `main` and the latest published release receive security fixes.

## Report a vulnerability privately

Use [GitHub's private vulnerability reporting](https://github.com/nahin333/where-and-how-much/security/advisories/new). Do not include exploit details, credentials, private images, or sensitive logs in a public issue or discussion.

Please include:

- the affected commit, release, or deployment mode;
- the impact and the conditions required to reproduce it;
- minimal reproduction steps or a proof of concept;
- any suggested remediation;
- whether the issue is already public or under active exploitation.

Reports are reviewed and addressed on a best-effort basis. Timelines for acknowledgment, remediation, and coordinated disclosure depend on severity, maintainer availability, and complexity. Please allow a reasonable remediation window before public disclosure. This project does not currently operate a bug-bounty program.

## Security boundaries

The GitHub Pages demo is static and contains no OpenAI key or server-side API. Self-hosters are responsible for securing their backend and should:

- keep all provider credentials server-side and out of `NEXT_PUBLIC_*` variables;
- add authentication, rate limiting, request-size limits, abuse monitoring, and image moderation before exposing the API publicly;
- restrict cross-origin access while remembering that CORS is not authentication;
- review logs and error responses for image data, credentials, and provider details;
- keep dependencies and GitHub Actions updated.

PantryPin does not intentionally persist uploaded images. In AI mode, the configured model provider processes the image, so operators must disclose that provider relationship and follow its data-handling terms.

## Not security vulnerabilities

Incorrect ingredient, nutrition, price, distance, availability, or recipe estimates are product-quality issues rather than security vulnerabilities. Report reproducible examples through the bug form, without attaching sensitive images.
