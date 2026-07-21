<!--
kb_concept
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Versioning Policy

- [Introduction](#introduction)
- [Versioning Scheme](#versioning-scheme)
- [Breaking Changes](#breaking-changes)

## Introduction

The PWA versioning system follows semantic versioning principles to communicate the nature and scope of each release in a consistent and predictable way.

Due to the full availability of the [PWA source code in GitHub](https://github.com/intershop/intershop-pwa), PATCH releases are usually not created, since new bug fixes can easily be consumed by any project via `git cherry-pick` from the `develop` branch or the pull request branch. 
Publishing such changes within a PATCH release is not necessary, since projects need to integrate the changes as a merged commit either way.
There is no “just incrementing a dependency version” concept due to the Intershop PWA not being a library, but rather a blueprint to start a custom storefront project.

The Intershop PWA is not maintained in multiple versions with subsequent new MINOR or PATCH releases to parallel versions. 
Rather, it follows a linear path of released versions that uses a MAJOR or MINOR release to signal the scope of contained changes.

> [!TIP]
> GitHub provides very convenient means of creating patches for commits or pull requests, making it even easier than `git cherry-pick` to get a desired bug fix or changed functionality into a project.
>
> To automatically generate a patch file, just append `.patch` to the GitHub commit or pull request URL.
>
> Commit: `https://github.com/intershop/intershop-pwa/commit/e3b092fa2c7122f0a68f6ea0ba0bddb3dd162308.patch`
>
> Pull Request: `https://github.com/intershop/intershop-pwa/pull/2002.patch`

## Versioning Scheme

The Intershop PWA follows the versioning format **MAJOR.MINOR.PATCH**.

| **Version** | **Meaning**                                                                             | **Allowed Changes**               | **Includes**                                                          |
| ----------- | --------------------------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------- |
| **MAJOR**   | Release **can contain breaking changes** or be **strategically important** (marketing). | Breaking and non-breaking changes | Functionality, improvements, bug fixes, major code convention changes |
| **MINOR**   | Release must be **backward compatible**                                                 | Only non-breaking changes         | Functionality, improvements, bug fixes                                |
| **PATCH**   | **Not used** in current release process; always `0`                                     |                                   |                                                                       |

The version number primarily signals upgrade impact, not the functional type of change. 
It reflects upgrade effort and scope.

## Breaking Changes

A breaking change is defined as _“a change in one part of a software system that potentially causes other components to fail“_ ([Wiktionary](https://en.wiktionary.org/wiki/breaking_change#English)).

Projects upgrade by incorporating code changes from higher PWA versions into their source code. 
They do not simply “consume” a newer PWA version by updating a version number.

Each project has its own customizations, ranging from minimal to extensive. 
A project that uses the PWA without code-level customizations (for example, only updating CSS styles) can upgrade to any version, including major versions, without much adaptation effort. 
In such cases, there are no breaking changes because nothing conflicts during migration.

The definition of a breaking change refers primarily to whether changes in the standard PWA code require project teams to manually adapt their customizations when upgrading (e.g., custom code no longer compiles or behaves correctly without adaptation).

The **breaking changes** listed below represent typical customization points where project-specific modifications are most likely to conflict with changes made in the standard PWA:

- Angular upgrade to a major version (systematic code changes across the codebase)
- Breaking changes in dependencies (e.g., Bootstrap)
- Removal of support for specific older REST API endpoints (e.g., the PWA uses a new version of an ICM REST API endpoint **and** removes the existing fallback to the older endpoint version).
- Feature removal or major feature rework
- Public signatures that require code adaptations
- Changes in the routing structure (route paths; e.g., SEO-critical: deep links, sitemaps, query parameter conventions)
- Required configuration, environment, or deployment changes (configuration keys, environment variable names, feature toggle identifiers)
