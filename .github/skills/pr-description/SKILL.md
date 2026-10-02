---
name: pr-description
description: Write the pull request description for the current branch, following the repository's PR template.
disable-model-invocation: true
---

Write the description of the pull request for the current branch. Its structure is [`.github/pull_request_template.md`](../../pull_request_template.md): read it first, its comments say what each section holds.

## 1. Gather the change

- Base: the PR's target branch, `develop` unless the user names another one.
- `git log <base>..HEAD` and `git diff <base>...HEAD` for what changed.
- The conversation for why it changed: the problem, the root cause, measurements, rejected alternatives. The diff cannot show these, which makes them the most valuable part of the description.
- Issue references in the commit messages (`#123`) for the `Closes` line.

Done when you can state the motivation in one sentence and account for every file in the diff.

## 2. Fill the sections

- **Description**: lead with the problem or motivation, then the solution in two or three sentences. Keep `Closes #<issue>` only with a known issue number, otherwise remove the line.
- **Detailed Changes**: one bullet per logical change, grouped by purpose and naming the files. Add the evidence that exists: test results, before/after measurements as a table.
- **Notes**: breaking changes, required migrations, configuration changes, known limitations, effects on projects based on the PWA. When a change needs a migration note and `docs/guides/migrations.md` is not part of the diff, say so here and add an open task.
- **Open Tasks**: everything still to do before merging, as `- [ ]` items: follow-ups from the conversation, a missing migration note, pending reviews. Keep a template item only when it applies: documentation or localization changes need the documentation team review, visual changes need the VD / IAD approval.
- **Other Information**: keep the heading and leave the section empty. The Azure work item link is added there automatically.

Remove the template's HTML comments.

## 3. Hand over

Suggest a PR title following the Conventional Commits prefixes in [`commit-style.instructions.md`](../../instructions/commit-style.instructions.md). Then return the description as one fenced `markdown` block, ready to paste; use a four-backtick outer fence when the description contains code blocks.
