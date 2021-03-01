<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Project Structure

## File Name Conventions

In accordance with the [Angular Style Guide](https://angular.io/guide/styleguide) and the [Angular CLI](https://angular.io/guide/file-structure) convention of naming generated elements in the file system, all file and folder names should use a hyphenated, lowercase structure (kebab-case). camelCase should not be used, especially since it can lead to problems when working with different operating systems, where some systems are case indifferent regarding file and folder naming (Windows).

## General Folder Structure

We decided on a folder layout to fit our project-specific needs.
Basic concerns included defining a set of basic rules where components and other artifacts should be located to ease development, customization and bundling to achieve fast loading.
Here we deviate from the general guidelines of Angular CLI, but we provide custom CLI schematics to easily add all artifacts to the project.

Additionally, the custom tslint rules `project-structure` and `ban-specific-imports` should be activated to have a feedback when adding files to the project.

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
    <!-- TODO: see Data Handling with Mappers. -->
  - `core/utils` contains all utility functions that are used in multiple cases.
  - `core/store` contains the main [State Management](./state-management.md), `core/facades` contains facades for accessing the state in the application.
- `shell` contains the synchronously loaded application shell (header and footer).
- `pages` contains a flat folder list of page modules and components that are only used on that corresponding page.
- `shared` contains code which is shared across multiple modules and pages.
- `extensions` contains extension modules for mainly B2B features that have minimal touch points with the B2C store. Each module (foo and bar) contains code which concerns only itself. The connection to the B2C store is implemented via lazy-loaded modules and components.

The `src/assets` folder contains files which are statically served (pictures, mock-data, fonts, localization, ...).

The `src/environments` folder contains environment properties which are switched by Angular CLI, also see [Configuring application environments](https://angular.io/guide/build#configure-environment-specific-defaults).

The `src/theme` contains styling files.

> Components should only reside in `shared`, `shell` and `pages`.

## Extension Folder Structure

We decided to group additional features that are not universally used into extensions to keep the main sources structured.

Each extension module can have multiple sub folders:

- `exports`: components which lazily load additional components
- `pages`: page modules and components used on this page
- `shared`: components shared among pages for this extension
- `models`: models specific for this extension
- `services`: services specific for this extension
- `store`: ngrx handling (State, Effects, Reducer, Actions, Selectors)
- `facades`: providing access to the state management

Optionally additional sub folders for module-scoped artifacts are allowed:

- interceptors
- directives
- guards
- validators
- configurations
- pipes

## Modules

As [Angular Modules](https://angular.io/guide/ngmodules) are a rather advanced topic, beginning with the restructured project folder format, we want to give certain guidelines for which modules exist and where components are declared.
The Angular modules are mainly used to feed the Angular dependency injection and with that component factories that populate the templates.
It has little to do with the bundling of lazy-loaded modules when a production-ready ahead-of-time build is executed.

As a general rule of thumb, modules should mainly aggregate deeper lying artifacts.
Only some exceptions are allowed.

### Extending Modules

As a developer who **extends and customizes** the functionality of the PWA, you should only consider modifying/adding to the following modules:

- `src/app/pages/app.routing.module` - for registering new globally available routes
- `src/app/core/core.module` and `configuration.module` - for registering core functionality (if the third party library documentation asks to add a `SomeModule.forRoot()`, this is the place)
- `src/app/shell/shell.module` - for declaring and exporting components that should be available on the application shell and also on the remaining parts of the application, do not overuse
- `src/app/shared/shared.module` - for declaring and exporting components that are used on more than one page, but not in the application shell
- `src/app/pages/<name>/<name>-page.module` - for declaring components that are used only on this page

As a developer who develops **new functionalities** for the PWA, you also have to deal with the following modules:

- `src/app/core/X.module` - configuration for the main application organized in various modules
- `src/app/shared/<name>/<name>.module` - utility modules which aggregate functionality exported with _shared.module_
- `src/app/core/store/**/<name>-store.module` - ngrx specific modules which should only be extended when adding B2C functionality. Current stores should not be extended, it is better to add additional store modules for custom functionalities.

As a developer who adds **new stand-alone features**:

- `src/app/extensions/<name>/<name>.module` - aggregated collection of components used for this extension, including the ngrx store
- `src/app/extensions/<name>/exports/<name>-exports.module` - aggregation of lazy components which lazily load the extension module

When using `ng generate` with our PWA custom schematics, the components should automatically be declared in the correct modules.
