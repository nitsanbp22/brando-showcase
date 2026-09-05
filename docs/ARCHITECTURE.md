# BranDo — Architecture Overview

## System shape

BranDo is a multi-tenant SaaS product built around two scopes:

```text
Workspace
  ├── Business A
  ├── Business B
  └── Business C
```

A user belongs to a workspace and may either have access to all businesses or only a selected subset. Product capabilities are then derived from both **role** and **business scope**.

## Main layers

```text
Presentation
  Next.js routes, React components, responsive RTL UI
        ↓
Feature / Application workflows
  Brand Hub, Calendar, AI Studio, Team, Billing, Integrations
        ↓
Shared application services
  React Query hooks, capability helpers, normalization logic
        ↓
Data / infrastructure
  Supabase Auth, PostgreSQL, RLS, RPCs, external integrations
```

The product is not implemented as a strict textbook clean-architecture codebase, but the main business concepts are intentionally separated into reusable modules where possible.

## Core domains

### Workspace and businesses

The workspace is the tenant boundary. A workspace can contain multiple businesses, each with independent brand data and content.

Important entities include:

- workspace;
- workspace membership;
- business;
- business-scoped membership;
- brand profile;
- content pillars;
- content items / events;
- comments and approvals;
- subscription and usage state;
- integrations.

### Brand Hub

The Brand Hub is the reusable source of truth for a business. Instead of asking the user to restate brand context in every workflow, BranDo stores structured fields and normalizes them for downstream features.

This context is reused by Studio AI, planning, exports, and quality checks.

### Content calendar

The calendar is both a planning surface and a collaboration workflow. Content items can carry platform, pillar, marketing goal, service association, participants, comments, approval state and publishing data.

The product supports multiple calendar views and a detailed content drawer rather than treating the calendar as a simple date list.

### Studio AI

Studio AI is an orchestration layer rather than a generic chat box. It combines:

1. stored brand context;
2. user task intent;
3. platform-specific constraints;
4. content-strategy rules;
5. quality and relevance checks;
6. explicit missing-information handling.

The result can then be used with downstream AI tools while keeping brand context consistent.

### Authorization

Authorization has two distinct responsibilities:

- **UI capability gating** — determines what controls should be visible or enabled.
- **data-boundary enforcement** — handled through RLS, scoped queries and protected RPC/server workflows.

The UI layer is never considered the authoritative security boundary.

See [`AUTHORIZATION_MODEL.md`](AUTHORIZATION_MODEL.md).

### Subscription and usage

Entitlements are modeled separately from authorization. A user may be authorized to perform an action but still be blocked because the current plan does not include the feature or because a usage quota was reached.

For higher-risk limits, BranDo can enforce quotas at the database layer rather than relying only on disabled buttons.

## Data-fetching strategy

TanStack React Query is used to cache shared application data such as businesses, brand profiles, content pillars, subscription state, notifications and team information.

This reduces repeated fetching when the same business context is reused across different feature surfaces.

## Authentication and integrations

Supabase provides authentication and database access. External integrations use server routes where sensitive credentials or OAuth exchanges are involved.

Google OAuth state is signed and short-lived, with nonce-based correlation, so callback state is not trusted as plain caller-controlled input.

## Responsive / RTL system

BranDo is built primarily for Hebrew users, so RTL behavior is a product-level concern rather than a cosmetic translation pass.

The application includes:

- RTL layout and navigation;
- localized status and error states;
- responsive desktop / mobile navigation;
- PWA support;
- Hebrew-first workflow copy.

## Production vs showcase

This repository does not mirror the production tree. It intentionally excludes operational files, migrations, secrets, payment-provider implementation details and customer data.

The code samples here are selected to illustrate design decisions, not to reproduce the complete private application.
