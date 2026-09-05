# BranDo — Security Engineering Case Study

This document summarizes the engineering process used to improve BranDo's security boundaries during development.

It is **not** a security certification and does not claim that the private production application is permanently vulnerability-free. BranDo is an evolving product, so security review is treated as a recurring engineering activity.

## Why the audit mattered

BranDo grew from a relatively simple product into a collaborative multi-tenant SaaS with:

- workspaces and multiple businesses;
- team roles;
- client / reviewer interactions;
- public sharing;
- OAuth integrations;
- subscriptions and billing;
- database RPCs;
- AI-related workflows.

Each additional capability created new trust boundaries. A static, read-only audit was therefore performed before expanding higher-risk features.

## Examples of issues identified during development

### Public-sharing scope

An early public calendar-sharing design relied on broad database policies that checked whether an active sharing link existed, while token validation happened in application code.

That was not a sufficiently narrow database boundary: public access must be cryptographically and transactionally scoped to the exact share token and projection being requested.

**Engineering response:** public sharing was disabled at the application layer while the authorization model was redesigned. The preferred pattern became a token-scoped server / database function that returns only the explicitly public projection rather than granting anonymous access to underlying tenant tables.

### Approval authorization

An early approval flow reused a general business-access predicate. That answered “can this user access this business?” but not “is this user the correct reviewer and is this item currently in an approvable state?”

**Engineering response:** approval became a separate capability with explicit actor and state requirements, implemented as a protected transition rather than a generic update.

### Route protection

Some early authenticated pages depended on client-side redirects and RLS returning empty data.

**Engineering response:** route-level authentication was moved earlier in the request lifecycle so signed-out users could not first mount an authenticated application shell.

### OAuth state integrity

Caller-controlled OAuth state is not enough for a multi-tenant integration because state can contain workspace identifiers and other authorization context.

**Engineering response:** state became signed with HMAC, short-lived, nonce-correlated, and validated before code exchange / persistence.

See [`../code-samples/security/oauth-state.ts`](../code-samples/security/oauth-state.ts).

### Schema / permission drift

As the product evolved, multiple SQL files redefined overlapping helpers, policies and role vocabularies.

**Engineering response:** production parity checks were added and the role vocabulary was consolidated. Rather than blindly replaying historical setup scripts, remediation moved toward forward-only migrations based on inspected live state.

## Security principles that emerged

### 1. UI permissions are not authorization

Hiding a button is useful UX, but the same rule must be enforced at the data / server boundary when the action is sensitive.

### 2. Read access is not action authority

Being allowed to view a business does not imply permission to approve content, manage a team, connect an integration, or mutate subscription state.

### 3. Public projections should be narrow

Public sharing should return only the data intentionally exposed by the sharing feature. Underlying tenant tables should remain private.

### 4. State transitions should be explicit

Approval, invitation, billing, and similar workflows are safer when represented as validated transitions rather than arbitrary updates.

### 5. Fail closed on missing security configuration

Missing OAuth / database security configuration should prevent a protected flow from continuing rather than silently switching to permissive placeholders.

### 6. Production state must be verified separately from repository intent

A repository can contain a correct migration while the live database still has older policies. Database security therefore requires live-state verification, not only code review.

## Current showcase policy

The public-facing showcase intentionally excludes:

- live database identifiers;
- real API keys and OAuth credentials;
- payment-provider credentials;
- historical migration / repair scripts;
- raw production audit reports;
- customer or workspace data;
- internal diagnostic routes and scripts.

Before any significant update from the private repository is copied into this showcase, the copied material should receive a fresh secrets and privacy review.
