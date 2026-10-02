---
name: resolving-merge-conflicts
description: 'Use when you need to resolve an in-progress git merge/rebase conflict.'
---

1. **See the current state** of the merge/rebase. Check git history, and the conflicting files.

2. **Find the primary sources** for each conflict. Understand deeply why each change was made, and what the original intent was. Read the commit messages, check the PRs, check original issues/tickets.

3. **Resolve each hunk.** Preserve both intents where possible. Where incompatible, pick the one matching the merge's stated goal and note the trade-off. Keep to behaviour that already exists on one side. When a hunk needs a judgement call the sources cannot settle, leave the merge in progress and ask the user.

4. Discover the project's **automated checks** and run them, typically typecheck, then tests, then format. Fix anything the merge broke.

5. **Finish the merge/rebase.** Stage only the files you resolved or fixed (`git add <file>`). Show the user `git status` and a summary of each resolution and trade-off, then commit (or `git rebase --continue`) once the user confirms. If rebasing, repeat until all commits are rebased; the user may approve the remaining steps at once.
