# BranDo — AI & Content Intelligence System

BranDo's AI workflow is designed around **grounding first**.

The user should not have to paste the same brand brief into every AI tool. The product therefore stores brand context structurally, normalizes it, checks readiness, and only then generates task-specific instructions.

## Pipeline

```text
Business + Brand Hub
        ↓
Normalize brand context
        ↓
Measure readiness / missing fields
        ↓
Understand requested output
        ↓
Apply marketing goal + content angle logic
        ↓
Apply platform-specific guidance
        ↓
Apply relevance / generic-output checks
        ↓
Generate a structured AI brief / prompt
```

## Structured brand context

The normalized context can include:

- business identity and industry;
- brand summary and voice;
- audience and audience segments;
- values and key messages;
- words to use / avoid;
- services;
- content pillars;
- colors, typography and visual notes;
- preferred platforms and content types;
- publishing preferences;
- relevant links and assets;
- recent content for repetition awareness.

See [`../code-samples/ai/brand-context.ts`](../code-samples/ai/brand-context.ts).

## Readiness instead of invented context

A brand can be partial, ready, or strong depending on how much useful context is available.

Missing data should reduce specificity or be surfaced explicitly. It should not silently be replaced with invented business claims, audience assumptions, credentials, or guarantees.

That principle is why BranDo has a shared brand-completion calculation rather than simply checking whether a Brand Hub row exists.

## Deterministic strategy layer

Not every content decision is delegated to an LLM.

The private product contains deterministic logic for areas such as:

- marketing-goal categories;
- content-angle selection;
- platform-specific constraints;
- relevance checks;
- forbidden generic phrasing;
- content-gap awareness;
- structured output requirements.

This makes the workflow more predictable and easier to inspect.

## Content angles

Examples of modeled content angles include:

- pain point;
- common mistake;
- myth;
- audience question;
- decision moment;
- comparison;
- checklist;
- behind the scenes;
- before / after;
- objection;
- case story;
- short guide.

Different marketing goals can favor different angle families so a content plan does not collapse into repeated variations of the same idea.

## Platform intelligence

Platform instructions are kept separate from brand identity.

That separation matters because the same brand message may need different execution across Instagram, LinkedIn, TikTok, or another channel while still preserving the same voice and positioning.

For visual tasks, multi-platform output can also require separate sizes, safe zones, hierarchy, and composition decisions rather than a single duplicated asset.

## Why BranDo does not use a generic chat surface

A blank chat box moves too much responsibility back to the user. They must remember:

- who the audience is;
- what the brand sounds like;
- which offer is relevant;
- what the platform requires;
- which phrases should be avoided;
- what has already been posted.

BranDo treats those as product data and workflow rules, so AI assistance becomes a downstream capability of the system rather than the system itself.

## Current showcase scope

The complete prompt builder and platform guideline libraries are intentionally not included here. They contain a substantial amount of product-specific strategy logic from the private codebase.

The showcase includes enough code and documentation to demonstrate the architecture and design decisions without publishing the complete production implementation.
