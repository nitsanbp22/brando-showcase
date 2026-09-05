# Security & Showcase Scope

This repository is a curated portfolio snapshot, not the production BranDo application.

## Intentionally excluded

The showcase must not contain:

- production `.env` files;
- Supabase project URLs or credentials;
- service-role credentials;
- payment-provider credentials or webhook secrets;
- Google client secrets;
- customer, workspace, billing, or invitation data;
- destructive / repair scripts;
- production migration history;
- internal diagnostic tooling;
- deployment configuration tied to the live product.

## Safe update process

Before copying new material from the private production repository into this showcase:

1. copy only the files or excerpts needed for the portfolio story;
2. remove provider- and production-specific data;
3. scan for credentials, project identifiers, tokens and personal data;
4. review screenshots for customer / account information;
5. verify that the private production repository and its Git history are not being imported;
6. review the final public diff before publishing.

## Important distinction

Code examples in this repository may be simplified or adapted for public presentation. When they differ from production, the file comments identify them as showcase-safe adaptations.

Security documentation here describes engineering decisions and lessons learned. It should not be interpreted as a current penetration-test result or a guarantee that the evolving private product contains no unresolved security work.
