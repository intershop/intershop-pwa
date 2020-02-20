<!--
kb_sync_by_release
kb_pwa
kb_concepts
kb_everyone
-->

# Project Structure

## File Name Conventions

In accordance with the [Angular Style Guide](https://angular.io/guide/styleguide) and the [Angular CLI](https://angular.io/guide/file-structure) convention of naming generated elements in the file system, all file and folder names should use a hyphenated, lowercase structure (kebab-case). camelCase should not be used, especially since it can lead to problems when working with different operating systems, where some systems are case indifferent regarding file and folder naming (Windows).

## General Folder Structure

We decided on a folder layout to fit our project-specific needs. Basic concerns included defining a set of basic rules where components and other artifacts should be located to ease development, customization and bundling to achieve fast loading. Here we deviate from the general guidelines of Angular CLI, but we provide custom CLI schematics to easily add all artifacts to the project.

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
- `pages` contains  a flat folder list of page modules and components that are only used on that corresponding page.
- `shared` contains code which is shared across multiple modules and pages.
- `extensions` contains extension modules for mainly B2B features that have minimal touch points with the B2C store. Each module (foo and bar) contains code which concerns only itself. The connection to the B2C store is implemented via lazy-loaded modules and components.

The `src/assets` folder contains files which are statically served (pictures, mock-data, fonts, localization, ...).

The `src/environments` folder contains environment properties which are switched by Angular CLI, also see [Angular 2: Application Settings using the CLI Environment Option](http://tattoocoder.com/angular-cli-using-the-environment-option/).

The `src/theme` contains styling files.

>> Components should only reside in `shared`, `shell` and `pages`.

## Extension Folder Structure

We decided to group additional features, that are not universally used, into extensions to keep the main sources structured.

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

As [Angular Modules](https://angular.io/guide/ngmodules) are a rather advanced topic, beginning with the restructured project folder format, we want to give certain guidelines for which modules exist and where components are declared. The Angular modules are mainly used to feed the Angular dependency injection and with that component factories that populate the templates. It has little to do with the bundling of lazy-loaded modules when a production-ready Ahead-of-Time build is executed.

As a general rule of thumb, modules should mainly aggregate deeper lying artifacts. Only some exceptions are allowed.

### Extending Modules

As a developer who **extends and customizes** the functionality of the PWA, you should only consider modifying/adding to the following modules:

- `src/app/pages/app.routing.module` - for registering new globally available routes
- `src/app/core/core.module` and `configuration.module` - for registering core functionality (if the third party library documentation asks to add a `SomeModule.forRoot()`, this is the place)
- `src/app/shell/shell.module` - for declaring and exporting components that should be available on the application shell and also on the remaining parts of the application, do not overuse
- `src/app/shared/shared.module` - for declaring and exporting components that are used on more than one page, but not in the application shell
- `src/app/pages/<name>/<name>-page.module` - for declaring components that are used only on this page

As a developer who develops **new functionalities** for the PWA, you also have to deal with the following modules:

- `src/app/core/X.module` - configuration for the main application organized in various modules
- `src/app/utils/<util>.module` - utility modules like a CMS which supplies shared components and uses shared.module
- `src/app/shared/<name>/<name>.module` - utility modules which aggregate functionality exported with shared.module
- `src/app/core/store/**/<name>-store.module` - ngrx specific modules which should only be extended when adding B2C functionality. Current stores should not be extended, it is better to add additional store modules for custom functionalities.

As a developer who adds **new stand-alone features**:

- `src/app/extensions/<name>/<name>.module` - aggregated collection of components used for this extension, including the ngrx store
- `src/app/extensions/<name>/exports/<name>-exports.module` - aggregation of lazy components which lazily load the extension module

When using `ng generate` with our PWA custom schematics, the components should automatically be declared in the correct modules.

## Rules for Component Development

### Declare Components in the Right NgModule

Angular requires you to declare a component in one and only one NgModule. Find the right one in the following order:

*Your Component is used only on one page?* - Add it to the declarations of the corresponding page.module.

*Your Component is used among multiple pages?* - Declare it in the shared.module and also export it there.

*Your Component is used in the application shell (and maybe again on certain pages)?* - Declare it in the shell.module and also export it there.

*(advanced) Your component relates to a specific B2B extension?* - Declare it in that extension module and add it as an entryComponent, add a lazy-loaded component and add that to the extension exports, which are then im-/exported in the shared.module.

When using `ng generate`, the right module should be found automatically.

### Do not use NgRx or Services in Components

Using NgRx or Services directly in components violates our model of abstraction. Only facades should be used in components, as they provide the simplest access to the business logic.

### Delegate Complex Component Logic to Services

There should not be any string or URL manipulation, routing mapping or REST endpoint string handling within components. This is supposed to be handled by methods of services. See also [Angular Style Guide](https://angular.io/guide/styleguide#style-05-15).

### Put as Little Logic Into `constructor` as Possible - Use `ngOnInit`

See [The essential difference between Constructor and ngOnInit in Angular](https://blog.angularindepth.com/the-essential-difference-between-constructor-and-ngoninit-in-angular-c9930c209a42) and [Angular constructor versus ngOnInit](https://ultimatecourses.com/blog/angular-constructor-ngoninit-lifecycle-hook).

### Use Property Binding to Bind Dynamic Values to Attributes or Properties

See [Explanation of the difference between an HTML attribute and a DOM property](https://angular.io/guide/template-syntax#html-attribute-vs-dom-property).

There are often two ways to bind values dynamically to attributes or properties: interpolation or property binding.
In the PWA we prefer using property binding since this covers more cases in the same way. So the code will be more consistent.

There is an exception for direct string value bindings where we use for example `routerLink="/logout"` instead of `[routerLink]="'/logout'"`.

![Warning](icons/warning.png) **Pattern to avoid**

````html
<div attr.data-testing-id="category-{{category.id}}">  
  
<img src="{{base_url + category.images[0].effectiveUrl}}">
````

![Tip](icons/tip.png) **Correct pattern**

````html
<div [attr.data-testing-id]="'category-' + category.id">  
  
<img [src]="base_url + category.images[0].effectiveUrl">
````

### Pattern for Conditions (ngif) with Alternative Template (else) in Component Templates

Also for consistency reasons, we want to establish the following pattern for conditions in component templates:

![Tip](icons/tip.png) **Condition in template**

```typescript
<ng-container *ngIf="show; else elseBlock">
 ... (template code for if-branch)
</ng-container>

<ng-template #elseBlock>
  ... (template code for else-branch)
</ng-template>
```

This pattern provides the needed flexibility if used together with handling observables with `*ngIf` and the `async` pipe.
In this case the condition should look like this:

```typescript
<ng-container *ngIf="(observable$ | async) as synchronized; else loading">
```

### Do Not Unsubscribe, Use Destroy Observable and takeUntil Instead

Following the ideas of the article [RxJS: Don’t Unsubscribe](https://medium.com/@benlesh/rxjs-dont-unsubscribe-6753ed4fda87), the following pattern is used for ending subscriptions to observables that are not handled via async pipe in the templates.

![Tip](icons/tip.png) **'unsubscribe' via destroy$ Subject**

```typescript
export class AnyComponent implements OnInit, OnDestroy {
  ...
  private destroy$ = new Subject();
  ...
  ngOnInit() {
    ...
    observable$.pipe(takeUntil(this.destroy$))
      .subscribe(/* ... */);
  }
  ...
  ngOnDestroy() {
    this.destroy$.next();
  }
}
```

### Use `OnPush` Change Detection if Possible

To reduce the number of ChangeDetection computation cycles, all components should have their `Component` decorator property `changeDetection` set to `ChangeDetectionStrategy.OnPush`.

### Split Components When Necessary

Consider splitting one into multiple components when:

- **Size**: Component code becomes too complex to be easily understandable

- **Separation of concerns**: A component serves different concerns that should be separated

- **Reusability**: A component should be reused in different contexts. This can introduce a shared component which could be placed in a shared module.

- **Async data**: Component relies on async data from the store which makes the component code unnecessarily complex. Use a container component then which resolves the observables at the outside of the child component and passes data in via property bindings. Do not do this for simple cases.

Single-use dumb components are always okay if it improves readability.
