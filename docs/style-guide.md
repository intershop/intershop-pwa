# Style Guide

The general code style of the Intershop Progressive Web App follows the [Angular Style Guide](https://angular.io/guide/styleguide) and coding styles of [Angular CLI](https://cli.angular.io/).  
If there are differences or exceptions, it will be pointed out in this section in additional guidelines. Intershop-specific additions will be listed here as well.

## File Structure Conventions

### General Rules

* In accordance with the [Angular Style Guide](https://angular.io/guide/styleguide) and the [Angular CLI](https://github.com/angular/angular-cli) convention of naming generated elements in the file system, all file and folder names should use a hyphenated, lowercase structure (dash-case or kebab-case). Camel-case should not be used, especially since it can lead to problems when working with different operating systems, where some systems are case indifferent regarding file and folder naming (Windows).

![Warning](icons/warning.png) **Wrong Naming**

````txt
breadCrumb/breadCrumb.component.ts
cacheCustom.service.ts
registrationPage/registrationPage.module.ts
````

![Tip](icons/tip.png) **Correct Naming**

````txt
bread-crumb/bread-crumb.component.ts
cache-custom.service.ts
installations/installations.component.ts
````

* Components or services must never use the same names.

### General Folder Structure

Beginning with Version 0.8 we restructured the folder layout to fit our project-specific needs. Basic concerns included defining a set of basic rules where components and other artifacts should be located to ease development, customization and bundling to achieve fast loading. Here we deviate from the general guidelines of Angular CLI, but we provide custom CLI schematics to easily add all artifacts to the project.

Additionally, the custom tslint rules `project-structure` and `ban-specific-imports` should be activated to have a feedback when adding files to the project.

The basic structure looks like this:

**App folder structure**

````txt
+--app
|  +--core
|     +--models
|     +--store
|     +--utils
|     +--...
|  +--extensions
|     +--foo
|     +--bar
|  +--pages
|  +--shared
|  +--shell
+--assets
+--environments
+--theme]]>
````

* The `src/app` folder contains all TypeScript code (sources and tests) and HTML templates:
  * `core` contains all configuration and utility code for the main B2C application.
  * `shell` contains the synchronously loaded application shell (header and footer).
  * `pages` contains  a flat folder list of page modules and components that are only used on that corresponding page.
  * `shared` contains code which is shared across multiple modules and pages.
  * `core/models` contains models for all data entities for the B2C store, see [Data Handling with Mappers](software-architecture.md). [TODO:link into chapter]
  * `core/utils` contains all utility functions that are used in multiple cases.
  * `extensions` contains extension modules for mainly B2B features that have minimal touch points with the B2C store. Each module (_foo_ and _bar_) contains code which concerns only itself. The connection to the B2C store is implemented via lazy-loaded modules and components.
* The _src/assets_ folder contains files which are statically served (pictures, mock-data, fonts, localization, ...).
* The _src/environments_ folder contains environment properties which are switched by Angular CLI, also see [Angular 2: Application Settings using the CLI Environment Option](http://tattoocoder.com/angular-cli-using-the-environment-option/).
* The _src/theme_ contains styling files.
* Components should only reside in `shared`, `shell` and `pages` following the

### Extension Folder Structure

Each extension module can have multiple subfolders:

| Folder | Content | Notes |
| ------ | ------- | ----- |
| pages | page modules and components used on this page | |
| shared | components shared among pages for this extension | |
| models | models specific for this extension | |
| services | services specific for this extension | |
| store | ngrx handling | State, Effects, Reducer, Actions, Selectors |

Optionally additional subfolders for module-scoped artifacts are allowed:

* interceptors
* directives
* guards
* validators
* configurations
* pipes

##Modules

As [Angular Modules](https://angular.io/guide/ngmodules) are a rather advanced topic, beginning with the restructured project folder format, we want to give certain guidelines for which modules exist and where components are declared. The Angular Modules are mainly used to feed the Angular Dependency Injection and with that Component Factories that populate the Templates. It has little to do with the Bundling of lazy-loaded modules when a production-ready Ahead-of-Time build is executed.

As a general rule of thumb, modules should mainly aggregate deeper lying artifacts. Only some exceptions are allowed.

### Extending Modules

As a **developer extending and customizing the functionalities** of the PWA, you should only consider modifying/adding to the following Modules:

* src/app/pages/app.routing.module - for registering new globally available routes
* src/app/core/core.module - for registering core functionality (if the third party library documentation asks to add a `SomeModule.forRoot()`, this is the place)
* src/app/shell/shell.module - for declaring and exporting components that should be available on the Application Shell and also on the remaining parts of the application, do not overuse
* src/app/shared/shared.module - for declaring and exporting components that are used on more than one page, but not in the application shell
* src/app/pages/\<name\>/\<name\>-page.module - for declaring cponents that are used only on this page

As a **developer developing new functionalities** for the PWA, you also have to deal with the following modules:

* src/app/core/X.module - configuration for the main application organized in various modules
* src/app/utils/\<util\>.module - utility modules like CMS which is supplying shared components and uses shared.module
* src/app/shared/\<name\>/\<name\>.module - utility modules aggregating functionality exported with shared.module
* src/app/core/store/\*\*/\<name\>-store.module - ngrx specific modules which should only be extended when adding B2C functionality, current stores should not be extended, it is better to add additional store modules for custom functionalities.

As a **developer adding new extensions**:

* src/app/extensions/\<name\>/\<name\>.module - aggregated collection of components used for this extension, including the ngrx store
* src/app/extensions/\<name\>/exports/\<name\>-exports.module - aggregation of lazy components which lazily load the extension module

When using `ng generate` with our PWA custom schematics, the components should automatically be declared in the right modules.

## Components

### Follow the Container-Presentation-Pattern

Wherever components are added to the project they should have the following pattern:

````txt
src/app/shared/
        +--product/
           +--components/
              +--product-add-to-basket/
                 +--product-add-to-basket.component.ts
                 +--product-add-to-basket.component.html
           +--containers/
              +--product-add-to-basket/
                 +--product-add-to-basket.container.ts
                 +--product-add-to-basket.container.html
````

The specific path should contain a general folder (in this case 'product'), which can be named feature or data driven (depending on the scope of that component). After that, follow the pattern of folders for containers (smart components) and components (presentation components). The container handles how the data is coming to that pair of components and the presentation component is only concerned with the display. Specifically the smart component communicates with the ngrx store and does not have any presentation functionality in its template (styling classes, ...). The presentation component gets the data as input and further only displays this data.

### Declare Components in the right NgModule

Angular requires you to declare a Component in one and only one NgModule. Find the right one in the following order:

_Your Component is used only on one page?_ - Add it to the declarations of the corresponding page.module.

_Your Component is used among multiple pages?_ - Declare it in the shared.module and also export it there.

_Your Component is used in the Application Shell (and maybe again on certain pages)?_ - Declare it in the shell.module and also export it there.

(advanced) _Your Component relates to a specific B2B extension?_ - Declare it in that extension module and add it as an `entryComponent`, add a lazy-loaded component and add that to the extension exports, which are then im-/exported in the shared.module.

Again, when using `ng generate`, the right module should be found automatically.

### Delegate Complex Component Logic to Services

_Style 05-15: Do limit logic in a component to only that required for the view. All other logic should be delegated to services.  
Do move reusable logic to services and keep components simple and focused on their intended purpose._

There should not be any string or URL manipulation, routing mapping or REST endpoint string handling within components. This is supposed to be handled by methods of services

### Provide Components Data via Input and Output - Similar to ISML Modules

The average component is supposed to receive its data via defined inputs and according service calls. The components are considered relatively "dumb" and mainly concerned with the view creation. They should not somehow get the data from somewhere themselves, e.g., ask the router for relevant information.

### Put as Little Logic Into `constructor` as Possible - Use ngOnInit

_Yet the common practice is put as little logic into constructor as possible. ..._ _It’s a common practice to use ngOnInit to perform initialization logic even if this logic doesn’t depend on DI, DOM or input bindings._

Basically the `constructor` function should only be used for the dependency injection. Everything else is handled in the `ngOnInit`.

For a more detailed explanation see [The essential difference between Constructor and ngOnInit in Angular](https://blog.angularindepth.com/the-essential-difference-between-constructor-and-ngoninit-in-angular-c9930c209a42). For a shorter explanation for the difference between the two, refer to [Angular constructor versus ngOnInit](https://toddmotto.com/angular-constructor-ngoninit-lifecycle-hook).

### Use Property Binding to Bind Dynamic Values to Attributes or Properties

See [Explanation of the difference between an HTML attribute and a DOM property](https://angular.io/guide/template-syntax#html-attribute-vs-dom-property).  
  
There are often two ways to bind values dynamically to attributes or properties: interpolation or property binding.  
Intershop uses data binding since this covers more cases in the same way. So the code will be more consistent.

There is an exception for direct string value bindings where we use for example `routerLink="/logout"` instead of   `[routerLink]="'/logout'".`

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

Also for reasons of consistency we want to establish the following pattern for conditions in component templates:

![Tip](icons/tip.png) **Condition in template**

````typescript
<ng-container *ngIf="show; else elseBlock">
 ... (template code for if-branch)
</ng-container>
  
<ng-template #elseBlock>  
 ...(template code for else-branch)
</ng-template>
````

This pattern provides the needed flexibility if used together with [Handling Observables with NgIf and the Async Pipe](https://toddmotto.com/angular-ngif-async-pipe).  
In this case the condition should look like this:

````typescript
<ng-container *ngIf="(user$ | async) as user; else loading">
````

Please do not use other working patterns like

![Warning](icons/warning.png) **pattern that should be avoided**

````typescript
<ng-template [ngIf]="isLoggedIn" [ngIfElse]="notLoggedIn">  
  ...  
</ng-template>  
<ng-template #notLoggedIn>  
  ...  
</ng-template>
````

### Do Not Unsubscribe, Use Destroy Observable and takeUntil Instead

Following the ideas of this article: [RxJS: Don’t Unsubscribe](https://medium.com/@benlesh/rxjs-dont-unsubscribe-6753ed4fda87), the following pattern is used for ending subscriptions to Observables that are not handled via `async` pipe in the templates.

![Tip](icons/tip.png) **'unsubscribe' via destroy obsevable**

````typescript
export class RegistrationFormComponent implements OnInit, OnDestroy {
  ...
  destroy$ = new Subject();
  ...
  ngOnInit() {
    ...
    // build and register new address form when country code changed
    this.form
      .get('countryCodeSwitch')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(countryCodeSwitch => this.handleCountryChange(countryCodeSwitch));
  }
  ...
  ngOnDestroy() {
    this.destroy$.next();
  }
}
````

Please do not use the classic way of unsubscribing in the `ngOnDestroy` lifecycle hook.

![Warning](icons/warning.png) **Unsubscribe pattern that should be avoided**

````typescript
export class RegistrationFormComponent implements OnInit, OnDestroy {
  ...
  formCountrySwitchSubscription: Subscription;
  ...
  ngOnInit() {
    ...
    // build and register new address form when country code changed
    this.formCountrySwitchSubscription = this.form
      .get('countryCodeSwitch')
      .valueChanges.subscribe(countryCodeSwitch => this.handleCountryChange(countryCodeSwitch));
  }
  ...
  ngOnDestroy() {
    this.formCountrySwitchSubscription.unsubscribe();
  }
}
````
