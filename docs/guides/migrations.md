<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Migrations

## 2.3 to 2.4

The PWA 2.4 contains an Angular update to version 13.3.9 and many other dependencies updates.<br/>
These updates did not require any updates to the PWA source code.
But it needs to be checked if this is true for your projects customizations as well.

We introduced a checkout guard that protects the checkout routes in case no shopping cart is available and navigates back to the empty basket page.

## 2.2 to 2.3

The 'contact us' functionality has been moved into an extension and we have introduced the feature toggle `contactUs` in the `environment.model.ts` that is switched on by default.

The `getFilteredProducts` method has been moved from the `FilterService` to the `ProductsService`, since the `/products` API is used.
Together with this change the default products attributes for product listings are externalized and and are now easily overridable.

With [#1135](https://github.com/intershop/intershop-pwa/pull/1135), the default model representation used by `NgbDatepicker` is now the native ES6 `Date`.
During this refactoring, the `DateHelper` class has been removed. **This will not concern you if you use `ish-date-picker-field` directly**.
However, if you use `NgbDatepicker` outside of formly, some helpers you might have used are gone.
Please use the underlying functions from `Date`, [`NgbCalendar`](https://ng-bootstrap.github.io/#/components/datepicker/api#NgbCalendar) and [`date-fns`](https://date-fns.org) directly or create your own `DateHelper`.

## 2.1 to 2.2

The PWA 2.2 contains an Angular update to version 13.3.0 and many other dependencies updates.<br/>
These updates required some internal webpack handling changes especially for the template overloading.<br/>
Also some test adaptions where necessary, so is it now necessary to mock the `SwiperComponent`.<br/>
Another change is the [Formly](https://formly.dev/) downgrade from v6 pre-release to v5 that still works with Angular 13 with a changed `ngcc` setting.<br/>
After the updates the deprecated RxJS MapTo operators (`mapTo`, `mergeMapTo`, `switchMapTo`) were replaced [Deprecating MapTo variants](https://github.com/ReactiveX/rxjs/issues/6399).
Linting will point out these issues in custom code that can than easily be replaced.

The Intershop PWA now uses Node.js 16 LTS with a corresponding npm version >=8.0.0.
With this new npm, calls using `npx npm-run-all` in CI have to be changed to `npm run exec npm-run-all`.

Changes with Angular 13 require to declare less dependencies in test beds than before.
For that reason the PWA 2.2 contains two pull requests that cleanup a lot of test specs (see #1057 and #1072).
It is not considered a breaking change but it might result in merge conflicts with customized Jest tests.
To cleanup the own code base run `npm run cleanup-testbed`.
Run `npm run cleanup-testbed -- --help` for more detailed options.

The `shared/formly` folder - containing all custom types, wrappers, etc. - was updated.<br/>
For a cleaner separation of code artifacts, there are now multiple subfolders declaring their own modules where formly is partly configured.
The `FormlyModule` brings all these together so you can use it just like before.
If you made any changes in `shared/formly`, you will have to adapt the corresponding modules.<br/>
Additionally, we introduced a `formly/field-library` subfolder that contains a `FieldLibrary` service which enables you to define reusable `FormlyFieldConfig`s and access them easily.
If you have customized anything in `shared/formly-address-forms/configurations/address-form-configuration.ts`, for example the `standardFields` variable, you will have to migrate these changes by defining new `FieldLibraryConfiguration`s.
The address form configurations now use the new `FieldLibrary` functionality under the hood.<br/>
For more information, read the new [Field Library](../guides/field-library.md) documentation.

The compare products functionality was moved into an extension.
The already existing `compare` feature toggle works as before but the compare components integration changed to lazy components, e.g. `<ish-product-add-to-compare displayType="icon"></ish-product-add-to-compare>` to `<ish-lazy-product-add-to-compare displayType="icon"></ish-lazy-product-add-to-compare>`.
For other compare components check the compare-exports.module.ts file.

## 2.0 to 2.1

The recently viewed products functionality was moved into an extension.
The already existing `recently` feature toggle works as before but the recently viewed component integration changed from `<ish-recently-viewed *ishFeature="'recently'"></ish-recently-viewed>` to `<ish-lazy-recently-viewed></ish-lazy-recently-viewed>`.
This was already changed for the product detail page and the basket page but needs to be done for any customized usage of the recently viewed component.

The `clean-localizations` functionality was changed so that `keep-localization-pattern` can be defined where they are used and do no longer need to be added directly to the [`clean-up-localizations` script](../../scripts/clean-up-localizations.js).
It might be useful to move custom patterns according to the changes done for the standard code (for more information see [Localization File Clean Up Process](../concepts/localization.md#localization-file-clean-up-process)).

TestBed configuration arrays are sorted again as of 2.1 This means a lot of (small, auto-fixable) changes across the codebase.
Simply run `ng lint --fix` in order to sort your arrays.
If you have a lot of migration changes, you might be required to run it more than once.

With the introduction of personalized REST calls for categories and products, data in the ngrx store runs the risk of not being up-to-date after a login or logout.
To fix this, a new `resetSubStatesOnActionsMeta` meta-reducer was introduced to remove potentially invalid data from the store.
If the removal of previous data from the store is not wanted this meta reducer should not be used in customized projects.
In addition a mechanism was introduced to trigger such personalized REST calls after loading the PGID if necessary.
This way of loading personalized data might need to be added to any custom implementations that potentially fetch personalized data.
To get an idea of the necessary mechanism search for the usage of `useCombinedObservableOnAction` and `personalizationStatusDetermined` in the source code.

## 1.4 to 2.0

Since [TSLint has been deprecated](https://blog.palantir.com/tslint-in-2019-1a144c2317a9) for a while now and Angular removed the TSLint support we had to migrate our project from TSLint to ESLint as well.
This means in version 2.0 all TSLint rules and configurations were removed and where possible replaced by ESLint.

This not only required configuration changes in the Intershop PWA project but also application code adaptions to comply with some of the new ESLint rules.
To allow for an as easy as possible migration of existing PWA projects, we split the whole switch in separate commits that should make it easier to resolve potential merge conflicts by providing some context, e.g. changes to satisfy a specific rule or project configuration changes etc.
We advise you to first cherry pick all the `eslint` commits provided by the PWA release before applying the lint rules to the project customizations to fix the issues that reside in the project code.
If the found issues are too many to address them in an ordered manner, it is probably best to temporarily disable some of the failing rules in `.eslintrc.json` (see [Configuring ESLint](./eslint.md#configuring-eslint) and to only fix one after another.

It is also probably a good idea to do the PWA 2.0 migration not in one go as described in [Import Changes from New PWA Release](./customizations.md#import-changes-from-new-pwa-release-migration) but to first do the commits before the linter switch and bring your project to a clean state (`npm run check`).
After this all the linter switch commits should be applied and the project should be brought back to a clean state.
Once this is done, subsequent commits should be migrated.
If your project contains own custom TSLint rules you will have to re-implement them as ESLint rules to be able to apply them to your code base (see [Custom ESLint rules](./eslint.md#custom-eslint-rules)).

With version 2.0 we introduce a renaming of the two standard PWA themes and change the default theme:

- The previous B2B theme `blue` is now called `b2b` and is used as default theme from now on.
- The previous B2C theme `default` is now called `b2c`.

With this change the according folders and references had to be renamed/moved and need to be adapted in customer projects as well.
In projects where the recommended procedure for using a custom theme has been followed (see [Customization Guide - Start Customization](./customizations.md#start-customization)), minimal migration effort should be required.

We moved the model `SelectOption` from the select.component.ts to the `select-option.model.ts` and adapted all necessary imports.

In the PWA 0.28 we introduced the usage of [Formly](https://formly.dev/) to generate and maintain our forms.
Now we removed the obsolete form components.
If you want to use the obsolete form components in your project nevertheless, skip the commit `remove obsolete form components`.
For more information concerning Formly please refer to our [Formly - Guide](./formly.md)).

The feature toggle 'advancedVariationHandling' has been removed.
Instead the ICM channel preference 'AdvancedVariationHandling' is used to configure it.
You will find this preference as 'List View' in the ICM backoffice under Channel Preferences -> Product Variations.

The ICM channel preference 'basket.maxItemQuantity' is included to validate the product quantity if no specific setting is defined on the product.
You find this preference as 'Maximum Quantity per Product in Cart' under the Application Settings -> Shopping Cart & Checkout.
The default value is 100.

The Intershop PWA 2.0 release includes the Angular 13 update and updates to a lot of other dependencies (NgRx, RxJS, Formly, Swiper).
These dependencies updates require many necessary code adaptions that are included in additional commits.
The following official guides might help to migrate custom code as well:

- https://update.angular.io/?l=3&v=12.0-13.0
- https://ngrx.io/guide/migration/v13
- https://github.com/ngx-formly/ngx-formly/blob/v6.0.0-next.7/UPGRADE-6.0.md
- https://swiperjs.com/migration-guide

To help with the necessary rxjs refactorings, consider using [rxjs-fixers-morph](https://github.com/timdeschryver/rxjs-fixers-morph).
Simply run `npx rxjs-fixers-morph ./tsconfig.json`.

## 1.1 to 1.2

The `dist` folder now only contains results of the build process (except for `healthcheck.js`).
You must **not** edit any file inside that `dist` folder, since this would include not being able to change Kubernetes liveness or readiness probes we included SSR container related source code under `src/ssr/server-scripts/`

## 0.31 to 1.0

The Angular configuration mechanism of the Intershop PWA was refactored to support running multiple configurations in one docker image (see [Guide - Multiple Themes](./multiple-themes.md)).
This now means that the former `environment.local.ts` which had a standalone configuration can no longer be supported.
Instead theme-specific environments exist for `default` and `blue` and development settings can be overridden in `environment.development.ts`, which are imported into the theme-specific configurations (see [Guide - Development](./development.md#development-server)).
`npm install` will create an initial version of the `environment.development.ts` that can be filled with the needed information from `environment.local.ts`.
The `environment.local.ts` itself becomes obsolete and can be deleted.

Locale definitions in `environment.ts` models are no longer supported, only ICM channel configurations are now used for switching locales.

## 0.29 to 0.30

We introduced the feature toggle 'guestCheckout' in the `environment.model.ts`.

We switched to encode user logins when used in the api service.
This is to enable special characters (like the #) that are sometimes present in user logins (SSO case!) but would've lead to errors before.

## 0.28 to 0.29

We activated TypeScript's [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny).
Please refer to the [Type Safety](./getting-started.md#type-safety) part in the Getting Started Guide for motivations.

## 0.27 to 0.28

We removed the property `production` from Angular CLI `environment.ts` files.
Production mode can now consistently be set by using Angular CLI configurations.
This also works when running multiple configurations like `--configuration=brand,production`.

We removed the property `serviceWorker` from Angular CLI `environment.ts` files.
The Service Worker can now be set consistently depending on the current configuration in the `angular.json` file.

We removed the dependency to `ngx-swiper-wrapper` as it will [no longer be supported](https://github.com/zefoy/ngx-swiper-wrapper#eol-notice) and `swiper` itself now [natively supports](https://swiperjs.com/angular) Angular (see changes #552).

We introduced [formly](https://formly.dev/) to handle all kinds of forms from now on.
We removed `src/app/shared/address-forms` in favor of `src/app/shared/formly-address-forms` and `src/app/shared/forms-dynamic` in favor of a generalized formly integration in `src/app/shared/formly`.
To implement your country-specific address forms in formly, see [Forms](./forms.md#the-address-form-as-an-example-of-a-reusable-form).

We introduced an improved usage of memoized selectors for products selectors, split up state and saved additionally retrieved data in separate places and migrated almost all product related components to use the previously introduced product context facade (see changes #528).

## 0.26 to 0.27

We upgraded Cypress from Version 4 to 6 and followed all migrations in their [Migration Guide](https://docs.cypress.io/guides/references/migration-guide).

We have introduced a [Context Facade](../concepts/state-management.md#context-facades) for product entities and [refactored](https://github.com/intershop/intershop-pwa/pull/403) most of the components that are specific to a single product.
This includes:

- Targeted components no longer require a `product` input, as they retrieve the product from the context.
- The handling for adding products to the basket was refactored and simplified.
- Product quantity handling moved almost completely to the context.
- The decision for displaying certain components on product tiles and rows also moved into the context.

## 0.25 to 0.26

The project configuration was updated to use and test with Node.js version 14.15.0 LTS (including npm 6.14.8) for any further development.

We upgraded the Intershop PWA to use Angular 11.
With that a breaking change was introduced.
The [RouterModule's `relativeLinkResolution` property changed](https://angular.io/api/router/ExtraOptions#relativeLinkResolution) from `legacy` to `corrected`.
We couldn't detect any impact for the PWA itself but custom code might have to be adapted.

We removed the Intershop PWA mock-data, as there are currently public servers provided for testing and exploring.
The handling for mocking REST API calls during development is hereby untouched.
The Angular CLI environment property `mockServerAPI` became obsolete, the property `mustMockPaths` was renamed to `apiMockPaths`.

## 0.24 to 0.25

We replaced the simple [ngx-cookie-banner](https://github.com/exportarts/ngx-cookie-banner) cookie banner with an own implementation that provides the means to configure and set more fine grained cookie consent options.
A basic configuration is already provided.
The cookie consent configuration and usage is documented in our [Cookie Consent Guide](./cookie-consent.md).
With this change it is necessary to adapt all uses of the `cookiesService.cookieLawSeen$` observable with the new synchronous method - `cookiesService.cookieConsentFor('tracking')` - provided to check for the required cookie consent.

We reworked the configuration format for setting up multiple channels in the nginx to enable context-path support.
Multiple `PWA_X_` environment properties are no longer supported, instead a structured configuration has to be supplied.
For more information see [Nginx documentation](./nginx-startup.md).

## 0.23 to 0.24

We introduced a [localization file clean up script](../concepts/localization.md#localization-file-clean-up-process) that removes all unused localization keys from the localization files and sorts the remaining keys.
The clean up result is contained in a separate commit that should probably not be applied during a migration and instead a `npm run clean-localizations` should be performed on the project sources.

We renamed the testing helper `findAllIshElements` from [`ish-core/utils/dev/html-query-utils`](../../src/app/core/utils/dev/html-query-utils.ts) to `findAllCustomElements` to support project customization.
The returned lists from `findAllCustomElements` and `findAllDataTestingIDs` are no longer sorted to represent the actual template structure.

With Angular version 10.1, the testing utility [async](https://angular.io/api/core/testing/async) was [deprecated](https://github.com/angular/angular/commit/8f074296c2ffb20521e2ad1bbbb3dc8f2194cae6).
We refactored out code base to use native async/await instead, which was possible in all cases.
The TSLint rule `use-new-async-in-tests` takes care of automatically transforming TestBed initialization code in component tests.
Other cases have to be refactored manually.

## 0.22 to 0.23

We removed deprecated exports related to the NgRx testing refactorings introduced in version 0.21.

We switched our main development to the new headless REST application type provided by ICM 7.10.21.0.
If you are upgrading and want to continue using the Responsive Starter Store application types, do not cherry-pick the [commits that switch application types](https://github.com/intershop/intershop-pwa/compare/a63d2a2fc1ffdb404e6b1fe8ffb79310fa2ef60f...741454c8c839dd001a3943236172d75ffd05541d).

We refactored the way ICM Http Errors are handled in the PWA.
You can read about it [here](./icm-http-error-mapping.md).
Tests emulating HTTP errors now have to use the helper function `makeHttpError` from [`ish-core/utils/dev/api-service-utils`](../../src/app/core/utils/dev/api-service-utils.ts).

We removed grouping folders of shared components in extensions and sub projects for a better overview.
You can migrate using the script `node schematics/migration/0.22-to-0.23` (for running this script Git version 2.28 or above is recommended since earlier versions resulted in problems).

## 0.20 to 0.21

We deprecated and reworked the way of testing with NgRx.
The old format using `ngrxTesting` with `combineReducers` is now deprecated and replaced by the [new approach](./state-management.md#testing-ngrx-artifacts).
The old testing mechanism will be removed in version 0.23.

We introduced a way to do [shallow testing with feature toggles](../concepts/configuration.md#unit-testing-with-feature-toggles) and used it in the tests.

We [reorganized the core store](../concepts/state-management.md#core-store-structure):

- new `customer`
  - store/addresses => store/**customer**/addresses
  - store/checkout/basket => store/**customer**/basket
  - store/orders => store/**customer**/orders
  - store/restore => store/**customer**/restore
  - store/user => store/**customer**/user
- new `core`
  - store/configuration => store/**core**/configuration
  - store/error => store/**core**/error
  - store/messages => store/**core**/messages
  - store/router => store/**core**/router
  - store/viewconf => store/**core**/viewconf
- new `general`
  - store/contact => store/**general**/contact
  - store/countries => store/**general**/countries
  - store/regions => store/**general**/regions

TSLint rules are set up to automatically fix imports, so run `npm run check` after upgrading.

In this version, we decided to start using the ngrx creator introduced in ngrx v8: [createAction](https://ngrx.io/api/store/createAction), [createReducer](https://ngrx.io/api/store/createReducer) and [createEffect](https://ngrx.io/api/effects/createEffect).
This means that the old way of writing action classes, reducer switch statements and @Effect() decorators is deprecated from 0.21 onwards.

Using these creator functions simplifies code and removes a lot of boiler plate from store files while providing type safety out-of-the-box.

You can automatically migrate your existing code by executing `node schematics/migration/0.20-to-0.21`.
Doing this will set related ts-lint rules and update each store or notify you of work previously needed.

## 0.19.1 to 0.20

We upgraded from Angular 8 to version 9 and activated the new rendering engine Ivy with this (following the [official upgrade guide](https://update.angular.io/#8.0:9.0l3)).
This was a major upgrade and comes with some changes:

- The following changes are available for cherry-picking in one commit:

  - Angular no longer supports the previously deprecated string syntax for lazy loaded modules. Change it to the [dynamic import format](https://angular.io/guide/deprecations#loadchildren-string-syntax).

  - `server.ts` was partially rewritten to support SSR dev-server and serverless deployments. Building SSR is now supported by Angular CLI and explicit `webpack` builds were removed.

  - `core-js` had a major upgrade to version 3, so `polyfill.ts` imports have changed.

  - We temporarily replaced `@ngx-utils/cookies` with `ngx-utils-cookies-port` due to a [bug](https://github.com/ngx-utils/cookies/issues/20) when using Angular 9.1.

  - `angular2-cookie-law` was replaced by `ngx-cookie-banner` for compatibility reasons. This comes with a styling overhaul.

- Further commits contain necessary refactoring:

  - `TestBed.get` in tests was deprecated in favor of the new type-safe `TestBed.inject`.

  - The empty generic type for NgRx `Store` is now the default and does not have to be supplied. The TSLint rule `ngrx-use-empty-store-type` was adapted to apply this refactoring.

  - We removed lazy loading with `@wishtack/reactive-component-loader` and replaced it with the native Angular 9 approach. If you have customized or created extensions, you will have to adapt the following:

    - Extension export modules are no longer imported and exported in `SharedModule`, instead export them in `ShellModule`.

    - Instead of pointing to the extension module with `ReactiveComponentLoaderModule` in the extension exports module, use the new provider for `LAZY_FEATURE_MODULE` pointing to the _extension store module_, if available. All further lazy loading is done by lazy components and lazy loaded pages. With this, the extension module should no longer import the extension store module.

    - Lazy components should no longer be part of the repository as they can be auto-generated on `npm install`. Use the new decorator `@GenerateLazyComponent()` via the `lazy-component` schematic to generate lazy components. We currently do not support creating lazy components for components with `@Output()` decorated fields.

    - Previous workarounds in `<extension>-store.ts` and `<extension>-store.module.ts` for adding reducers of selecting the feature state are no longer necessary and can be refactored to standard approaches.

  - We performed a major upgrade to `prettier` which comes with new code formatting for parts of the code.

  - We replaced VSCode extension `stylelint-plus` with the official extension. Update the recommended extensions.

  - We overhauled the integration of utility libraries for our custom schematics and TSLint rules. These libraries now get built when `npm install`ing the PWA and transpiled JavaScript sources are no longer part of version control. Also, they mainly reuse libraries from the project root now.

## 0.18 to 0.19

We migrated from using [ngrx-router](https://github.com/amcdnl/ngrx-router) to the official and better supported [@ngrx/router-store](https://ngrx.io/guide/router-store).
This means that throughout the code all usage of the `ofRoute` operator and `RouteNavigation` actions are no longer available.

As some of these implementations were very specific, we cannot provide a migration script.

## 0.16 to 0.17

In this version change, we decided to no longer recommend the container-component-pattern and therefore changed the folder structure of the project.

We did this because the previously introduced facades provide a more convenient way to interact with the state management and more and more logic was moved out of containers, hence removing all ngrx-related imports there.

You can run the migration by executing `node schematics/migration/0.16-to-0.17`.

The script will check if all your components can be moved to the new folder structure and will then perform the migration or notify you of work previously needed.
