---
description: 'Use when committing, writing a commit message, or naming a pull request.'
applyTo: '**'
excludeAgent: 'code-review'
---

## Branching

To commit code changes, use a working branch or create one based on `develop`.
Never commit to `develop` or `master` directly.

## Commit Message Guidelines (Conventional Commits)

Pick the type from `type-enum` in [`commitlint.config.js`](../../commitlint.config.js); its `prompt` section describes each type and marks the ones that produce a changelog entry.
Beyond the standard types, the project uses `deps:` for dependency updates, `i18n:` for localization, and `temp:` for commits removed before merging.

**Example:**

```
feat: add NgRx effect for product load
fix: correct price calculation in cart
```

## Subject Line Length

Applies to commit subjects and pull request titles.

- Aim for 50 characters, at most 72, including the type prefix.
- Name one change. When a second one comes up, split the commit, or name the main change and move the rest to the body.
- Name the effect; the body and the PR description carry techniques, component names, and other details.
