# BranDo — Authorization Model

BranDo combines **workspace roles** with **business-level scope**.

## Role vocabulary

The canonical application roles are:

| Role | Typical capabilities |
| --- | --- |
| `owner` | Full workspace administration, team management, settings, integrations, brand and content workflows |
| `full_editor` | Brand and content editing, selected integrations, no workspace ownership actions |
| `content_editor` | Content creation / editing and Studio AI access, without brand or team administration |
| `viewer` | Read-only access to the businesses explicitly available to the user |

## Scope model

Role alone is not enough to determine access.

A user can be:

- a workspace member with access to **all** businesses; or
- a workspace member with access to **specific** businesses only.

Conceptually:

```text
canPerform(action, user, business)
    = roleAllows(action)
      AND businessScopeAllows(user, business)
      AND databasePolicyAllows(user, business)
```

## UI capability layer

The React application uses small capability helpers such as:

```ts
canManageTeam(role)
canEditBrand(role)
canCreateContent(role)
canUseAI(role)
```

These helpers are for predictable UX: controls should not be displayed as available when the current user cannot use them.

See [`../code-samples/authorization/role-capabilities.ts`](../code-samples/authorization/role-capabilities.ts).

## Database boundary

UI gating is not treated as security.

Sensitive data access and mutations are also constrained through database policies and protected workflows. The private application uses PostgreSQL Row Level Security and scoped authorization helpers to enforce tenant boundaries.

Examples of rules the database layer must preserve:

- users cannot read arbitrary businesses outside their workspace / scope;
- editors cannot gain owner-only administration capabilities by crafting requests;
- subscription records are not writable directly by normal client roles;
- approval transitions require the correct actor and valid workflow state;
- public-sharing flows must expose only a deliberately scoped projection, not underlying tenant tables.

## Why this required iteration

The permission system evolved as BranDo moved from a single-user product to a collaborative SaaS.

Early versions accumulated overlapping role definitions and independently written SQL policies. A read-only audit identified the risk of schema and policy drift. The remediation strategy was to establish one canonical role vocabulary, forward-only migrations, and explicit role × scope × operation checks.

That process is documented in [`SECURITY_ENGINEERING.md`](SECURITY_ENGINEERING.md).

## Authorization vs entitlement

Authorization answers:

> Is this user allowed to perform this action on this resource?

Entitlement answers:

> Does this workspace's subscription include this capability or remaining quota?

These are separate concerns. For example, a `full_editor` may be authorized to export a brand document but still be blocked if the workspace is on a plan that does not include exports.

Keeping those concepts separate prevents subscription rules from becoming mixed into the security model.
