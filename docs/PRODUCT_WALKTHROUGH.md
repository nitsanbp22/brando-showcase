# BranDo — Product Walkthrough

BranDo is a Hebrew-first, RTL SaaS workspace for managing brand strategy, content planning, AI-assisted workflows, team access, approvals and business-facing outputs.

This walkthrough highlights the product flows represented in the public showcase screenshots.

## 1. Public product positioning

The public landing page presents BranDo as a central workspace for brand management, content planning and AI-assisted execution rather than as a single-purpose content tool.

**Screenshot:** `assets/screenshots/landing-hero.png`

## 2. Workspace dashboard

The dashboard summarizes the current workspace state and gives users direct entry points into the most common workflows.

It surfaces operational signals such as:

- number of businesses;
- content activity;
- brand readiness;
- upcoming work;
- planning gaps;
- strategic recommendations.

The goal is to turn the dashboard into a decision surface rather than a static analytics page.

**Screenshot:** `assets/screenshots/dashboard.png`

## 3. Brand Hub

The Brand Hub is the structured source of truth for each business managed in the workspace.

Instead of storing brand context as one long document, BranDo models reusable fields such as:

- brand DNA;
- audience and segments;
- services and offers;
- brand voice and messaging;
- visual language;
- colors and typography;
- content pillars;
- strategy and platform preferences.

A shared completion model evaluates whether enough context exists for downstream workflows.

**Screenshot:** `assets/screenshots/brand-hub.png`

## 4. Studio AI

Studio AI assembles context-aware prompts from the structured Brand Hub rather than asking users to repeatedly explain the same business to each AI tool.

The workflow combines:

```text
Business selection
      ↓
Requested output
      ↓
Marketing objective
      ↓
Platforms + content type
      ↓
Structured brand context
      ↓
Task-specific prompt construction
      ↓
Platform and quality constraints
```

The resulting prompt can be adapted to external AI tools while preserving the brand's voice, audience, services, visual rules and content strategy.

**Screenshot:** `assets/screenshots/ai-studio.png`

## 5. Content calendar

The content calendar connects strategy to execution.

Users can:

- plan content and events by date;
- filter by business, status, platform, type and category;
- move between calendar views;
- open content directly into the editing workflow;
- coordinate approvals and publishing state.

Because the workspace can contain multiple businesses, the calendar operates within the same tenant and business-scope permission model used elsewhere in the product.

**Screenshot:** `assets/screenshots/content-calendar.png`

## 6. Structured content editing

Content creation is handled through a structured editing drawer rather than a single free-text field.

A content item can carry context such as:

- owning business;
- content type;
- workflow status;
- client-approval status;
- assigned collaborator;
- written concept / copy;
- editing notes;
- target platforms and publishing metadata.

This shared data model supports the calendar, collaboration, approvals, exports and integrations without duplicating content state across features.

**Screenshot:** `assets/screenshots/content-editor.png`

## 7. Branded exports

BranDo can transform the structured information already stored in the workspace into reusable business-facing documents.

Examples include brand documents, content-planning outputs and printable summaries. The export layer is intended to reuse the same canonical brand and content data rather than maintaining a separate document system.

**Screenshot:** `assets/screenshots/export-document.png`

## Product system at a glance

```text
Brand Hub
   ↓
Reusable brand context
   ├── Dashboard
   ├── Content Calendar
   ├── Studio AI
   ├── Collaboration / approvals
   ├── Integrations
   └── Documents / exports
```

The product is deliberately designed around shared domain data: adding richer brand context improves multiple downstream workflows rather than only one screen.

## Engineering themes visible in the product

- **Two-level tenancy** — workspaces can contain multiple businesses, while user access can be restricted by both role and business scope.
- **Structured domain modeling** — qualitative brand strategy is transformed into reusable application data.
- **Context-grounded AI** — AI workflows are built on normalized business context rather than generic prompts.
- **Defense in depth** — application-level capabilities are paired with database authorization for sensitive data and workflows.
- **Entitlement-aware SaaS design** — subscription limits affect UI, usage accounting and backend enforcement.
- **RTL product engineering** — the primary interface is Hebrew and right-to-left across dense desktop workflows.

> BranDo is actively evolving. Screenshots represent a specific product snapshot and may differ from later versions of the private application.
