# BranDo — Engineering Case Study

## Problem

Brand and content teams often work across disconnected tools: strategy lives in one document, content planning in another, approvals in chat, and every AI interaction starts by reconstructing brand context from scratch.

BranDo was designed as one structured workspace where the brand becomes reusable product data.

## Product challenge

The core challenge was not building individual screens. It was making several workflows operate on the same model:

```text
Brand strategy
      ↓
Content planning
      ↓
AI assistance
      ↓
Team collaboration
      ↓
Approval / publishing workflows
```

That required decisions around data modeling, authorization, tenancy, subscriptions, integrations, and UX — not only frontend implementation.

## Decision 1 — Use structured brand data

A single free-text “brand brief” is flexible but difficult to reuse reliably.

BranDo therefore models key brand information separately: audience, services, voice, values, messages, content pillars, visual rules, platform preferences and more.

### Result

The same information can support:

- Brand Hub completion guidance;
- AI prompt generation;
- content strategy;
- exports;
- validation and quality checks.

### Trade-off

Structured data requires more onboarding effort, so the product needs progressive completion rather than forcing every field up front.

---

## Decision 2 — Two-level tenancy

A workspace may manage multiple businesses, while a collaborator may only need access to one of them.

Using only a workspace role would either over-share data or require a separate workspace for every brand.

### Model

```text
workspace membership
        +
business scope
        +
role capability
        =
effective access
```

### Result

The same workspace can support owners, full editors, content editors and viewers while preserving business-specific access.

### Trade-off

The authorization matrix becomes more complex and must be tested at both UI and database boundaries.

---

## Decision 3 — Separate authorization from subscription entitlements

Permission and payment are different questions.

A user might be allowed to manage content but belong to a Free workspace that has exhausted its monthly quota.

### Result

BranDo treats:

- **authorization** — who may perform an action;
- **entitlement** — whether the current plan includes the feature;
- **quota** — how much of the feature remains;

as separate concepts.

For meaningful limits, enforcement can exist at the database boundary as well as in the UI.

---

## Decision 4 — AI should consume product context, not replace product logic

A generic AI chat experience would make users repeat audience, brand voice, platform and service information on every request.

BranDo instead normalizes stored brand data and combines it with deterministic strategy rules before generating AI instructions.

### Result

AI output is better grounded and product behavior remains more inspectable.

### Trade-off

Maintaining platform guidance and deterministic content logic takes more engineering effort than forwarding a user message directly to a model.

---

## Decision 5 — Treat security findings as product design feedback

Security audits exposed cases where the initial abstraction was wrong — for example, using general business access as a proxy for approval authority, or implementing public sharing at too broad a database scope.

Rather than patching only the visible symptom, those findings were used to refine the underlying capability model.

### Result

Security work influenced architecture, database design and UX states.

---

## Decision 6 — Hebrew / RTL is a first-class interface constraint

BranDo is primarily a Hebrew product. RTL therefore affects:

- page and navigation structure;
- drawers and modals;
- mixed Hebrew / English / URL content;
- date and time formatting;
- error and permission states;
- responsive behavior.

This was handled as part of the product system rather than added at the end as a translation layer.

---

## What I would discuss in an interview

### Multi-tenant system design

How I modeled a workspace that can manage multiple businesses while limiting collaborators to selected brands.

### RLS and application permissions

Why UI capability helpers are useful but insufficient, and how PostgreSQL RLS / protected workflows complement them.

### AI grounding

How stored brand strategy is converted into normalized context and then combined with task- and platform-specific rules.

### Subscription architecture

Why quotas and entitlements should not be mixed into the authorization model, and why some limits should be enforced below the UI layer.

### Iterative security hardening

How read-only audits found architectural issues, how high-risk features were disabled when necessary, and how findings were converted into better system boundaries.

### Product / engineering balance

How UX requirements such as “manage several brands in one place” or “AI should already know my brand” translate into database, permission and application architecture.

## Current state

BranDo continues to evolve. This repository intentionally captures selected architectural and engineering decisions rather than attempting to publish the full private application.
