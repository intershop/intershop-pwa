<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Updating Dependencies

This guide provides a brief overview of how to update PWA dependencies.

## Customer Projects

In most cases, customer projects should never update dependencies themselves.
Whenever a new PWA version is released, the project should consume it completely, following the recommended [import instructions](./customizations.md#import-changes-from-new-release).
In particular, the [`package-lock.json`](./customizations.md#dependencies) should be reset to Intershop's version and then (if customized) rewritten using `npm install`.

## PWA Development

The following section should only be followed by Intershop PWA developers and projects that want to disconnect from the Intershop PWA update stream.

### Recommendations for the Process of Updating

Always use `ng update` to update packages, as it also collects and executes possible source code transformers that do some part of the automatic code migration.
We would also recommend updating with `ng update -C` which creates (temporary) commits for each individual update.
This makes it easier to track the process during the update.

After each package update, run some form of code check to verify code consistency.
Full checks can be run with `npm run check`.
You can also run specific subparts of it for verification.

Do not update too many packages at once, as it is easy to lose track of the process and have to start over.

Name your GitHub branch for the dependency update `update/...` or `upgrade/...` to run additional 'Updates' checks in the GitHub CI.

### 0. Before the Update

Check if all third-party libraries for the PWA are compatible with the new version.
This is especially important during a major Angular version update.

### 1. Updating Angular Dependencies

When a new major Angular version should be consumed, follow the steps in the [official update guide](https://update.angular.io) for advanced app complexity.

`ng update` gives an overview of available Angular-specific package updates:

```text
$ ng update
...
Found 99 dependencies.
    We analyzed your package.json, there are some packages to update:

      Name                               Version                  Command to update
     --------------------------------------------------------------------------------
      @angular/cli                       9.1.4 -> 9.1.6           ng update @angular/cli
      @angular/core                      9.1.6 -> 9.1.7           ng update @angular/core
      @nguniversal/express-engine        9.1.0 -> 9.1.1           ng update @nguniversal/express-engine
```

### 2. Updating Third-Party Project Dependencies

After updating the Angular-specific dependencies, update project libraries (everything you use on the PWA).

`npm outdated` gives an overview of all updatable packages in `package.json`:

```text
$ npm outdated --long
...
@types/jest                          25.2.1    25.2.3   25.2.3  intershop-pwa  devDependencies  https://github.com/DefinitelyTyped/DefinitelyTyped#readme
@types/node                        12.12.38  12.12.39   14.0.1  intershop-pwa  devDependencies  https://github.com/DefinitelyTyped/DefinitelyTyped#readme
angulartics2                          9.0.0     9.0.1    9.0.1  intershop-pwa  dependencies     https://angulartics.github.io/angulartics2/
bootstrap                             4.4.1     4.5.0    4.5.0  intershop-pwa  dependencies     https://getbootstrap.com/
...
```

Perform updates with `ng update` as well.

> [!IMPORTANT]
>
> `@types/node` should always remain on the LTS version.
> You can update to specific versions with `ng update @types/node@12`.

### 3. Update Project Utilities for Testing, Reporting and Linting

Utility dependencies can usually be updated individually, as they do not directly interfere with the production code.
In most cases, you can also postpone these updates for a longer period of time.

### 4. Cleanup Dependencies

Sometimes build processes and libraries require you to install peer dependencies yourself.
However, this may change after version updates, and these dependencies may become obsolete.
You can use `npm ls <package-name>` to check if a package is used or required.

After removing potential candidates, check `npm install` for peer dependency requirements and also run the responsible process to assure continued functionality.

### 5. Update Utilities for Formatting

In particular, `prettier` update and applying formatting should be done in individual commits (one for the update and a single one only applying the formatting), so customer projects can ignore the second one and run the formatting independently.

### 6. Refactoring and Deprecations

Now would be a good time to apply optional code refactoring and replace deprecated code artifacts in individual commits.

### 7. Restructuring the Update and Documentation

For customer projects, it is most important that the update process is transparent and applicable.
The commits leading up to this point should be partially merged and restructured, so that they can be imported via cherry-picking.

One recommendation would be to combine all manipulations of `package-lock.json` into a single commit if no major refactorings or library replacements were done during the update.
Further commits should focus on descriptive commit messages, so that the updating project can easily track them.
Finally, code reformatting and optional refactorings should be in separate commits.

> [!IMPORTANT]
> Every commit along the way must be consistent.
> `npm run check` must be runnable without errors, so the customer project can use it to assure consistency.

Add documentation with migration instructions to the [migration guide](./migrations.md).

### 8. Rewrite package-lock.json

Once all dependency updates are finished, it might be a good idea to regenerate the `package-lock.json`.
For this, the `node_modules` folder and the `package-lock.json` need to be removed.
Then `npm install` needs to be run to get a new clean `package-lock.json` which can either be amended if the dependency update is a single update commit, or as an additional commit.

---

> [!NOTE]
> A node script `node scripts/update-pwa` is provided to automate the update steps described above.
> It can be used to simplify the update process, but it might need regular adaptions and the results need to be checked.

---

## Security Vulnerabilities

Sometimes `npm install` reports security vulnerabilities:

```text
$ npm install
...
found 11 vulnerabilities (8 low, 3 high)
  run `npm audit fix` to fix them, or `npm audit` for details
```

Do not pay too much attention to this.
By doing a complete install on the project, all dependencies (production and development) are audited, but only production dependencies will end up in the production code.
You should, however, pay attention to the production audit:

```text
$ npm audit --omit=dev

                       === npm audit security report ===

found 0 vulnerabilities
 in 237 scanned packages
```

If a package (in most cases a transitive dependency) poses a security risk, an update to the consuming package is most likely already available.
Go ahead and update the package following the steps above.
The output of `npm audit` will also provide you with useful information about packages.

> [!TIP]
> Avoid running `npm audit fix`
>
> This would update versions of transitive dependencies directly in `package-lock.json` and occasionally the affected utilities will stop working.
> Prefer to update the direct dependencies if possible.
