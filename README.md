# BranDo — Brand Strategy, Content Planning & AI-Assisted SaaS

BranDo is a multi-tenant SaaS workspace for managing brand strategy, content planning, team collaboration, approvals, subscriptions, and AI-assisted content workflows from one system.

> **Portfolio showcase:** this repository is a curated, sanitized snapshot of selected engineering work from a private production codebase. Production credentials, customer data, provider-specific secrets, operational scripts, database repair tooling, and deployment configuration are intentionally excluded.

## Product overview

BranDo is designed around a simple product idea: a business should not have to rebuild its brand context every time it plans content, briefs a collaborator, or asks an AI tool for help.

The platform keeps a structured **Brand Hub** as the source of truth, then reuses that data across:

- content planning and calendar workflows;
- AI-assisted prompt generation;
- platform-specific content strategy;
- client / reviewer approval flows;
- team roles and business-level permissions;
- exports and reusable brand documents;
- subscription-based feature and usage gating;
- Google Calendar integration;
- responsive Hebrew / RTL product flows.

## Product architecture

```text
User / Team
    ↓
Next.js application
    ↓
Feature workflows
    ├── Brand Hub
    ├── Content Calendar
    ├── Studio AI
    ├── Team & Permissions
    ├── Billing / Entitlements
    └── Integrations
    ↓
Application services + React Query
    ↓
Supabase / PostgreSQL / RLS / RPCs
```

The product is multi-tenant at two levels:

```text
Workspace
   ├── Business A
   ├── Business B
   └── Business C

User access = workspace role + business scope
```

This lets one workspace manage multiple brands while still supporting users who should only see specific businesses.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Selected engineering highlights

### 1. Structured Brand Hub as reusable domain context

Brand data is modeled as structured information rather than a free-text profile. The system tracks fields such as:

- audience and audience segments;
- brand voice and values;
- key messages;
- services and offers;
- content pillars;
- visual language;
- preferred platforms and content types;
- words to use / avoid;
- links and brand assets.

A shared completion model evaluates whether the brand context is sufficiently complete for downstream workflows.

See [`code-samples/brand/brand-completion.ts`](code-samples/brand/brand-completion.ts).

### 2. Brand-grounded AI workflows

Studio AI does not start from an empty prompt. It assembles normalized brand context first, then uses that context to create richer, more consistent instructions for downstream AI tools.

The workflow separates:

```text
Brand data
   ↓
Normalization
   ↓
Readiness / missing-data checks
   ↓
Task-specific prompt logic
   ↓
Platform-aware instructions
   ↓
Quality / relevance constraints
```

The product also contains deterministic content-intelligence logic for content angles, marketing goals, relevance gates, and platform guidance rather than relying entirely on opaque model output.

See [`docs/AI_CONTENT_SYSTEM.md`](docs/AI_CONTENT_SYSTEM.md) and [`code-samples/ai/brand-context.ts`](code-samples/ai/brand-context.ts).

### 3. Multi-tenant authorization

BranDo distinguishes between four application roles:

- `owner`
- `full_editor`
- `content_editor`
- `viewer`

Role-based UI capabilities are only one layer. Database access is also constrained through PostgreSQL Row Level Security, scoped business membership, and server/database-side authorization for sensitive workflows.

See [`docs/AUTHORIZATION_MODEL.md`](docs/AUTHORIZATION_MODEL.md).

### 4. Subscription and usage enforcement

Free / Pro entitlements are not handled only by hiding buttons in the UI. Usage-sensitive features can also be enforced at the database boundary through quotas, triggers, RPCs, and read-only subscription state.

Examples include limits for businesses, monthly content items, AI workflows, exports, team access, and calendar integrations.

### 5. Security as an iterative engineering process

The private project went through several read-only audits and hardening passes covering:

- public-sharing boundaries;
- RLS policy scope;
- approval authorization;
- route-level authentication;
- OAuth state integrity;
- permission parity between development and production;
- export authorization;
- debug / internal routes;
- schema drift.

Several issues discovered during those audits were then redesigned or disabled until they could be safely reintroduced.

This showcase documents that process as an engineering case study rather than presenting security as a one-time checkbox.

See [`docs/SECURITY_ENGINEERING.md`](docs/SECURITY_ENGINEERING.md).

## My role

I led the product definition and end-to-end development of BranDo, including:

- translating brand-management workflows into product requirements;
- UX and information architecture for a Hebrew / RTL SaaS product;
- domain modeling for businesses, brand profiles, content, permissions and subscriptions;
- Next.js / React / TypeScript implementation;
- Supabase / PostgreSQL integration;
- RLS and permission-model design and iteration;
- Studio AI / content-intelligence logic;
- billing and feature-entitlement flows;
- Google Calendar integration design;
- testing, debugging, security review and iterative hardening.

AI-assisted development tools were used as part of the implementation workflow. Product decisions, system behavior, architecture, domain rules, QA criteria and integration decisions were directed and reviewed by me.

## Tech stack

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Supabase / PostgreSQL / Row Level Security**
- **TanStack React Query**
- **Tailwind CSS**
- **Lucide React**
- **Google OAuth / Calendar integration**
- **PWA**
- **Hebrew / RTL UI**

## Code samples

This showcase contains selected, sanitized modules from the private codebase:

- [`brand-completion.ts`](code-samples/brand/brand-completion.ts) — shared brand-readiness logic.
- [`brand-context.ts`](code-samples/ai/brand-context.ts) — normalization of structured brand data for AI workflows.
- [`role-capabilities.ts`](code-samples/authorization/role-capabilities.ts) — application-level capability model.
- [`oauth-state.ts`](code-samples/security/oauth-state.ts) — signed, short-lived OAuth state verification.

The samples are intentionally limited. This repository is **not** a deployable copy of the private production application.

## Engineering case study

For interview discussion, the most useful areas are:

1. designing a two-level multi-tenant permission model;
2. turning qualitative brand strategy into structured reusable data;
3. grounding AI workflows in business context instead of generic prompts;
4. enforcing product entitlements at both UI and database layers;
5. identifying and correcting security-boundary problems through iterative audits;
6. keeping a large Hebrew / RTL SaaS product usable across desktop and mobile.

See [`docs/ENGINEERING_CASE_STUDY.md`](docs/ENGINEERING_CASE_STUDY.md).

## Screenshots

Product screenshots will be added to `assets/screenshots/` after final privacy review. The strongest showcase flows are:

- Dashboard
- Brand Hub
- Content Calendar
- Studio AI
- Team / permissions
- Subscription settings

## Development status

BranDo is an evolving product. The private codebase continues to change as features, permission rules, integrations, performance, and security controls are refined.

The public showcase should therefore be treated as a **curated engineering snapshot**, not as the canonical production repository.

## Security & repository scope

This repository intentionally excludes:

- `.env` files and real credentials;
- Supabase project identifiers and production secrets;
- payment-provider credentials;
- Google client secrets;
- customer / workspace data;
- destructive database scripts;
- production migration history;
- scratch / diagnostic tooling;
- internal audit artifacts that expose operational details;
- deployment-only configuration.

The private production repository remains separate from this showcase.

---

**Project:** BranDo  
**Status:** Active development  
**Focus:** Full-stack SaaS · product engineering · multi-tenant authorization · AI-assisted workflows
