<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Project Structure

- [File Name Conventions](#file-name-conventions)
- [General Folder Structure](#general-folder-structure)
- [Extension Folder Structure](#extension-folder-structure)
  - [Integrating Extensions](#integrating-extensions)
- [Modules](#modules)
  - [Extending Modules](#extending-modules)

## File Name Conventions

In accordance with the [Angular Style Guide](https://angular.dev/style-guide) and the [Angular CLI](https://angular.dev/reference/configs/file-structure) convention for naming generated elements in the file system, use a hyphenated, lowercase structure (kebab-case) for all file and folder names.
Do not use camelCase, especially since it can lead to problems when working with different operating systems.
Some systems, such as Windows, are case-insensitive regarding file and folder naming.

## General Folder Structure

This folder layout fits the specific needs of this project.
Key considerations included defining a set of rules for where to place components and other artifacts to ease development, customization, and bundling to achieve fast loading.
This structure deviates from the general guidelines of Angular CLI.
However, custom CLI schematics let you easily add all artifacts to the project.

Additionally, activate the custom ESLint rules `project-structure` and `ban-imports-file-pattern` to receive feedback when adding files to the project.

The basic structure looks like this:

```txt
src
├─ app
|  ├─ core
|  |  ├─ models
|  |  ├─ store
|  |  ├─ facades
|  |  ├─ utils
|  |  └─ ...
|  ├─ extensions
|  |  ├─ foo
|  |  └─ bar
|  ├─ pages
|  ├─ shared
|  └─ shell
├─ assets
├─ environments
└─ theme
```

The `src/app` folder contains all TypeScript code (sources and tests) and HTML templates:

- `core` contains all configuration and utility code for the main B2C application.
  - `core/models` contains models for all data entities for the B2C store.
  - `core/utils` contains all utility functions that are used in multiple cases.
  - `core/store` contains the main [State Management](./state-management.md); `core/facades` contains facades for accessing the state in the application.
- `shell` contains the synchronously loaded application shell (header and footer).
- `pages` contains a flat list of folders for page modules and components that are used only on the corresponding page.
- `shared` contains code that is shared across multiple modules and pages.
- `extensions` contains extension modules mainly for B2B features that have minimal touch points with the B2C store. Each module (foo and bar) contains code that concerns only itself. The connection to the B2C store is implemented via lazy-loaded modules and components.

The `src/assets` folder contains files that are statically served (pictures, mock data, fonts, localization, etc.).

The `src/environments` folder contains environment properties that are switched by Angular CLI, see [Configuring application environments](https://angular.dev/tools/cli/environments#configure-environment-specific-defaults).

The `src/theme` folder contains styling files.

> Place components only in `shared`, `shell`, and `pages`.

## Extension Folder Structure

Additional features that are not universally used are grouped into extensions to keep the main sources structured.

Each extension module can have multiple subfolders:

- `exports`: components that lazily load additional components
- `pages`: page modules and components used on this page
- `shared`: components shared among pages for this extension
- `models`: models specific for this extension
- `services`: services specific for this extension
- `utils`: utility services and functions specific for this extension
- `store`: ngrx handling (State, Effects, Reducer, Actions, Selectors)
- `facades`: providing access to the state management

Optionally, additional subfolders for module-scoped artifacts are allowed:

- interceptors
- directives
- guards
- validators
- configurations
- pipes

### Integrating Extensions

All code of an extension resides in its folder, including small UI parts, such as a header link, and their styles.
Code outside the extension (`shell`, `pages`, `shared`) uses exclusively what the extension provides in `exports`:

1. Create the component in the extension's `shared` folder and declare it in the extension module `src/app/extensions/<name>/<name>.module.ts`.
2. Generate the lazy component with `ng g lazy-component extensions/<name>/shared/<component>/<component>.component.ts`.
   The schematic adds `@GenerateLazyComponent()` to the component and registers `ish-lazy-<component>` in the exports module.
3. Import the exports module in the module that declares the component that uses it, e.g., `shell.module` for the header, and use `ish-lazy-<component>` in its template.

Lazy components render only when the extension's feature toggle is enabled.
Therefore, the template that uses them needs no `*ishFeature` check for them.
Generated lazy components are git-ignored and recreated on `npm install`.
For example, see the `QuickorderLinkComponent` and its use as `ish-lazy-quickorder-link` in the header.

## Modules

Because [Angular Modules](https://v20.angular.dev/guide/ngmodules/overview) are a rather advanced topic, this section explains, based on the restructured project folder format, which modules exist and where components are declared.
The Angular modules are mainly used to feed the Angular dependency injection and with that component factories that populate the templates.
It has little to do with the bundling of lazy-loaded modules when a production-ready, ahead-of-time build is executed.

As a general rule of thumb, modules mainly aggregate deeper-lying artifacts.
Only a few exceptions are allowed.

### Extending Modules

As a developer who **extends and customizes** PWA functionality, consider modifying/adding to only the following modules:

- `src/app/pages/app.routing.module` - for registering new globally available routes
- `src/app/core/core.module` and `configuration.module` - for registering core functionality (if the third-party library documentation asks to add a `SomeModule.forRoot()`, this is the place)
- `src/app/shell/shell.module` - for declaring and exporting components that are available on the application shell and also on the remaining parts of the application; do not overuse this module
- `src/app/shared/shared.module` - for declaring and exporting components that are used on more than one page, but not in the application shell
- `src/app/pages/<name>/<name>-page.module` - for declaring components that are used only on this page

As a developer who develops **new functionality** for the PWA, you also work with the following modules:

- `src/app/core/X.module` - configuration for the main application organized in various modules
- `src/app/shared/<name>/<name>.module` - utility modules that aggregate functionality exported with _shared.module_
- `src/app/core/store/**/<name>-store.module` - ngrx-specific modules that you extend only when adding B2C functionality. Do not extend current stores; instead, add additional store modules for custom functionality.

As a developer who adds **new standalone features**:

- `src/app/extensions/<name>/<name>.module` - aggregated collection of components used for this extension, including the ngrx store
- `src/app/extensions/<name>/exports/<name>-exports.module` - aggregation of lazy components that lazily load the extension module

When you use `ng generate` with the PWA custom schematics, it automatically declares the components in the correct modules.
