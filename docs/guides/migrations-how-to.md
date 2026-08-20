<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Migration How To

- [Preparation](#preparation)
- [Choose an Import Approach](#choose-an-import-approach)
  - [Rebase Commits of New Release](#rebase-commits-of-new-release)
  - [Range Cherry Pick of New Release Commits](#range-cherry-pick-of-new-release-commits)
  - [Merge the New Release in its Entirety](#merge-the-new-release-in-its-entirety)
- [After Importing the Changes](#after-importing-the-changes)
  - [Install dependencies](#install-dependencies)
  - [Run the provided migration schematics](#run-the-provided-migration-schematics)
  - [Verify the project](#verify-the-project)
- [Further References](#further-references)

Integrating changes of new Intershop PWA releases into a customized PWA project (migration) is done with Git tooling.
If you follow the guidelines in this chapter, the updating process should run without major problems.

## Preparation

Reading the [migrations.md](./migrations.md) and the [CHANGELOG.md](../../CHANGELOG.md) - especially the 'BREAKING CHANGES' section - is the first step before any migration.

> [!TIP]
> The [Intershop Academy](https://public.academy.intershop.com/plus/catalog) (free registration required) offers migration‑related video tutorials in the _Progressive Web App_ category.

Begin any migration with adding the Intershop PWA GitHub repository as an additional remote if this is not already the case.

```
git remote add intershop https://github.com/intershop/intershop-pwa.git
```

Afterward, you need to fetch the new release tags of the `intershop` remote.

```
git fetch intershop 'refs/tags/*:refs/tags/*'
```

## Choose an Import Approach

For importing changes from the current release, you can use different approaches:

### Rebase Commits of New Release

For the `git rebase --onto` approach, you need to create a new branch based on the release tag of the Intershop PWA you want to migrate to, naming it, for example, `migration_to_1.1`.

```
git checkout -b migration_to_1.1 1.1.0
```

Now the branch with the Git commits of the new Intershop PWA release will be rebased onto the current project's main development branch.
To do so, you need to provide the branch name of the target branch to rebase onto.
In addition, a commit is needed where the current migration branch should be "cut off".
This is usually the current version tag of the Intershop PWA used in the custom project, e.g., `1.0.0`.
If there are any problems with the tag, using the specific commit SHAs should always work.

```
git rebase --onto develop 1.0.0
```

Now each commit of the new Intershop PWA release is applied to the custom project context.
Thus, if any merge conflicts arise, this will be within the specific Intershop PWA commit context and should be mergeable with the information and diff provided for this commit in the GitHub repository.

If merge conflicts need to be resolved, it is advisable to disable any pre-commit hooks during the migration.
For this purpose, set `HUSKY=0` as environment variable.

After successfully going through the rebase onto (with `git rebase --continue` after each resolved merge conflict), an `npm install` will probably be required, and you need to check whether the project code still works as expected.
Starting the server or `npm run check` are good basic tests for that.

### Range Cherry Pick of New Release Commits

For the range `git cherry-pick` approach, you need to create a new branch based on the current project's main development branch, naming it, for example, `migration_to_1.1`.

```
git checkout -b migration_to_1.1
```

Now, the Git commits of the new Intershop PWA release will be cherry-picked into this migration branch.
For this, you need to provide the wanted commit range by using the Intershop PWA version tags, e.g., `1.0.0` to `1.1.0` (since the end tag is a merge commit, it will lead to an error at the end of the cherry pick; to prevent this, only the commits up to the second parent should be used with `^2`).
If there are any problems with the tags, using the specific commit SHAs should always work.

```
git cherry-pick 1.0.0..1.1.0^2
```

Now each commit of the new Intershop PWA release is applied to the custom project context.
Thus, if any merge conflicts arise, this will be within the specific Intershop PWA commit context and should be mergeable with the information and diff provided for this commit in the GitHub repository.

If merge conflicts need to be resolved, it is advisable to disable any pre-commit hooks during the migration.
For this purpose, set `HUSKY=0` as environment variable.

After successfully going through the range, cherry-pick (with `git commit` and `git cherry-pick --continue` after each resolved merge conflict), an `npm install` will probably be required, and you need to check whether the project code still works as expected.
Starting the server or `npm run check` are good basic tests for that.

### Merge the New Release in its Entirety

This is also a possible way to migrate your custom project to the latest version of the Intershop PWA, but you will have to resolve all potentially appearing conflicts at once and without the specific commit context.

Just add the Intershop PWA GitHub repository as a second remote in your project and `git merge` the release branch.

> [!NOTE]
> This is the least recommended way of integrating Intershop PWA changes into a customized project.

## After Importing the Changes

Once all release commits have been imported, finalize the migration with the following steps.

### Install dependencies

Whenever the import modified `package.json` or `package-lock.json`, regenerate the installed modules.

```
npm install
```

> [!TIP]
> In case of problems with `npm install` during or at the end of a migration, replace the `package-lock.json` of your project with the original one from the Intershop PWA (the one fitting to the last migration commit), delete the `node_modules` folder and run `npm install` again.
> This is the most reliable way to get a working set of dependencies again including the changes fitting to your project-specific dependencies.

### Run the provided migration schematics

Some Intershop PWA releases ship automated migrations that adapt project-specific files which cannot be updated through the Git merge alone (for example, theme override files).
Run the migration script by providing the Intershop PWA version you migrate `from` and the version you migrate `to`.
All migrations registered for that version range are then executed automatically:

```
ng update intershop-schematics --migrate-only --from=<from-version> --to=<to-version>
```

For example, when migrating from `11.0.0` to `12.0.0`:

```
ng update intershop-schematics --migrate-only --from=11.0.0 --to=12.0.0
```

> [!NOTE]
> `ng update` requires a clean working tree.
> Commit the imported changes first, or append `--allow-dirty` to run the migration alongside uncommitted changes.

### Verify the project

Run the combined check to format the code, auto-fix lint issues, compile, build, and execute the tests.

```
npm run check
```

Resolve any remaining lint violations and test failures.
Failing component snapshots can usually be updated (see [Testing](#testing)).

## Further References

- [How to do projects with Intershop PWA 1.0 and Themes](https://www.youtube.com/watch?v=qz-ONgd9qdY)
- [Migration Notes](./migrations.md)
