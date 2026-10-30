---
name: resolving-merge-conflicts
description: 'Use when you need to resolve an in-progress git merge/rebase conflict.'
---

1. **Map the conflicts.** Identify the operation (merge, rebase, cherry-pick) and its goal, e.g. bring `develop` into a feature branch. List the conflicted files with `git diff --name-only --diff-filter=U` and the conflict hunks in each.
   Done when you hold a list of every conflicted hunk, each with its file and its two sides.

2. **Find the intent of both sides** for every hunk on the list. `git log --merge -p -- <file>` shows the commits from each side that touched the file (during a rebase this needs Git 2.45 or newer); read their messages and follow references to PRs and issues.
   Done when every hunk has a one-line intent per side, each backed by a commit, PR, or issue. A side whose intent no source explains is a judgement call for step 3.

3. **Resolve each hunk.** Preserve both intents where possible. Where incompatible, pick the one matching the merge's stated goal and note the trade-off. Keep to behaviour that already exists on one side. When a hunk needs a judgement call the sources cannot settle, leave the merge in progress and ask the user.
   Done when `git diff --check` reports no conflict markers and every hunk on the list has its resolution noted.

4. Discover the project's **automated checks** and run them, typically typecheck, then tests, then format. Fix anything the merge broke.
   Done when every check passes, or each remaining failure also occurs on the target branch without the merge.

5. **Finish the merge/rebase.** Stage only the files you resolved or fixed (`git add <file>`). Show the user `git status` and a summary of each resolution and trade-off, then commit (or `git rebase --continue`) once the user confirms. If rebasing, repeat until all commits are rebased; the user may approve the remaining steps at once.
