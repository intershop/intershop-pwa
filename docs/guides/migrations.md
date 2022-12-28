<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Migrations

## 3.2 to 3.3

To improve the accessibility of the PWA in regards to more elements being tab focusable a lot of `[routerLink]="[]"` where added to links that previously did not have a link reference.
Also some `(keydown.enter)` event bindings with `tabindex="0"` were added to ensure a better interactivity with the keyboard only.
If the according commits lead to problems they could be skipped and resolved later by fixing the accessibility linting issues manually.
More information regarding accessibility in the PWA and the used ESLint rules can be found in the [Accessibility Guide](./accessibility.md).

## 3.1 to 3.2

A styling adaption was made to the application shell to expand it to the full page height, so the footer now always stays at the bottom.
Together with that an inline style of the `main-container` was moved to the global styling definition.

Formly has been upgraded from version 5 to 6.
Find more information in the [Formly Upgrade Guide](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-6.0.md).
We still use deprecated form properties like `templateOptions` and `expressionProperties` for compatibility reasons but we are going to replace them in the next major release.

The two small black triangle images `active_catalog.png` (header: when hovering a catalog) and `budget-bar-indicator.png` (my account: budget bar) are removed and replaced by CSS styling.
The image for an empty basket `empty-cart.png` is removed and replaced with CSS styling.
The sprite image `product_sprite.png` is removed and replaced with localized text for "New", "Sale", and "Top" with the according CSS styling.

After entering a desired delivery date on the checkout shipping page and after submitting the order, the desired delivery date will be saved at all basket items if necessary.
In case of large baskets (> 20 items) this might cause long response times.
You can keep the existing behavior by modifying the `updateBasketItemsDesiredDeliveryDate()` method of the basket service to always return an empty array without doing anything.

The `ProductsService` was changed to use `extended=true` REST calls for product details and variations to fetch variation attributes with additional `attributeType` and `metaData` information that can be used to control the rendering of different variation select types.
The added `VariationAttributeMapper` maps the additional information in a backwards compatible way.
To handle the different variation select rendering types, the existing `ProductVariationSelectComponent` now contains the logic to select the fitting variation select rendering component.
The rendering and behavior of the existing `ProductVariationSelectComponent` as a standard select box was moved to the new `ProductVariationSelectDefaultComponent`.
A `ProductVariationSelectSwatchComponent` for colorCode and swatchImage variation select rendering and a `ProductVariationSelectEnhancedComponent` for a select box rendering with color codes or swatch images and a mobile optimization were added.

The user authentication process has changed.
User authentication tokens are requested from the ICM server using the `/token` REST endpoint now.
Regarding this, the logout action triggers a service which revokes the currently available access token on the ICM backend.
If the logout was successful, all personalized information is removed from the ngrx store.
Please use `logoutUser({ revokeToken: false })` from the account facade or dispatch `logoutUserSuccess` instead of the `logoutUser` action to use the old behavior.

## 3.0 to 3.1

The SSR environment variable 'ICM_IDENTITY_PROVIDER' will be removed in a future release ( PWA 5.0 ).
Use variable 'IDENTITY_PROVIDER' to select the provider to be used instead.
Keep this in mind before deploying or starting the Intershop PWA in server-side rendering mode.

The default value of the input parameter ['queryParamsHandling'](https://angular.io/api/router/QueryParamsHandling) has been changed from 'merge' to '' for the components `product-name.component` and `product-image.component`.
This has been done to prevent an unintentional application of filters for product variation master links if the product detail link does not originate from a product listing context (product list page, search result page).

To prevent deprecation warnings we removed the unnecessary `~` from all 3rd party SCSS imports (see https://webpack.js.org/loaders/sass-loader/#resolving-import-at-rules - "Using ~ is deprecated and can be removed from your code (we recommend it)").
This should be done for additional imports in the customizations as well.

The validator `equalToControl` did not work properly.
For that reason we removed it.
Use the validator `equalTo` instead.
Find more information in the method description in the [`special-validators.ts`](https://github.com/intershop/intershop-pwa/blob/3.0.0/src/app/shared/forms/validators/special-validators.ts#L82-L87).

The "Product Image Not Available" PNG image `not_available.png` is removed and replaced by an SVG image `not-available.svg` which does not include a text inside the image anymore to avoid localization issues.
The file references are updated accordingly, the product image component is updated to use the correct image attributes, a localized alternative text is added, and the product and image mapper files are updated to provide the correct data.
In case the current PNG image file and the handling is customized in a project, you have to ensure to keep the project changes.

## 2.4 to 3.0

With the 2.4.1 Hotfix we introduced a more fixed Node.js version handling to the version used and tested by us.
We set Node.js 16.16.0 and npm 8.11.0 as our application runtime and package management versions.
This is supposed to prevent unexpected build issues in the future but requires manual updating of Node.js to newer versions if tested successfully.
Other Node.js versions might still work but you might get warnings regarding the project's recommended settings.

The Intershop PWA 3.0 release includes a Jest Update to version 28, see also https://jestjs.io/docs/upgrading-to-jest28.
The jest-marbles package has been replaced by jasmine-marbles.

It also contains the Angular 14 update and updates to a lot of other dependencies (NgRx, Typescript).
These updates require some code adaptions, e.g., form classes have been prefixed with _Untyped_ wherever necessary.
The following official guides might help to migrate custom code as well:

- https://update.angular.io/?v=13.0-14.0
- https://ngrx.io/guide/migration/v14
- https://angular.io/guide/typed-forms

Because Angular 14 now uses `yargs` to parse CLI arguments (see [#22778](https://github.com/angular/angular-cli/pull/22778)), schematic options with a `no` prefix are handled differently.
With [#23405](https://github.com/angular/angular-cli/pull/23405), the Angular team has introduced a temporary workaround for this.
In order to reliably maintain compatibility in the future, the `cms` schematic's `noCMSPrefixing` option has been renamed to `cmsPrefixing` with an inverted behavior.

Cypress has been upgraded from version 9 to 10.
We went through the interactive migration to move our spec files from cypress/integration folder to the cypress/e2e folder and updated the config file as well as some scripts.
Find more information in the [Cypress Migration Guide](https://docs.cypress.io/guides/references/migration-guide#Migrating-to-Cypress-version-10-0).

Since the used deferred load library is no longer maintained, it is removed and has been replaced with similar standard browser functionality [`loading="lazy"`](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading#images_and_iframes).
All uses of the `(deferLoad)` directive in custom code need to be replaced.

We removed the unmaintained `angular2-uuid` library in favor of the standard `uuid` library that is already included as an Angular dependency.
In order to match our changes, replace all occurrences of `angular2-uuid` in your custom code (see #1203).

The [pagespeed module](https://www.modpagespeed.com) of NGINX has been removed without replacement.

The [@ngx-translate/http-loader](https://github.com/ngx-translate/core) dependency was removed since we did not use it.
You might need to keep this dependency if you are loading translations differently from the standard Intershop PWA in your customization.

The deprecated `customized-copy` schematic for copying components and replacing all usages was removed.

We introduced a build variable `SSR` that is now used for all checks if the application is running in SSR or Browser context.
We no longer use the verbose way of injecting the `PLATFORM_ID` and check it with the methods `isPlatformBrowser` or `isPlatformServer`.
This way still works but it is discouraged by a new ESLint rule that suggests using the new `SSR` variable instead.
So running `npm run lint` will help finding custom code that still relies on the platform checks.

To support, e.g., special characters in e-mail addresses with newer versions of ICM (7.10.38.x), like `+`, double encoding of resource ids in the REST API calls is necessary.
With the method `encodeResourceID` we provide a central place that implements the fitting resource encoding.
In the PWA this was applied to all user logins in REST API calls.
For project customizations the usage of the native `encodeURIComponent` functionality should be replaced with `encodeResourceID` for user logins in REST calls as well.

The `footer.content` localization key was replaced for most of its content by a CMS manageable content include `include.footer.content.pagelet2-Include` that is available from ICM 7.10.38.9-LTS.

For better Search Engine Optimization the route formate and route handling for products, categories, and content pages has been reworked.
All these routes now contain hierarchies and have different id markers.
For categories it was changed from `cat` to `ctg` and for products from `sku`to `prd`.
This way, it is intended to have less conflicts and limitations with potential category/product ids, e.g., 'cats' or 'skunks'.

To improve the support of large baskets we update the ngrx store immediately after adding, updating and deleting basket items now.
Therefore, we had to change the return values of the corresponding basket service functions as well as the payload of the success actions.
We also limited the number of displayed line items in the mini basket and introduced a paging bar on the basket page to speed up the rendering of these components.

## 2.3 to 2.4

The PWA 2.4 contains an Angular update to version 13.3.10 and many other dependencies updates.
These updates did not require any updates to the PWA source code.
But it needs to be checked if this is true for your project customizations as well.

We introduced a checkout guard that protects the checkout routes in case no shopping cart is available and navigates back to the empty basket page.

Routes to non-existing CMS content pages now result in a "Page Not Found" error page.

The 'ratings' functionality (components concerning the display of product ratings) has been moved into an extension using the existing feature toggle 'ratings'.

With the display of product reviews the attribute 'numberOfReviews' has been added to the product model, and the number of reviews is now displayed behind the product rating stars instead of the average rating that is already depicted in the stars.

## 2.2 to 2.3

The 'contact us' functionality has been moved into an extension and we have introduced the feature toggle `contactUs` in the `environment.model.ts` that is switched on by default.

The `getFilteredProducts` method has been moved from the `FilterService` to the `ProductsService`, since the `/products` API is used.
Together with this change, the default product attributes for product listings have been externalized and are easily overridable now.

With [#1135](https://github.com/intershop/intershop-pwa/pull/1135), the default model representation used by `NgbDatepicker` is the native ES6 `Date` now.
During this refactoring, the `DateHelper` class has been removed. **This will not concern you if you use `ish-date-picker-field` directly**.
However, if you use `NgbDatepicker` outside of formly, some helpers you might have used are gone.
Please use the underlying functions from `Date`, [`NgbCalendar`](https://ng-bootstrap.github.io/#/components/datepicker/api#NgbCalendar) and [`date-fns`](https://date-fns.org) directly, or create your own `DateHelper`.

## 2.1 to 2.2

The PWA 2.2 contains an Angular update to version 13.3.0 and many other dependencies updates.<br/>
These updates required some internal webpack handling changes especially for the template overloading.<br/>
Also, some test adaptions where necessary, so is it now necessary to mock the `SwiperComponent`.<br/>
Another change is the [Formly](https://formly.dev/) downgrade from v6 pre-release to v5 that still works with Angular 13 with a changed `ngcc` setting.<br/>
After the updates, the deprecated RxJS MapTo operators (`mapTo`, `mergeMapTo`, `switchMapTo`) were replaced [Deprecating MapTo variants](https://github.com/ReactiveX/rxjs/issues/6399).
Linting will point out these issues in custom code that can easily be replaced then.

The Intershop PWA now uses Node.js 16 LTS with a corresponding npm version >=8.0.0.
With this new npm, calls using `npx npm-run-all` in CI have to be changed to `npm run exec npm-run-all`.

Changes with Angular 13 require to declare less dependencies in test beds than before.
For that reason the PWA 2.2 contains two pull requests that cleanup a lot of test specs (see #1057 and #1072).
It is not considered a breaking change but it might result in merge conflicts with customized Jest tests.
To cleanup the own code base run `npm run cleanup-testbed`.
Run `npm run cleanup-testbed -- --help` for more detailed options.

The `shared/formly` folder - containing all custom types, wrappers, etc - was updated.<br/>
For a cleaner separation of code artifacts, there are now multiple subfolders declaring their own modules where formly is partly configured.
The `FormlyModule` brings all these together, so you can use it just like before.
If you made any changes in `shared/formly`, you will have to adapt the corresponding modules.<br/>
Additionally, we introduced a `formly/field-library` subfolder that contains a `FieldLibrary` service which enables you to define reusable `FormlyFieldConfig`s and access them easily.
If you have customized anything in `shared/formly-address-forms/configurations/address-form-configuration.ts`, for example, the `standardFields` variable, you will have to migrate these changes by defining new `FieldLibraryConfiguration`s.
The address form configurations now use the new `FieldLibrary` functionality under the hood.<br/>
For more information, read the new [Field Library](../guides/field-library.md) documentation.

The compare products functionality was moved into an extension.
The already existing `compare` feature toggle works as before but the compare components integration changed to lazy components, e.g., `<ish-product-add-to-compare displayType="icon"></ish-product-add-to-compare>` to `<ish-lazy-product-add-to-compare displayType="icon"></ish-lazy-product-add-to-compare>`.
For other compare components, check the compare-exports.module.ts file.

## 2.0 to 2.1

The recently viewed products functionality was moved into an extension.
The already existing `recently` feature toggle works as before but the recently viewed component integration changed from `<ish-recently-viewed *ishFeature="'recently'"></ish-recently-viewed>` to `<ish-lazy-recently-viewed></ish-lazy-recently-viewed>`.
This has already been changed for the product detail page and the basket page but needs to be done for any customized usage of the recently viewed component.

The `clean-localizations` functionality was changed so that `keep-localization-pattern` can be defined where they are used and do no longer need to be added directly to the [`clean-up-localizations` script](../../scripts/clean-up-localizations.js).
It might be useful to move custom patterns according to the changes done for the standard code (for more information see [Localization File Clean Up Process](../concepts/localization.md#localization-file-clean-up-process)).

TestBed configuration arrays are sorted again as of 2.1 This means a lot of (small, auto-fixable) changes across the codebase.
Simply run `ng lint --fix` in order to sort your arrays.
If you have a lot of migration changes, you might be required to run it more than once.

With the introduction of personalized REST calls for categories and products, data in the ngrx store runs the risk of not being up-to-date after a login or logout.
To fix this, a new `resetSubStatesOnActionsMeta` meta-reducer was introduced to remove potentially invalid data from the store.
If the removal of previous data from the store is not wanted, this meta reducer should not be used in customized projects.
In addition, a mechanism was introduced to trigger such personalized REST calls after loading the PGID if necessary.
This way of loading personalized data might need to be added to any custom implementations that potentially fetch personalized data.
To get an idea of the necessary mechanism, search for the usage of `useCombinedObservableOnAction` and `personalizationStatusDetermined` in the source code.

## 1.4 to 2.0

Since [TSLint has been deprecated](https://blog.palantir.com/tslint-in-2019-1a144c2317a9) for a while now, and Angular removed the TSLint support, we had to migrate our project from TSLint to ESLint as well.
This means in version 2.0 all TSLint rules and configurations were removed and replaced by ESLint where possible.

This not only required configuration changes in the Intershop PWA project but also application code adaptions to comply with some of the new ESLint rules.
To allow for an as easy as possible migration of existing PWA projects, we split the whole switch in separate commits that should make it easier to resolve potential merge conflicts by providing some context, e.g., changes to satisfy a specific rule or project configuration changes etc.
We advise you to first cherry pick all the `eslint` commits provided by the PWA release before applying the lint rules to the project customizations to fix the issues that reside in the project code.
If the found issues are too many to address them in an ordered manner, it is probably best to temporarily disable some of the failing rules in `.eslintrc.json` (see [Configuring ESLint](./eslint.md#configuring-eslint) and to only fix one after another.

It is also probably a good idea to do the PWA 2.0 migration not in one go as described in [Import Changes from New PWA Release](./customizations.md#import-changes-from-new-pwa-release-migration) but to first do the commits before the linter switch and bring your project to a clean state (`npm run check`).
After this, all the linter switch commits should be applied and the project should be brought back to a clean state.
Once this is done, subsequent commits should be migrated.
If your project contains own custom TSLint rules, you will have to re-implement them as ESLint rules to be able to apply them to your code base (see [Custom ESLint rules](./eslint.md#custom-eslint-rules)).

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
Instead, theme-specific environments exist for `default` and `blue`, and development settings can be overridden in `environment.development.ts`, which are imported into the theme-specific configurations (see [Guide - Development](./development.md#development-server)).
`npm install` will create an initial version of the `environment.development.ts` that can be filled with the needed information from `environment.local.ts`.
The `environment.local.ts` itself becomes obsolete and can be deleted.

Locale definitions in `environment.ts` models are no longer supported, only ICM channel configurations are now used for switching locales.

## 0.29 to 0.30

We introduced the feature toggle 'guestCheckout' in the `environment.model.ts`.

We switched to encode user logins when used in the api service.
This is to enable special characters (like the #) that are sometimes present in user logins (SSO case!) but would have led to errors before.

## 0.28 to 0.29

We activated TypeScript's [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny).
Please refer to the [Type Safety](./getting-started.md#type-safety) part in the Getting Started Guide for motivations.

## 0.27 to 0.28

We removed the property `production` from Angular CLI `environment.ts` files.
Production mode can consistently be set by using Angular CLI configurations now.
This also works when running multiple configurations like `--configuration=brand,production`.

We removed the property `serviceWorker` from Angular CLI `environment.ts` files.
The Service Worker can now be set consistently depending on the current configuration in the `angular.json` file.

We removed the dependency to `ngx-swiper-wrapper` as it will [no longer be supported](https://github.com/zefoy/ngx-swiper-wrapper#eol-notice) and `swiper` itself now [natively supports](https://swiperjs.com/angular) Angular (see changes #552).

We introduced [formly](https://formly.dev/) to handle all kinds of forms from now on.
We removed `src/app/shared/address-forms` in favor of `src/app/shared/formly-address-forms` and `src/app/shared/forms-dynamic` in favor of a generalized formly integration in `src/app/shared/formly`.
To implement your country-specific address forms in formly, see [Forms](./forms.md#the-address-form-as-an-example-of-a-reusable-form).

We introduced an improved usage of memoized selectors for product selectors, split up state, saved additionally retrieved data in separate places, and migrated almost all product-related components to use the previously introduced product context facade (see changes #528).

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
We could not detect any impact for the PWA itself but custom code might have to be adapted.

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
For more information, see [Nginx documentation](./nginx-startup.md).

## 0.23 to 0.24

We introduced a [localization file clean up script](../concepts/localization.md#localization-file-clean-up-process) that removes all unused localization keys from the localization files and sorts the remaining keys.
The clean up result is contained in a separate commit that should probably not be applied during a migration and instead a `npm run clean-localizations` should be performed on the project sources.

We renamed the testing helper `findAllIshElements` from [`ish-core/utils/dev/html-query-utils`](../../src/app/core/utils/dev/html-query-utils.ts) to `findAllCustomElements` to support project customization.
The returned lists from `findAllCustomElements` and `findAllDataTestingIDs` are no longer sorted to represent the actual template structure.

With Angular version 10.1, the testing utility [async](https://angular.io/api/core/testing/async) was [deprecated](https://github.com/angular/angular/commit/8f074296c2ffb20521e2ad1bbbb3dc8f2194cae6).
We refactored our code base to use native async/await instead, which was possible in all cases.
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
This means that the old way of writing action classes, reducer switch statements, and @Effect() decorators is deprecated from 0.21 onwards.

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

In this version change, we decided to no longer recommend the container-component-pattern and, therefore, changed the folder structure of the project.

We did this, because the previously introduced facades provide a more convenient way to interact with the state management and more and more logic was moved out of containers, hence removing all ngrx-related imports there.

You can run the migration by executing `node schematics/migration/0.16-to-0.17`.

The script will check if all your components can be moved to the new folder structure and will then perform the migration or notify you of work previously needed.
