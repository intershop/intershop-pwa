<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Migrations

## From 11.1.0 to 12.0.0

**Swiper 12 upgrade**

Swiper has been upgraded from version 8 to 12.
This upgrade spans multiple major versions and includes several breaking changes:

- Removal of Swiper Angular components (now using Swiper's [JavaScript API](https://swiperjs.com/swiper-api))
- Changed module import path

For further details, see the official Swiper migration guides for [v9](https://swiperjs.com/migration-guide-v9), [v10](https://swiperjs.com/migration-guide-v10), and [v11](https://swiperjs.com/migration-guide-v11).

**Lazy loading with `DeferredItemComponent`**

The new `DeferredItemComponent` supports `IntersectionObserver`-based lazy loading.
It defers the rendering of projected content until the element becomes visible in the viewport.
It is used for Swiper carousel slides but also applies to any other lazy loading scenario.
Use `ish-deferred-item` with `ishLazyLoadingContent` for lazy loading.

**Filter component changes**

With the rework of the `FilterDropdownComponent` to use `ng-select` instead of `ngbDropdown` and to support multi-selection, the `FilterNavigationBadgesComponent` has been renamed to `FilterNavigationActionsComponent` (selector changed from `ish-filter-navigation-badges` to `ish-filter-navigation-actions`).
The component now only provides a "Remove all filters" action.

## From 11.0.0 to 11.1.0

**New footer styling**

The footer component has been restructured and simplified.
The `StoreLocatorFooterComponent` has been removed from the PWA footer.
The store locator link is now managed via ICM as part of the CMS footer content include (`include.footer.content.pagelet2-Include`).
If your project extended or customized the `StoreLocatorFooterComponent`, remove all references to it and configure the store locator link in ICM instead.

**Withdrawal functionality**

The Intershop PWA now supports the EU right of withdrawal feature.
Customers can submit withdrawal requests for their orders directly through the storefront.
The feature is controlled by the ICM server configuration parameter `preferences.WithdrawalPreferences.WithdrawalEnabled`.
When enabled, a withdrawal link appears in the footer, and the `/withdrawal` route becomes accessible.
The footer link and route are automatically hidden when the preference is disabled.
This feature requires ICM version 14.3.0 or higher.

## From 10.1.0 to 11.0.0

**Angular 18 update**

With Intershop PWA 11.0.0, the project was updated to Angular 18.
In addition, several dependencies such as Formly, ESLint, Jest, Prettier and TypeScript have been updated.
The Angular update replaces the deprecated i18n API—for example, `getCurrencySymbol`—with the new `Intl` API.
For a list of all deprecations, see the [Angular page in GitHub](https://github.com/angular/angular/issues/54470).

For more details about the Angular 18 update, see the [Angular Update Guide](https://angular.dev/update-guide?v=17.0-18.0&l=3).

**Formly 7 update**

Formly was updated to version 7.
For more information, see the [Formly migration guide](https://formly.dev/docs/guide/migration).

**ESLint 9 update**

With the update to ESLint 9, the configuration format changed from the legacy _.eslintrc.json_ to the new flat config format _eslint.config.mjs_.
The separate _.eslintrc.json_ files previously located in the _e2e/_ and _schematics/_ folders have been consolidated into the root _eslint.config.mjs_ as file-specific override blocks.
The new config also includes `eslint:recommended` and `eslint:stylistic` for TypeScript files.
Some ESLint-related packages were renamed and updated to their latest versions, resulting in changes to the available rules and their default values.

_Plugin changes:_

| Old plugin                   | New plugin                       |
| :--------------------------- | :------------------------------- |
| `eslint-plugin-rxjs`         | `@smarttools/eslint-plugin-rxjs` |
| `eslint-plugin-rxjs-angular` | `eslint-plugin-rxjs-angular-x`   |

_Renamed rules:_

| Old rule                              | New rule                                 |
| :------------------------------------ | :--------------------------------------- |
| `@typescript-eslint/ban-types`        | `@typescript-eslint/no-restricted-types` |
| `@typescript-eslint/no-var-requires`  | `@typescript-eslint/no-require-imports`  |
| `@typescript-eslint/no-throw-literal` | `no-throw-literal` (base ESLint rule)    |
| `etc/no-deprecated`                   | `@typescript-eslint/no-deprecated`       |

_New rules that might require code changes:_

| Rule                                                  | Severity                                      |
| :---------------------------------------------------- | :-------------------------------------------- |
| `@typescript-eslint/no-shadow`                        | warn                                          |
| `guard-for-in`                                        | error                                         |
| `max-classes-per-file`                                | error (off for `*.module.ts` and `*.spec.ts`) |
| `max-lines` (500)                                     | warn (off for `*.module.ts` and `*.spec.ts`)  |
| `no-eval` / `no-implied-eval`                         | error                                         |
| `@angular-eslint/template/cyclomatic-complexity` (10) | warn                                          |
| `@angular-eslint/template/eqeqeq`                     | error                                         |

_Changed rules:_

| Rule         | Old value | New value                      |
| :----------- | :-------- | :----------------------------- |
| `complexity` | `max: 10` | `max: 15, variant: 'modified'` |

**CSpell ESLint integration**

Spell checking for TypeScript and JavaScript files is now performed by `@cspell/eslint-plugin` during ESLint linting instead of the standalone CSpell CLI.
The VS Code CSpell extension is disabled for TypeScript and JavaScript files to avoid duplicate warnings.

To migrate custom code:

- Run `npm run lint` to check for spelling errors in TypeScript and JavaScript files.
- Add project-specific words to _intershop.txt_.

**Jest 30 update**

Jest and related packages such as `jest-preset-angular` have been updated to their latest major versions.
The update includes several breaking changes.

Key changes:

- The configuration format changed from _jest.config.js_ to _jest.config.ts_, using the new `createCjsPreset()` from `jest-preset-angular` instead of the previous `preset` string.
- The test runner is explicitly set to `jest-jasmine2` to maintain backward compatibility, since Jest 30 defaults to `jest-circus`.
- The `jest-environment-jsdom` package now uses JSDOM v26, which can introduce behavior changes in the DOM test environment. Mocking `window.location` is no longer possible with the current JSDOM version; affected tests must be refactored or temporarily disabled.

For more details about the Jest 30 update, see the [Jest Upgrade Guide](https://jestjs.io/docs/upgrading-to-jest30).

**Prettier 3 and Stylelint 17 update**

With Intershop PWA 11.0.0, Prettier and Stylelint have been updated to the latest versions.

The commits for the dependency updates and the required code style changes and adaptations are provided separately.
This allows the dependency update commit to be integrated into a customer project while the automatic changes are skipped and executed directly on the custom code.

Run the following commands after updating the formatting and linting dependencies:

```
npm run format
ng lint --fix
```

**CMS view context REST requests with resource set ID**

The REST requests to get CMS view context data now append the resource set ID (the defining view context model's cartridge name) by default to improve performance.
A default resource set ID, `app_sf_base_cm`, is defined at the [`CMSService`](../../src/app/core/services/cms/cms.service.ts) and can be overridden at the individual view context inclusion if necessary.

```html
<ish-content-viewcontext
  resourceSetId="custom_cartridge_name"
  viewContextId="viewcontext.include.product.base.top"
  [callParameters]="{ Product: product.sku }"
/>
```

In migration projects, nothing needs to be done if the default resource set ID is sufficient.
If the default resource set ID is not sufficient, the `resourceSetId` input parameter needs to be added to all `ish-content-viewcontext` usages in the project that require a different resource set ID.
If `app_sf_base_cm` is not the correct resource set ID for the view contexts used in the project, you can also change the `defaultResourceSetId` at the `CMSService` to avoid adding the `resourceSetId` input parameter to every `ish-content-viewcontext` usage.

> [!NOTE]
> Using view context REST requests with the added resource set ID requires ICM 12.1.0 or later.

**RegEx support for `OVERRIDE_IDENTITY_PROVIDERS` configuration**

The `OVERRIDE_IDENTITY_PROVIDERS` matching pattern configuration has been enhanced to not only support exact matches with `MULTI_CHANNEL` matching patterns; it can now also be configured as a RegEx that matches several `MULTI_CHANNEL` matching patterns.

**Removed automatic SSL certificate generation in NGINX container**

The automatic SSL certificate generation feature (development-only) using [mkcert](https://github.com/FiloSottile/mkcert) has been removed from the NGINX container.
See the updated [NGINX Startup Guide](./nginx-startup.md#https-or-ssl) for detailed instructions on how to configure SSL development deployments.

**NGINX Docker build uses Ubuntu mirror**

The NGINX Docker build now defaults to _azure.archive.ubuntu.com_ for apt packages to improve build reliability on Azure and GitHub Actions.
If this mirror is unreachable, pass `--build-arg UBUNTU_MIRROR=` to the pipeline to fall back to the default Ubuntu repositories.

**PayPal Google Pay and Apple Pay functionality**

The Intershop PWA now supports Google Pay and Apple Pay as additional payment methods via PayPal.
Two new adapters have been added, `PaypalGooglePayAdapter` and `PaypalApplePayAdapter`, that integrate with the PayPal SDK to render the respective payment buttons and handle the associated payment flows.
This functionality requires Intershop PPCP Connector version 3.1.0 or higher (ICM 14.2.2+, Google Pay JS API 2.0, Apple Pay JS API 4).
For details, see the [PayPal Integration Guide](./paypal.md).

**Language switch component**

The behavior of the language switch component has changed.
The component no longer renders when only one language is configured in ICM, and therefore no language switch options are available.

> [!TIP]
> The [Intershop Academy](https://public.academy.intershop.com/plus/catalog) (free registration required) offers a video tutorial on [how to migrate from version 9.0.0 to version 11.0.0](https://public.academy.intershop.com/plus/catalog/courses/488).

## From 9.1.0 to 10.0.0

**Node.js update**

The Intershop PWA now uses Node.js 22.22.0 LTS with the corresponding npm version 10.9.4.

**SCSS variable changes**

With Intershop PWA 10.0.0, the SCSS variables were cleaned up.
Hard-coded color codes were removed and replaced with the appropriate variables.
Color variables are used in the appropriate places, and the gray color scale was adjusted.
In addition, some variable names were changed (renamed or removed) to make them more meaningful and to match the Bootstrap variable names.
These renamed and removed variables need to be adapted in customized project theme styles if the theme styles still rely on the standard SCSS files.

This table lists all variable name changes you need to adjust in your custom code:

| Renamed variable          | New variable name        | Used for                        |
| :------------------------ | :----------------------- | :------------------------------ |
| $color-corporate          | $bg-color-corporate      | Corporate color for backgrounds |
| $color-special-primary    | $color-special-error     | Error state color               |
| $color-special-secondary  | $color-special-warning   | Warning state color             |
| $color-special-tertiary   | $color-special-info      | Info state color                |
| $color-special-quaternary | $color-special-success   | Success state color             |
| $color-label-sale         | $color-special-sale      | "Sale" label color              |
| $color-label-topseller    | $color-special-topseller | "Top Seller" label color        |
| $color-label-new          | $color-special-new       | "New" product label color       |
| $success-color            | $color-special-success   | Success state color             |
| $error-color              | $color-special-error     | Error state color               |
| $gray-400                 | $gray-500                | Part of new sorted gray color   |

This table lists all variables that were removed and their replacements:

| Removed variable          | Variable replacement |
| :------------------------ | :------------------- |
| $input-accent-color       | $CORPORATE-DARK      |
| $button-primary-bg        | $CORPORATE-PRIMARY   |
| $button-primary-border    | $CORPORATE-PRIMARY   |
| $button-default-color     | $CORPORATE-PRIMARY   |
| $button-default-bg        | $color-inverse       |
| $button-default-border    | $CORPORATE-PRIMARY   |
| $button-focus-box-shadow  | $CORPORATE-SHADOW    |
| $datepicker-border-radius | -                    |
| $datepicker-today-bg      | -                    |
| $datepicker-today-hover   | -                    |
| $datepicker-active-bg     | -                    |
| $datepicker-active-hover  | -                    |

**API service `options` method removed**

The deprecated `options` method of the [`api.service`](../../src/app/core/services/api/api.service.ts) has been removed.
Use the `get` method with REST calls of the latest REST interface instead.

**User logout action changes**

The `logoutUserSuccess` action is now designated as API-specific and should only be dispatched after successful token revocation in `user.effects`.
For resetting a user-related state without API calls (e.g., forced logout or session cleanup), use the new `resetUserData` action instead.
This ensures clearer separation between API events and state management.

**Language switch relocation**

The language switch component has been moved from the mobile user information drop-down to the main header navigation for better accessibility and user experience.
Accordingly, the language switch accordion view and its associated component input variable have been removed.

**NGINX cache clearing enabled by default**

[NGINX cache clearing](./nginx-startup.md#cache-clearing) is now enabled by default.
The `CACHE_CLEARER` environment variable behavior changed from opt-in to opt-out.
Set `CACHE_CLEARER` to `off` to disable this feature.

**SPARQUE API version update**

The SPARQUE services use API version 4 now for all REST calls.
Find the corresponding migration notes in the [SPARQUE API Wrapper Migration Guide](https://docs.sparque.ai/wrapper/migration_guides/migration_guide_wrapper_1x9x0.html).

**Product inventory handling changes**

Product inventory data is now fetched by separate `inventories` REST calls instead of using the information fetched with the products REST call.
The product attributes `inStock` and `availableStock` have been deprecated and will be removed in the next major release.

Migration Steps:

1. Replace deprecated product attributes: Update any code that accesses `product.inStock` or `product.availableStock` directly.
2. Use facade methods instead:
   - For general inventory access, use `ShoppingFacade.productInventory$(sku)`.
   - For product context-specific access, use `ProductContextFacade` selectors like `context.select('inventory', 'inStock')` or `context.select('inventory', 'availableStock')`.

This change allows caching product data for a longer time and fetching more frequently updated inventory data separately on demand.

**Support for internal/backend request routing**

The improved implementation for the environment variable `ICM_BASE_URL_SSR` as well as the introduction of an optional `serverUrlSsr` SPARQUE configuration allows server-side rendering to directly use internal backend requests to ICM and SPARQUE when running in the same Kubernetes cluster.

**PayPal Advanced Credit and Debit Card functionality**

With the introduction of the PayPal Advanced Credit and Debit Card functionality, the previous PayPal implementation has been completely revised.
Instead of the components `payment-paypal-messages.component.ts` and `payment-paypal.component.ts`, there is now only one component: `payment-paypal.component.ts`.
This component supports the PayPal message and button functionality, as well as the PayPal Credit Card functionality.
Additionally, the `PaypalConfigService` has been moved to the following package path: _src/app/core/utils/paypal/paypal-config_.

**Script loader changes**

The script loader service [`script-loader.service.ts`](../../src/app/core/utils/script-loader/script-loader.service.ts) has been revised.
The new implementation is fully backward compatible and offers additional improvements for caching:

- Dual-cache system: The service now uses separate caches for loaded scripts (`loadedScripts`) and scripts currently being loaded (`loadingScripts`), preventing duplicate loading requests.
- DOM-aware loading: Before creating a new script element, the service checks whether the script already exists in the DOM and marks it as loaded immediately.
- Namespace-based caching: Scripts with a `data-namespace` attribute use the namespace value as cache key instead of the URL. This prevents re-loading scripts with dynamic URLs (e.g., PayPal SDK with changing locale/currency parameters).

**SPARQUE multi-site configuration `features` format**

The format to define the enabled SPARQUE features via [multi-site configuration](./sparque-ai.md#multi-site-configurations) was changed and needs to be adapted in the according deployment configuration files.
This is only relevant for the multi-site configuration, for the other configuration options the Array notation stays the same.

```yaml
  sparque:
    ...
    features: search,suggestions,recommendations
```

**Angular 17 update**

With Intershop PWA 10.0.0, the project was updated to Angular 17.
The upgrade replaces Angular Universal with the new `@angular/ssr` package.
In addition, the project was migrated to the new Angular control flow syntax.
Several dependencies (including NgRx and `@ngx-translate`) have been updated.

Key changes:

- Migrated from structural directives (`ngIf`, `ngFor`, `ngSwitch`) to the new control flow syntax (`@if`, `@for`, `@switch`) for improved performance and readability. Use the [Angular migration control-flow schematic](https://angular.dev/reference/migrations/control-flow) `ng generate @angular/core:control-flow` to automate the migration process.
- Migrated `trackBy` functions of `for` loops to the new syntax, e.g., `@for (item of items; track item.id)`.
- Introduced the mandatory `track` expression for all `@for` loops.

> [!NOTE]
> Consider the optimization suggestion to use a unique identifier of the iterated items (see [Why is `track` in `@for` blocks important?](https://angular.dev/guide/templates/control-flow#why-is-track-in-for-blocks-important) for details).
>
> Using only an identifier for an outer `for` loop with nested `for` loops might result in rendering/interaction issues.
> In such cases, the whole object needs to be used as track expression, e.g., `@for (item of items; track item)`.

- Updated the import for `glob` in scripts
- Refactored test files to use `provideRouter()` instead of the deprecated `RouterTestingModule`
- Moved `concatLatestFrom` imports from `@ngrx/effects` to `@ngrx/operators`
- Removed extra closing tags for empty elements in HTML templates
- Updated Angular compiler options in `tsconfig.json`

For more details about the Angular 17 update, see [Angular Update Guide](https://angular.dev/update-guide?v=16.0-17.0&l=3).

**Bootstrap Icons**

With this release, the Intershop PWA migrated from Font Awesome icons to [Bootstrap Icons](https://icons.getbootstrap.com/).
This change reduces bundle size (size of vendor bundle is reduced by 22%) and aligns the icon library with the Bootstrap framework.

To migrate your custom code, replace Font Awesome `<fa-icon>` components with Bootstrap Icons `<i>` elements:

| Font Awesome (old)                      | Bootstrap Icons (new)                |
| :-------------------------------------- | :----------------------------------- |
| `<fa-icon [icon]="['fas', 'print']" />` | `<i class="bi bi-printer-fill"></i>` |

The file `src/app/core/icon.module.ts` is no longer needed and can be removed.

The size of Bootstrap Icons is determined by font size which is inherited from their parent element.
Therefore, the styling for all icons must be checked.

For additional information on using Bootstrap Icons, see the [Styling & Behavior](../concepts/styling-behavior.md#icons) documentation.

**SSR and NGINX logging changes**

With Intershop PWA 10.0.0, we changed the logging of SSR and NGINX which includes breaking changes.
Both the SSR and NGINX now use structured JSON logs (default) compliant with the [Elastic Common Schema (ECS)](https://www.elastic.co/guide/en/ecs/current/index.html) specification.

Key changes:

- Containers write logs exclusively to `stdout`, which also replaces the former "Logging to an External Device" method
- Logging is now configured exclusively using the `LOGLEVEL` and `LOGFORMAT` environment variables for both SSR and NGINX
- Removed environment variables `LOGGING` (SSR) and `LOG_ALL` (SSR, NGINX)
- PM2-specific data is now included as JSON fields instead of prefixes (SSR)

For further details, see [Concept - Logging](../concepts/logging.md).

> [!TIP]
> The [Intershop Academy](https://public.academy.intershop.com/plus/catalog) (free registration required) offers a video tutorial on [how to migrate from version 9.0.0 to version 10.0.0](https://public.academy.intershop.com/plus/catalog/courses/482).

## From 9.0.0 to 9.1.0

Catalogs (root-level categories in ICM terminology) with _Show In Menu_ being disabled are now hidden from the main header navigation.

Intershop PWA 9.1.0 contains a fix to display warranties at recurring order line items.
This fix requires ICM 14.1.0 with the Recurring Order Extension 2.3.0 (`icm-as-customization-recurringorders:2.3.0`).

The server-side rendering (SSR) responses now contain a `Cache-Control: no-cache` header by default.
This `Cache-Control` header is ignored by the NGINX cache, but it ensures that browsers do not cache SSR responses.
Having `Cache-Control: no-cache` is a requirement for the Payment Card Industry Data Security Standard (PCI DSS).

With Intershop PWA 9.1.0, cost center import functionality via CSV files was introduced.

With Intershop PWA 9.1.0, user import functionality via CSV files was introduced.

## From 8.0.0 to 9.0.0

With Intershop PWA 9.0.0, the SSR container now supports the manual creation of PWA heap dumps for debugging purposes.
For more information about using this functionality, see [Building and Running Server-Side Rendering | Heap Dumps](./ssr-startup.md#heap-dumps).

The `DEPLOY_URL` functionality now also supports relative deploy URLs.
For more information, see [Deploy URL | Serving the PWA from a Sub-Path Including Static Files](../concepts/deploy-url.md#serving-the-pwa-from-a-sub-path-including-static-files).

With the `DEPLOY_URL` changes, the file `src/ssr/server-scripts/server.js` required adaptions and was renamed to `src/ssr/server-scripts/distributor.js` for clarity.

The Intershop PWA 9.0.0 release contains the **SPARQUE recommendations** functionality (for more details, see [SPARQUE.AI guide | Product Recommendations Feature](./sparque-ai.md#product-recommendations-feature)).

When we introduced the **SPARQUE suggest** and **SPARQUE search** functionality in PWA 7.0.0, the SPARQUE configuration used an all-or-nothing approach in which the entire SPARQUE integration was either enabled or disabled through a single configuration setting.
With the Intershop PWA 9.0.0 release, the SPARQUE configuration has been refined to allow for more granular control over individual SPARQUE features.
You can now enable or disable each feature independently, based on your business needs.
For more details, see [SPARQUE.AI guide | Feature Toggle Behavior](./sparque-ai.md#feature-toggle-behavior).
For existing projects with a SPARQUE configuration, the configuration needs to be extended to include the new `features` configuration to keep the previous behavior of having the SPARQUE search and suggestions enabled.

```typescript
sparque: {
  ...
  features: ['search', 'suggestions'],
},
```

The `TranslationService.getServerTranslations()` method now accepts an optional `prefix` parameter (default: `'pwa-'`) to specify the prefix for translation keys to be loaded from the server.
This change requires no migration of existing code.

Intershop PWA 9.0.0 contains support for ICM [Pre-integrated Custom Fields](https://knowledge.intershop.com/kb/index.php/Display/3M1102).
With this configuration, shop users can now add/edit additional information at the basket and at basket line-items.
The custom field information is displayed during the checkout and on the order details page.

The CMS _Product List (REST)_ rendering component was enhanced to support predefined endpoints for ICM (`icm://`) and SPARQUE (`sparque://`).
This allows content managers to configure product lists with relative endpoints to the PWA's configured ICM or SPARQUE backends, e.g., `icm://products?searchTerm=notebook&attrs=sku&amount=6`, instead of using absolute REST endpoints to a fixed ICM backend URL.

The Copilot integration was updated to work with a newer version of the Intershop Copilot for Buyers that returns different tool calls.
When migrating a PWA project that uses the Copilot integration, either use a new compatible configuration or skip this commit and continue with the previous implementation.

With Intershop PWA 9.0.0 the PWA is migrated to Bootstrap 5.
This includes updating dependencies, refactoring HTML, and adapting SCSS to align with Bootstrap 5's new features and breaking changes.

The following steps must be taken to migrate your custom code:

1. Review and update all custom styles and components for Bootstrap 5 compatibility.
2. Replace deprecated Bootstrap 4 classes and utilities.
3. Test the user interface for layout or behavior changes.
4. Handle differences in dependencies between Bootstrap 4 and 5.

Detailed information on the individual migration steps and breaking changes can be found in the official [Bootstrap 5 Migration Guide](https://getbootstrap.com/docs/5.3/migration).
It is recommended to perform the migration step by step through each version (version 5.0.0, 5.1.0, 5.2.0, 5.3.0).
Especially for the [migration to version 5.0.0](https://getbootstrap.com/docs/5.3/migration/#v500), it is advised to divide that into smaller tasks (SCSS, Typescript, form layout, buttons, etc.).
AI (like Github Copilot) can be a great help with these individual migration tasks.

The PayPal payment integration via [Intershop PayPal Complete Payments Service Connector (PPCP Connector) version 2](https://knowledge.intershop.com/kb/index.php/Display/455B74) was introduced in Intershop PWA 9.0.0.
The PayPal integration is enabled in the PWA via ICM backend configuration.
For more details, see [Guide - PayPal](./paypal.md).

> [!TIP]
> The [Intershop Academy](https://public.academy.intershop.com/plus/catalog) (free registration required) offers a video tutorial on [how to migrate from version 8.0.0 to version 9.0.0](https://public.academy.intershop.com/plus/catalog/courses/454).

## From 7.1.0 to 8.0.0

The Intershop PWA now uses Node.js 22.17.1 LTS with the corresponding npm version 10.9.2.
This update addresses the fact that Node.js 18 is no longer maintained and should not be used, even though Angular 16 was officially tested only with Node.js versions up to 18.
In the standard Intershop PWA, only the following warning needed to be addressed:

> `NodeRequire` is deprecated: Use `NodeJS.Require` instead

The OpenResty/NGINX image was updated to `openresty/openresty:1.27.1.2-2-jammy` that includes the update to LuaRocks 3.12.0.
This update resolves the issue with the `luarocks` package manager (see [#1825](https://github.com/intershop/intershop-pwa/pull/1825)).
With the working `luarocks` package manager, the installation of the `lua-resty-redis-connector` was re-enabled.

The order history listing for the PWA was improved.
Previously, there was a "load more" button to extend the order list if there were more orders to display.
Now, the order list provides a complete paging bar if there are more than 25 orders (by default) to display.
This functionality requires ICM 13.1.0 or newer, which includes the extended [Order REST API 1.8.0](https://support.intershop.com/kb/index.php/Display/3T1454) that returns the necessary paging information.

PWA projects that are not yet using ICM 13.1.0 or newer will only see the first 25 orders without any indication that additional relevant orders exist.
Searching and filtering will continue to function as before there, but the "load more" button will no longer be available.
For such projects, consider skipping the order history paging commit when migrating to PWA 8.0.0, and apply it after migrating to ICM 13.1.0.

The cost center listing for the PWA was improved.
It now comes with a complete paging bar if there are more than 25 cost centers (by default) to display.
In addition, search by cost center ID or name is now supported.
This functionality requires ICM 13.1.0 or newer that provides the new [Cost Center REST API 2.0.0](https://support.intershop.com/kb/index.php/Display/S31453) that supports paging and search.

PWA projects that do not use ICM 13.1.0 or newer yet will receive error responses from the old REST API version.
For such projects, consider skipping the cost center paging and search commit when migrating to PWA 8.0.0, and apply it after migrating to ICM 13.1.0.

The `InPlaceEditComponent` content projection selectors were changed from CSS class-based selectors to HTML attribute selectors.
To project content into the component's `viewMode`, use the `viewModeContent` attribute instead of the `form-control-plaintext` CSS class.
To project an input into the component's `editMode`, use the `editModeForm` attribute instead of the `form-control` CSS class.

| Previous                             | Current                |
| ------------------------------------ | ---------------------- |
| `<p class="form-control-plaintext">` | `<p viewModeContent>`  |
| `<input class="form-control">`       | `<input editModeForm>` |

Search for the usage of `ish-in-place-edit` in your project's customizations and update the selectors accordingly.

In version 8.0.0, the project's Stylelint and ESLint dependencies were updated.
The following commands should be executed after the formatting/linting dependencies updates to adapt the customized project code to changed/new rules.

```
npx stylelint "**/*.{css,scss}" --fix
ng lint --fix
```

The Intershop PWA now contains [custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions).
These instructions provide additional project-specific context to Copilot to optimize the code suggestions for the Intershop PWA and its customizations.

Intershop PWA 8.0.0 provides functionality to support recurring orders.
To enable the recurring order support in the PWA, ICM 13.x with the Recurring Orders Extension 2.2.1 (`icm-as-customization-recurringorders:2.2.1`) is required.
In addition, the "Recurring Orders" feature must be enabled in ICM (go to the channel > _Preferences > Recurring Orders_ and ensure the check box is _Enabled_).

New content includes were added to the My Account area.
They provide three general places to add content to all account pages, two specific places for the account overview page, and two specific ones for the order history page.
To use these content includes, an ICM with `icm-as-customization-headless:3.1.0` or newer is required.
If the connected ICM does not provide the new content includes, it is best to skip/revert these changes to avoid failing CMS REST requests (will not lead to errors in the application, but they will appear in the browser console).

With the Intershop PWA 8.0.0 release, the Tacton integration to handle complex product configuration scenarios was removed.
To keep the Tacton functionality in a PWA project, skip the removal commit when migrating to PWA 8.0.0.

With the Intershop PWA 8.0.0 release, the Sentry integration to client-side error monitoring was removed.
To keep the Sentry functionality in a PWA project, skip the removal commit when migrating to PWA 8.0.0.

Intershop PWA 8.0.0 introduces means to invalidate the [NGINX cache](./nginx-startup.md#cache) and the [Local ICM Cache](./ssr-startup.md#local-icm-cache) based on ICM page cache invalidation.
For further instructions on how to enable this functionality, see the [Cache Clearing](./nginx-startup.md#cache-clearing) section in the NGINX guide.

**Experimental** A new SSR environment switch `ALLOW_H2: 'true'` was introduced to enable the HTTP/2 protocol via Fetch API for REST requests done by the SSR container.

Intershop PWA 8.0.0 introduces the integration of CMS content pages into the My Account area (for further details see the [CMS Integration](../concepts/cms-integration.md#account-content-pages) guide).

To address token handling issues that occurred in Hybrid Approach scenarios, the `loadUserByAPIToken` action was changed to require a payload object with an optional `apiToken` as parameter.
The easiest way to migrate is to provide an empty object as parameter, e.g., `loadUserByAPIToken({})`.
To actually fix the Hybrid Approach token handling issues, the `apiToken` that is used to initialize the token handling is now provided with `loadUserByAPIToken({ apiToken: cookie.apiToken })` in the `restore$` functionality of the `ApiTokenService`.
The provided `apiToken` is now also used in the `getBasketByToken` method of the `BasketService` and the `getOrderByToken` method of the `OrderService` to initialize the token handling correctly by fetching new tokens from ICM in these cases too.

> [!TIP]
> The [Intershop Academy](https://public.academy.intershop.com/plus/catalog) (free registration required) offers a video tutorial on [how to migrate from version 7.0.0 to version 8.0.0](https://public.academy.intershop.com/plus/catalog/courses/452).

## From 7.0.0 to 7.1.0

Due to installation issues with the used `luarocks` package manager, we have disabled the installation of the `lua-resty-redis-connector` that provides the functionality to connect to a shared Redis cache.
Since this functionality cannot be used and has not been used by any project, disabling it is not considered a breaking change.

The structure of the elements that contained the `ngbNav` directive was updated to ensure compliance with accessibility standards.
It was previously based on `<ul>` with `<li role="presentation">` elements, now it uses `<nav>` with `<ng-container>` elements.

Page titles for the checkout and account pages were added to every single page for accessibility reasons.
The context _Checkout_ or _My Account_ is automatically appended to the relevant page titles in the `seo.effects`.

The `<ish-skip-content-link>` component was introduced to improve accessibility for listings by generating a skip link before the listing enclosed by the component.
The link is only visible when it receives keyboard tab focus, similar to the "Skip to main content" link.
The component can accept an HTML element ID as input parameter to specify which element should receive focus when the skip link is clicked.
If no valid HTML element ID is specified, the component generates an element after the listing that receives the focus.

The `RequisitionRejectDialogComponent` was moved from a `RequisitionDetailPageModule` specific component to a shared `RequisitionManagementModule` component.
This was necessary because it is now used not only on the requisition detail page, but also on the requisition approval list.

## From 6.0.0 to 7.0.0

The Intershop PWA 7.0.0 release contains the **SPARQUE suggest** and **SPARQUE search** functionality to improve the product search in the PWA.
The SPARQUE integration is disabled by default and requires a fitting SPARQUE configuration to enable it (for more details see the [SPARQUE.AI guide](./sparque-ai.md)).

To introduce the optional SPARQUE integration in the PWA, the following changes were necessary that need to be considered when migrating the PWA.

The `ProductImageComponent` was changed to an Angular standalone component that can be used independently of the `SharedModule`, but it is also available via the `SharedModule` in the same way as before.

The `CategoryImageComponent` was moved to the shared components folder and changed to an Angular standalone component.

An additional `ProductCompletenessLevel.Base` was introduced that is used as the new default in the `ProductContextFacade` and provides enough product data for the product suggest tiles.

The `SearchBoxComponent` was re-implemented as an Angular standalone component with the capability to show more suggestions (suggestions for products, categories, brands, and keywords).
With the introduction of the `SearchBoxComponent` as standalone component, its generated `LazySearchBoxComponent` is no longer needed and was therefore removed.
The behavior of the search box was changed as well.
Now the suggestion search will be dispatched once the search term has at least 3 letters (not for every character as before).

The previously used `SuggestTerm` model was replaced by the `Keyword` model.

| Previous                        | Current                                              |
| ------------------------------- | ---------------------------------------------------- |
| `SuggestTerm { term: string; }` | `Keyword { keyword: string;  totalCount?: number; }` |

The `SuggestService` has a changed result format and is now included in the effects via newly introduced `SuggestionsServiceProvider`.

The `ProductsService` has a changed parameter set for its `searchProducts()` method and needs to be integrated via newly introduced `ProductsServiceProvider`.

## From 5.3 to 6.0.0

The Intershop PWA 6.0.0 release contains functionality to improve the **accessibility** of the PWA.

To get an impression of the numerous adaptions needed to make the PWA more accessible, please check the [according pull request](https://github.com/intershop/intershop-pwa/pull/1694) and read the extended accessibility documentation available in the [Accessibility Guide](./accessibility.md) and the [Accessibility Easy Check](./accessibility-easy-check.md).
These changes will result in migration efforts and require PWA projects to adapt their customization as well.

A directive `ishFormSubmit` has been introduced for form html elements.
In case of validation errors, the focus is set to the first invalid form field after submit.
The logic to disable the submit buttons as long as the form is invalid has been simplified, using the `markAsDirtyRecursive` function is no longer necessary for formly forms.

The feature toggle `stickyHeader` has been added to enable or disable the sticky header.

The signature of the `ScriptLoader`'s `load` function was changed slightly.
The second parameter was changed from type `string` to `ScriptLoaderOption`.
The new type allows to set all options supported by the loader.

The Cybersource integration has been migrated to version 2 of the Microform API.
To utilize this integration, it is necessary to have an ICM with a Cybersource Service Connector 2.
Given that the support for [Microform v1 will come to an end on July 1, 2025](https://support.visaacceptance.com/knowledgebase/Knowledgearticle/?code=KA-07550), its support was terminated.

## From 5.2 to 5.3

The Intershop PWA 5.3.0 introduces a standard integration with Intershop Copilot for Buyers.
To enable the Copilot integration, the feature toggle `copilot` and the `copilot` configuration with fitting `copilotUIFile`, `chatflowid` and `apiHost` have to be configured.

The `updateUser` method of the `UserService` has been slightly refactored.
It now sends the user password in the request body to enable password validation on e-mail change.
The authorization header has also been removed, as authorization is done via session token.

The observable `isAppTypeREST$` of the `AppFacade` has been removed.
Previously, it has been used to determine whether the `privatecustomers` or the `customers` REST resource is needed to execute B2C user-related REST requests.
Now the `privatecustomers` REST resource is the new standard for B2C users.
If your ICM does not support the new standard, the method `getCustomerRestResource` of the [`app.facade`](../../src/app/core/facades/app.facade.ts) has to be adapted.

With ICM 12.2.0, 11.11.1 or 7.10.41.3, the ICM server itself provides an OCI Punchout URL (pipeline) that works better for the OCI Punchout functions `BACKGROUND_SEARCH` and `VALIDATE` than the now-deprecated functionality in the PWA.
For that reason, the provided OCI Punchout URL is now pointing to the ICM pipeline `ViewOCICatalogPWA-Start` that handles the different functionalities and redirects to the PWA (configured as _External Base URL_ in ICM) only for catalog browsing and the detail function.

The OPTION REST call to fetch the OCI Punchout configurations has been replaced by a GET REST request to avoid possible CORS errors (requires ICM 12.2.1 or above).

The OPTION REST call to fetch the eligible customer payment methods has been replaced by a GET REST requests to avoid possible CORS errors (requires ICM 11.10.0 or above).

For B2B customer account admins, it is now possible to configure budgets as either **net** or **gross**.
This setting will apply for both user and cost center budgets and is a setting on customer level.
It requires ICM 12.3.0 and is only visible if the ICM order approval service is running.
If the customer has not yet set the budget type, the default value **gross** is used.
In a migration project that uses an ICM before 12.3.0, in the `organization-settings-page.component.html` the `Preferences` section and the used dialog should be removed, and in the `budget-info.component.html` the suffix part `+ (suffix ?? '' | translate)` should be deleted.

We improved the Punchout REST call handling to consistently use the correct `Accept` header version for OCI Punchout (`application/vnd.intershop.punchout.v2+json`) and cXML Punchout (`application/vnd.intershop.punchout.cxml.v3+json`), see [#1746](https://github.com/intershop/intershop-pwa/pull/1746).
The new cXML Punchout version `v3` was introduced with ICM 12.2.0 for the cXML self-service configuration that was introduced with PWA 5.2.0.
For projects that use an ICM version before 12.2.0 (or ICM 7.10.x), you need to adapt the cXML Punchout `Accept` header (`punchoutHeaderCXML`) to `application/vnd.intershop.punchout.v2+json` to be compatible with the available cXML Punchout version `v2`.

The configuration parameter `METRICS_DETAIL_LEVEL` for the SSR container has been introduced.
By default it is set to the value `DEFAULT` which changes the SSR metrics (overall less metrics) compared to version 5.2.
In order to restore the previous behavior the value can be set to `DETAILED`.

The type of the `pm2_process_restarts` metric has been changed from _Gauge_ to _Counter_.

A password reveal button has been added to the formly password field following the [Microsoft Edge guidelines](https://learn.microsoft.com/en-us/microsoft-edge/web-platform/password-reveal#visibility-of-the-control).
Use the new formly field type `ish-password-novalidate-field` instead of the `ish-text-input-field` with `type="password"` if you want to define a password field without the password validator but with a reveal button (e.g., for password fields on the login form or password confirmation fields).

## From 5.1 to 5.2

> [!NOTE]
> The Intershop PWA 5.2.0 is implemented and configured to work out-of-the-box with ICM 12.0.0.
> This distinction is needed since the way encoded resource IDs are processed by ICM was changed in ICM 12.
>
> To use the fitting resource ID encoding for ICM 7.10 or ICM 11, the feature toggle `legacyEncoding` needs to be enabled.

The function `encodeResourceID` has been moved to a method `encodeResourceId` of the [`api.service`](../../src/app/core/services/api/api.service.ts), and it is now used to encode all dynamic resource IDs in any REST API call to ICM.
This was previously only done for the login, but is now consistently used for all resource IDs.
For ICM 7.10 and ICM 11, a duplicated `encodeURIComponent` encoding is applied.
For ICM 12 and newer, a single `encodeURIComponent` encoding with additional `+` character handling is used.
To migrate custom code, searching for `encodeResourceID(` and replacing it with `this.apiService.encodeResourceId(` is the first step.
In addition, any custom REST requests via the `ApiService` to ICM should be adapted to use `this.apiService.encodeResourceId()` for resource IDs in the path.
The RegEx `\/\$\{(?!this\.apiService\.encodeResourceId)` might be helpful to identify potential places within `*.service.ts` files to add the encoding in your custom code.
Please be aware when migrating that there is an intermediate [commit](https://github.com/intershop/intershop-pwa/commit/3e7c0ae2ff1d6e676f98d7c399b70b505f389e16) for the resource ID encoding in the 5.2 release that was improved with a later [commit](https://github.com/intershop/intershop-pwa/commit/TODO_with_release_creation) to work with the `legacyEncoding` feature toggle for ICM 7.10 and ICM 11 encoding not requiring any code adaptions anymore.

The store action and method `addBasketToNewOrderTemplate` of the OrderTemplatesFacade have been renamed to `createOrderTemplateFromLineItems` and refactored slightly.

The Intershop PWA specific Pipes `sanitize`, `makeHref` and `htmlEncode` were renamed using the common `ish` prefix that is used for the other custom Pipes as well.
When migrating, rename all occurrences of these Pipes to `ishSanitize`, `ishMakeHref` and `ishHtmlEncode`.
The code generation has been adapted to generate new Pipes from the beginning with the correct prefixes now.

A few Stylelint rules have been changed and the `.scss` files have been adapted.
`color-function-notation` has been changed to the default `modern` resulting in changed color notations from `rgba(0, 0, 0, 0.125)` to `rgb(0 0 0 / 0.125)`.
`scss/no-global-function-names` has been enabled resulting in changes, e.g., from `map-get($grid-breakpoints, 'xs')` to `map.get($grid-breakpoints, 'xs')` with the necessary `@use` references, or from `darken($color-label-new, 20%)` to `color.adjust($color-label-new, $lightness: -20%)`.
In addition, empty comments in `.scss` files are no longer allowed and have been removed.
In migration projects, either keep the Stylelint rules with the old settings or migrate all your styling files accordingly running `npm run format`.

With Intershop PWA version 5.2.0, the rendering of our demo/example view contexts was disabled by default.
Each integrated view context triggers a REST call that will potentially decrease the SSR rendering performance, something that is not necessary if this feature is not actively used in a PWA project.
For this reason, the examples were commented out in the source code and have to be activated in the project source code if needed.
See [CMS Integration - View Contexts](../concepts/cms-integration.md#view-contexts) for more information.

The `ExternalDisplayPropertiesProvider` `setup` notation has been changed from providing only the `product` context to providing a combined `{ product, prices }` context object.
For this reason, any custom `ContextDisplayPropertiesService` that implements the `ExternalDisplayPropertiesProvider` needs to be adapted accordingly (see the changes of #1657).

The dead code detection script has been improved and extended and is now checking Angular components in more detail.
This resulted in more variables and methods being declared as `private` and some unused code being removed.
This should not affect PWA-based projects as long as such internal declarations have not been used, else compiling will fail and the code would need to be adapted/reverted accordingly.

Product variations have been eagerly loaded via effects.
In projects with many variations, this can lead to performance issues, especially if the variation data is not needed for the current views.
For this reason, product variations are now loaded lazily through the following changes that might need adaptions with project customizations.

- The `variations` property on the product view interface has been removed. Variations can now be retrieved via the product context facade or the shopping facade.
- The `productMaster` property on the product view model has been removed. The master product should be individually retrieved.
- The `ish-product-item-variations` component has been refactored.

The Formly wrapper `textarea-description` has been renamed to the more appropriate name `maxlength-description`, and the rendering logic and compatibility to the general `description` wrapper has been improved.
The renaming should better convey the fact that this wrapper can be used not only for `ish-textarea-field` (where it is configured by default), but with other input field types as well.
Besides this, the main difference to the general `description` wrapper is its remaining `maxlength` calculation.
Together with the renaming, the implementation has been changed so that the description will only be rendered if the corresponding field has a `props.maxLength` value configured.
Additionally, the `props` key to provide an alternative translation key has been changed from `customDescription` to `maxLengthDescription`.
This change allows to use the `description` wrapper with its `customDescription` together with the `maxlength-description` wrapper with a customized `maxLengthDescription`.
When migrating customer projects, check to see if a `customDescription` is configured for an `ish-textarea-field`, and if so, replace it with `maxLengthDescription`.
You also need to check if the `textarea-description` wrapper is configured somewhere other than the default assignment to the `ish-textarea-field`.
If so, replace these wrapper configurations with `maxlength-description`.

B2B users with the permission `APP_B2B_MANAGE_ORDERS` (only available for admin users in ICM 12.1.0 and higher) now see the orders of all users of the company on the My Account order history page.
They can filter the orders by buyer in order to see, e.g., only their own orders again.

In preparation of the cXML Punchout self service configuration, we switched from a hidden route parameter that conveys the Punchout type context information to a URL query parameter (e.g., `?format=cxml`).
So customized routing within the Punchout area needs to be adapted accordingly.

## From 5.0 to 5.1

The OrderListComponent is strictly presentational, components using it have to supply the data.
The getOrders method of the OrderService does not fetch all related order data by default, you can provide an additional parameter to include the data you need.

For accessibility reasons, we use buttons instead of anchor tags for links that only trigger an action and are not intended for navigation purposes.
Note the following minor styling changes: use CSS classes `btn btn-link btn-link-action` for text links and `btn-tool btn-link` for icon links, (see [Accessibility guide/How to fix `'click-events-have-key-events`' problems](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/accessibility.md#how-to-fix-click-events-have-key-events-problems) for more details).

In ICM 11 the `messageToMerchant` flag can be configured in the back office and its setting is supplied by the `/configurations` REST call.
For this reason, the `messageToMerchant` feature toggle has been removed as a configurable feature toggle.
To still be able to configure the message to merchant feature via feature toggle in ICM 7.10 environments, an [`ICMCompatibilityInterceptor`](../../src/app/core/interceptors/icm-compatibility.interceptor.ts) has been introduced that can be enabled in ICM 7.10 based projects in the [`core.module.ts`](../../src/app/core/core.module.ts).
In addition, the `'messageToMerchant'` environment feature toggle option needs to be enabled in the [`environment.model.ts`](../../src/environments/environment.model.ts).

To address an Angular hydration issue ([#1585](https://github.com/intershop/intershop-pwa/pull/1585)), the `header` component rendering has been changed and, in addition, a `HeaderType` has been introduced for the standard header types `['simple', 'error', 'checkout']`.
If other header types are used in a project, these header types and the rendering need to be adapted accordingly.

With the introduction of the new [navigation CMS components](../concepts/cms-integration.md#navigation-cms-components) it became necessary to adapt the main navigation styling.
The styling can no longer rely on child selectors (`>`), since the CMS managed components introduce a lot of additional HTML tags around the styling-relevant `li` tags.

To improve the performance of the 'Static Content Page' component, the default behavior of the triggered `/pagetree` REST call regarding the used `depth` has been changed.
Previously, no 'Navigation Depth' specified in the Commerce Management configuration resulted in no limitation at all ("Define how many levels the navigation tree displays.
To show all levels, leave the field empty.").
With the content model adaptions of `icm-as-customization-headless:1.7.0`, a depth default value of `5` has been introduced and the description has been changed accordingly.
In the PWA, the rendering was adapted as well so that an empty `NavigationDepth` value of the 'Static Content Page' component now defaults to `0` instead of no depth limitation that resulted in the whole content page tree being fetched and saved to the state.
To keep the current behavior in an existing project, either adapt the `0` default in `pagelet.numberParam('NavigationDepth', 0)"` to a reasonable number or set the 'Navigation Depth' values for all 'Static Content Page' component instances in Intershop Commerce Management to reasonable depth values instead of leaving them empty.

The [Brotli NGINX module](https://github.com/google/ngx_brotli) is used instead of gzip for compression on the NGINX server now, see [NGINX Optimizations](./optimizations.md#nginx-optimizations).

The rendering of the [`CMSImageEnhancedComponent`](../../src/app/shared/cms/components/cms-image-enhanced/cms-image-enhanced.component.ts) has been changed and is no longer loading the image with `loading="lazy"` by default.
See the [Enhanced Image Teaser section in "Guide - Core Web Vitals"](./core-web-vitals.md#enhanced-image-teaser) for further information.

## From 4.2 to 5.0

Starting with the Intershop PWA 5.0 we develop and test against an Intershop Commerce Management 11 server.
For this reason the official Intershop Commerce Management requirement is now ICM 11 even though the PWA 5.0 will continue to work with current ICM 7.10 versions as well.
In the [changelog](../../CHANGELOG.md) of this project we will inform about features that will only work with ICM 11 or ICM versions above 7.10.38.x-LTS releases.
With the transition to ICM 11 the configured default `icmBaseURL` is now `'https://develop.icm.intershop.de'`.

With the switch to ICM 11 we switched to ICM deployments without the Responsive Starter Store as well.
Because of this, the default `icmApplication` is now configured to `'-'`.
For ICM deployments with the Responsive Starter Store this probably has to be configured as it was before with `'rest'`.

The project has been updated to work with Angular 16.
Besides this, a lot of other dependencies (NgRx, Typescript) have also been updated.

The spelling of the OCI Punchout actions has changed due to a changed naming schema of the NgRx action creator functions.

Since `defaultProject` is no longer a valid option in `angular.json`, it has been removed and the root project (project with an empty root) is used instead.

We enabled the [Angular Hydration](https://v16.angular.io/guide/hydration) to improve performance and prevent the UI from flickering when a page renders - please note that this feature is still in developer preview and may have some limitations.

From this version, we use the [`takeUntilDestroyed`](https://angular.love/takeuntildestroy-in-angular-v16) operator to complete observables when the calling context (component, directive, service, etc.) is destroyed.
The `add-destroy` schematic has been removed but you can keep the `takeUntil(destroy$)` mechanism for a transitional period.
A [migration script](../../scripts/migrate-destroy-subject.ts) is created to support the migration to the new way to complete open observable subscriptions on destroy.
This script can be executed with `npx ts-node .\scripts\migrate-destroy-subject.ts`.
Please review all changes after running the script and make sure all files work as expected.
Also, any unused imports within the files must be removed (`npm run lint --fix` can be used).

We added the ESLint rule `@angular-eslint/template/prefer-self-closing-tags` to use self-closing tags in HTML files (`npm run lint --fix` can be used to update your HTML files).

The `ngcc` command has been removed from the `package.json` because it is no longer supported or needed in Angular 16.

Mandatory component input parameters are declared as [required](https://angular.io/guide/update-to-version-16#required-inputs) to ensure that all required data is provided.
This enforces data dependencies and catches potential errors during compilation.

For the optional use of a shared Redis cache we switched from the plain standard NGINX Docker image to an [OpenResty](https://openresty.org/en/) Docker image, which provides more flexibility in configuring the underlying NGINX.
If the NGINX container has been customized in the project, you need to check that these customizations work with the OpenResty image in the same way.
Without any customizations, the switch should be unnoticeable and does not require any adaptions.

The input parameter `id` for the product listing component is now called `productListingId` to avoid unintentionally having more than one element with the same ID in the HTML document.
The _api-token.service_ has been refactored and the class variables `apiToken$` and `cookieVanishes$` have the `private` modifier.
Use the public getter/setter methods to access these variables outside the class.

Basket line-item functionalities have been extracted from the `basket.service` into a separate `basket-items.service`.
The action `UpdateBasketLineItems` as well as the `LineItemUpdateHelper` have been removed because they were unused for a long time.

## From 4.1 to 4.2

The basket attribute `orderReferenceId` is now saved as native attribute `externalOrderReference` at the basket, but it still exists at the basket and can still be displayed if required.

A better handling of cookie `SameSite` and `secure` settings was implemented with new defaults to `SameSite=Strict` and `secure`.
This can still be overridden by calling the `cookies.services` `put` method with explicitly set values.
The `secure` setting is now always set to `true` when in `https` mode.
You can prevent this by explicitly setting it to `false`.
If the PWA is run in `http` (which should only be in development environments), `secure` is not set.
Additionally, if the PWA is run in an iframe, all cookies are set with `SameSite=None` (e.g., for Punchout or Design View).
Be aware that some browsers will not accept cookies with `SameSite=None` without `secure`.
Previously, no `SameSite` was set by default, so browsers treated it as `SameSite=Lax`.
This needs to be set explicitly now if it is really intended.
To migrate, check if the `cookies.service` `put` method calls need to be adjusted.

The user's language selection is now saved as a cookie (`preferredLocale`) and restored after the PWA has loaded.
This functionality can be enabled or disabled with the feature toggle `saveLanguageSelection`.

## From 4.0 to 4.1

The Intershop PWA now uses Node.js 18.16.0 LTS with the corresponding npm version 9.5.1 to resolve an issue with Azure Docker deployments (see #1416).

As a leftover adaption regarding the switch from deprecated class-based route guards in favor of functional guards, the `addGlobalGuard` function was adapted to work with functional guards.
If the `addGlobalGuard` function is used for customizations, make sure it now works as expected.

The input parameter `id` of the component `ish-product-quantity` caused issues with duplicate IDs within the page's html.
Therefore, it was renamed to `elementId`.
If the input parameter `id` of this component has already been used, it has to be renamed accordingly.

The `ishIntersectionObserver` returns all three `IntersectionStatus` change events: `Visible`, `Pending`, and `NotVisible` as well now.
The custom project code needs to be adapted if it does not filter the events where it is used (e.g., `if (event === 'Visible')`).

The two standard themes `b2b` and `b2c` where refactored in such a way that the `b2c` theme could be changed into a [configurable theme](./themes.md#configurable-theme) that uses CSS custom properties (CSS variables).
Since SCSS color calculations do not work with CSS custom properties (they need real values instead of `var(--corporate-primary)`), SCSS functions like `darken()` and `lighten()` were removed from the standard Intershop PWA SCSS styling.
Existing projects that do not want to use a configurable theme do not need to apply these changes to their custom styling.

To use the new [configurable theme](./themes.md#configurable-theme) feature, the feature toggle `extraConfiguration` needs to be enabled.

A new `TokenService` is introduced, which is only responsible for fetching token data from the ICM.
However, all necessary adaptions for the identity providers and the `fetchToken()` method of the UserService are removed in order to be completely independent of `TokenService`.
If your identity providers should use the `OAuthService` to handle the authentication, please make sure to instantiate a new `OAuthService` entity within the identity provider.
The `getOAuthServiceInstance()` static method from the `InstanceCreators` class can be used for that.
Furthermore, the handling of the anonymous user token has been changed.
It will only be fetched when an anonymous user intends to create a basket.

We added an Address Doctor integration as a new extension which can be enabled with the feature toggle `addressDoctor` and [additional configuration](./address-doctor.md).

## From 3.3 to 4.0

The Intershop PWA now uses Node.js 18.15.0 LTS with the corresponding npm version 9.5.0 and the `"lockfileVersion": 3,`.
For migrating the `package-lock.json`, it is always advised to use the `package-lock.json` from the Intershop PWA and then run `npm install` to update it with the additional custom dependencies from the customer project's `package.json`.

The project was updated to work with Angular 15.
This includes the removal of the Browserslist configuration and an updated TypeScript compiler `target` and `lib` to `ES2022` (for browser support requirements that differ from the Angular 15 standard configuration, see the [configuring browser compatibility](https://angular.io/guide/build#configuring-browser-compatibility) guide and the [TypeScript configuration](https://angular.io/guide/typescript-configuration) reference).
Adaptions of the Schematics configurations and tests were also necessary.
In addition, all other dependencies were updated as well and resulted in necessary Stylelint and Jest test adaptions.

The placeholder for theme-specific assets and styles has been changed from `placeholder` to `theme_placeholder`.
If this is used in any customization, update all paths which are using the old theme placeholder, e.g., `src/styles/themes/placeholder` to `src/styles/themes/theme_placeholder`.

The injection token `LOCAL_TRANSLATIONS` was introduced to use local translation files within the custom [ICM translation loader](https://github.com/intershop/intershop-pwa/blob/4.0.0/src/app/core/utils/translate/icm-translate-loader.ts).
A factory function is provided in the [`internationalization.module.ts`](https://github.com/intershop/intershop-pwa/blob/4.0.0/src/app/core/internationalization.module.ts) to decide which json file with translation keys should be used for a given language.

```typescript
  providers: [
    ...
    {
      provide: LOCAL_TRANSLATIONS,
      useValue: {
        useFactory: (lang: string) => {
          switch (lang) {
            case 'en_US':
              return import('../../assets/i18n/en_US.json');
            case 'fr_FR':
              return import('../../assets/i18n/fr_FR.json');
            case 'de_DE':
              return import('../../assets/i18n/de_DE.json');
          }
        },
      },
    },
  ],
```

Please adapt the `useFactory()` function to return all imported local translation files depending on the `lang` parameter.

With Angular 15 class-based route guards are deprecated in favor of functional guards.
Thus, we removed the guard classes and replaced them by functions.
For the `canActivate/canChildActivate` methods, only change the class name into the function name by lowercasing the first letter, e.g.,

```typescript
{
  path: 'organization-management',
  ...
  canActivate: [AuthGuard],
  canActivateChild: [AuthGuard],
}
```

will become

```typescript
{
  path: 'organization-management',
  ...
  canActivate: [authGuard],
  canActivateChild: [authGuard],
},
```

For more information about functional guards, see this [blog article](https://blog.angular.dev/advancements-in-the-angular-router-5d69ec4c032).

With the [Prettier update to version 2.8](https://prettier.io/blog/2022/11/23/2.8.0.html#angular) the format of pipes in HTML files changed slightly.

After updating [Jest to version 29](https://jestjs.io/docs/upgrading-to-jest29#snapshot-format) the default snapshot formatting changed.
Run `npm run test -- -u` to update your test snapshots.

The account navigation has been reworked to support navigation grouping (used in `b2b` theme, see [`account-navigation.items.ts`](https://github.com/intershop/intershop-pwa/blob/4.0.0/src/app/pages/account/account-navigation/account-navigation.items.ts)).
For better maintainability and brand-specific overriding, the account navigation items were externalized in an extra file `account-navigation.items.ts` used by the `account-navigation.component.ts`.
With this rework also the navigation items data structure was changed from a key value object to a simpler `NavigationItem` array.
With this data structure accessing the data was changed for the key access from `item.key` to `item.routerLink`, or for the value example from `item.value.localizationKey` to `item.localizationKey`.
To migrate to this new account navigation item handling, any account navigation customization needs to be adapted accordingly.

The deprecated SSR environment variable `ICM_IDENTITY_PROVIDER` was completely removed.
Use the variable `IDENTITY_PROVIDER` instead to select the identity provider to be used if it is not the default `ICM`.
We removed the default `identityProvider` configuration from `environment.model.ts`, so only the hardcoded fallback from `configuration.effects.ts` works as fallback.

The deprecated properties `templateOptions` and `expressionProperties` have been removed from the `FormlyFieldConfiguration` object.
Current projects **must** use the new properties for all formly field configurations.
You **must** adapt html templates, too, when using the deprecated properties in there.

To replace deprecated formly field properties, you can execute the new `formly-migrate` schematic.
Please run the following command for each configured Angular project (e.g., 'intershop-pwa'):

```console
  ng g formly-migrate --project=${ANGULAR_PROJECT}
```

> [!NOTE]
> Not all scenarios where a deprecated property could be found are taken into consideration for the `formly-migrate` schematic. Please check and adapt your code manually for additional changes. For further information, see the [formly migration guide](https://formly.dev/docs/guide/migration/).

The templates of `account-order-template-detail-page.component.ts`, `quote-line-item-list.component.ts`, `quoting-basket-line-items.component.ts`, and `account-wishlist-detail-page.component.ts` have been updated to ensure correct DOM element updates for `ngFor` loop changes.
A [trackBy function](https://angular.io/api/core/TrackByFunction) will be used now.

Obsolete functionality that is no longer needed with the current state of the Intershop PWA was removed from the project source code:

- Removed outdated `kubernetes-deployment` schematic that could be used to create Kubernetes charts. Use the official [Intershop PWA Helm Chart repository](https://github.com/intershop/helm-charts/tree/main/charts/pwa) instead.
- Removed unused `azure-pipeline` schematic that could be used to create an Azure Pipeline template based on the generated Kubernetes charts for DevOps.
- Removed migration scripts that were used for pre PWA 1.0 migration support.
- Removed obsolete TODO comments and related logic that handled, for example, wrong/odd/old REST API quirks.

We recommend to use the Action Group Creator to create store actions now.
Therefore, the corresponding store schematic for the action creation has been adapted.

We added some helper methods to improve the use of dependency injection.
Use the method `createEnvironmentInjectionToken` now to define new injection keys for environment variables in the `injection-keys.ts`.
If you want to inject a token, use the methods `injectSingle` and `injectMultiple` to secure the type safety of your injected variables (except for Angular core tokens, which are forced to a type).
There is a new linting rule `useTypeSafeInjectionTokenRule` that enforces the usage of these methods.
For more information, see the [Configuration Concept](../concepts/configuration.md#angular-cli-environments).

We introduced the product notifications feature as a new extension which can be enabled with the feature toggle `productNotifications`.

## From 3.2 to 3.3

To improve the accessibility of the PWA in regards to more elements being tab focusable, a lot of `[routerLink]="[]"` where added to links that previously did not have a link reference.
Also some `(keydown.enter)` event bindings with `tabindex="0"` were added to ensure a better interactivity with the keyboard only.
If the according commits lead to problems, they could be skipped and resolved later by fixing the accessibility linting issues manually.
More information regarding accessibility in the PWA and the used ESLint rules can be found in the [Accessibility Guide](./accessibility.md).

## From 3.1 to 3.2

A styling adaption was made to the application shell to expand it to the full page height, so the footer now always stays at the bottom.
Together with that an inline style of the `main-container` was moved to the global styling definition.

Formly has been upgraded from version 5 to 6.
For more information, see the [Formly Upgrade Guide](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-6.0.md).
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
Regarding this, the logout action triggers a service which revokes the currently available access token on the ICM back office.
If the logout was successful, all personalized information is removed from the ngrx store.
Please use `logoutUser({ revokeToken: false })` from the account facade or dispatch `logoutUserSuccess` instead of the `logoutUser` action to use the old behavior.

## From 3.0 to 3.1

The SSR environment variable `ICM_IDENTITY_PROVIDER` will be removed in the next major release (PWA 4.0).
Use variable `IDENTITY_PROVIDER` to select the provider to be used instead.
Keep this in mind before deploying or starting the Intershop PWA in server-side rendering mode.

The default value of the input parameter ['queryParamsHandling'](https://angular.io/api/router/QueryParamsHandling) has been changed from `'merge'` to `''` for the components `product-name.component` and `product-image.component`.
This has been done to prevent an unintentional application of filters for product variation master links if the product detail link does not originate from a product listing context (product list page, search result page).

To prevent deprecation warnings, we removed the unnecessary `~` from all 3rd party SCSS imports (see https://webpack.js.org/loaders/sass-loader/#resolving-import-at-rules - "Using ~ is deprecated and can be removed from your code (we recommend it)").
This should be done for additional imports in the customizations as well.

The validator `equalToControl` did not work properly.
For that reason we removed it.
Use the validator `equalTo` instead.
For more information, see the method description in the [`special-validators.ts`](https://github.com/intershop/intershop-pwa/blob/3.0.0/src/app/shared/forms/validators/special-validators.ts#L82-L87).

The "Product Image Not Available" PNG image `not_available.png` is removed and replaced by an SVG image `not-available.svg` which does not include a text inside the image anymore to avoid localization issues.
The file references are updated accordingly, the product image component is updated to use the correct image attributes, a localized alternative text is added, and the product and image mapper files are updated to provide the correct data.
In case the current PNG image file and the handling is customized in a project, you have to ensure to keep the project changes.

## From 2.4 to 3.0

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
For more information, see the [Cypress Migration Guide](https://docs.cypress.io/guides/references/migration-guide#Migrating-to-Cypress-version-10-0).

Since the used deferred load library is no longer maintained, it is removed and has been replaced with similar standard browser functionality [`loading="lazy"`](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading#images_and_iframes).
All uses of the `(deferLoad)` directive in custom code need to be replaced.

We removed the unmaintained `angular2-uuid` library in favor of the standard `uuid` library that is already included as an Angular dependency.
In order to match our changes, replace all occurrences of `angular2-uuid` in your custom code (see #1203).

The [pagespeed module](https://www.modpagespeed.com) of NGINX has been removed without replacement.

The [@ngx-translate/http-loader](https://github.com/ngx-translate/core) dependency was removed since we did not use it.
You might need to keep this dependency if you are loading translations differently from the standard Intershop PWA in your customization.

The deprecated `customized-copy` schematic for copying components and replacing all usages was removed.

We introduced a build variable `SSR` that is now used for all checks if the application is running in SSR or browser context.
We no longer use the verbose way of injecting the `PLATFORM_ID` and check it with the methods `isPlatformBrowser` or `isPlatformServer`.
This way still works but it is discouraged by a new ESLint rule that suggests using the new `SSR` variable instead.
So running `npm run lint` will help finding custom code that still relies on the platform checks.

To support, e.g., special characters in e-mail addresses with newer versions of ICM (7.10.38.x), like `+`, double encoding of resource IDs in the REST API calls is necessary.
With the method `encodeResourceID` we provide a central place that implements the fitting resource encoding.
In the PWA this was applied to all user logins in REST API calls.
For project customizations, the usage of the native `encodeURIComponent` functionality should be replaced with `encodeResourceID` for user logins in REST calls as well.

The `footer.content` localization key was replaced for most of its content by a CMS manageable content include `include.footer.content.pagelet2-Include` that is available from ICM 7.10.38.9-LTS.

For better Search Engine Optimization the route formate and route handling for products, categories, and content pages has been reworked.
All these routes now contain hierarchies and have different ID markers.
For categories it was changed from `cat` to `ctg` and for products from `sku`to `prd`.
This way, it is intended to have less conflicts and limitations with potential category/product IDs, e.g., 'cats' or 'skunks'.

To improve the support of large baskets we update the ngrx store immediately after adding, updating, and deleting basket items now.
Therefore, we had to change the return values of the corresponding basket service functions as well as the payload of the success actions.
We also limited the number of displayed line items in the mini basket and introduced a paging bar on the basket page to speed up the rendering of these components.

## From 2.3 to 2.4

The PWA 2.4 contains an Angular update to version 13.3.10 and many other dependencies updates.
These updates did not require any updates to the PWA source code.
But it needs to be checked if this is true for your project customizations as well.

We introduced a checkout guard that protects the checkout routes in case no shopping cart is available and navigates back to the empty basket page.

Routes to non-existing CMS content pages now result in a "Page Not Found" error page.

The 'ratings' functionality (components concerning the display of product ratings) has been moved into an extension using the existing feature toggle 'ratings'.

With the display of product reviews the attribute 'numberOfReviews' has been added to the product model, and the number of reviews is displayed behind the product rating stars now instead of the average rating that is already depicted in the stars.

## From 2.2 to 2.3

The 'contact us' functionality has been moved into an extension and we have introduced the feature toggle `contactUs` in the `environment.model.ts` that is switched on by default.

The `getFilteredProducts` method has been moved from the `FilterService` to the `ProductsService`, since the `/products` API is used.
Together with this change, the default product attributes for product listings have been externalized and are easily overridable now.

With [#1135](https://github.com/intershop/intershop-pwa/pull/1135), the default model representation used by `NgbDatepicker` is the native ES6 `Date` now.
During this refactoring, the `DateHelper` class has been removed. **This will not concern you if you use `ish-date-picker-field` directly**.
However, if you use `NgbDatepicker` outside of formly, some helpers you might have used are gone.
Please use the underlying functions from `Date`, [`NgbCalendar`](https://ng-bootstrap.github.io/#/components/datepicker/api#NgbCalendar) and [`date-fns`](https://date-fns.org) directly, or create your own `DateHelper`.

## From 2.1 to 2.2

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

## From 2.0 to 2.1

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

## From 1.4 to 2.0

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
- https://v7.swiperjs.com/migration-guide

To help with the necessary rxjs refactorings, consider using [rxjs-fixers-morph](https://github.com/timdeschryver/rxjs-fixers-morph).
Simply run `npx rxjs-fixers-morph ./tsconfig.json`.

## From 1.1 to 1.2

The `dist` folder now only contains results of the build process (except for `healthcheck.js`).
You must **not** edit any file inside that `dist` folder, since this would include not being able to change Kubernetes liveness or readiness probes we included SSR container related source code under `src/ssr/server-scripts/`

## From 0.31 to 1.0

The Angular configuration mechanism of the Intershop PWA was refactored to support running multiple configurations in one Docker image (see [Guide - Multiple Themes](./themes.md)).
This now means that the former `environment.local.ts` which had a standalone configuration can no longer be supported.
Instead, theme-specific environments exist for `default` and `blue`, and development settings can be overridden in `environment.development.ts`, which are imported into the theme-specific configurations (see [Guide - Development](./development.md#development-server)).
`npm install` will create an initial version of the `environment.development.ts` that can be filled with the needed information from `environment.local.ts`.
The `environment.local.ts` itself becomes obsolete and can be deleted.

Locale definitions in `environment.ts` models are no longer supported, only ICM channel configurations are now used for switching locales.

## From 0.29 to 0.30

We introduced the feature toggle 'guestCheckout' in the `environment.model.ts`.

We switched to encode user logins when used in the api service.
This is to enable special characters (like the #) that are sometimes present in user logins (SSO case!) but would have led to errors before.

## From 0.28 to 0.29

We activated TypeScript's [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny).
Please refer to the [Type Safety](./getting-started.md#type-safety) part in the Getting Started Guide for motivations.

## From 0.27 to 0.28

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

## From 0.26 to 0.27

We upgraded Cypress from Version 4 to 6 and followed all migrations in their [Migration Guide](https://docs.cypress.io/guides/references/migration-guide).

We have introduced a [Context Facade](../concepts/state-management.md#context-facades) for product entities and [refactored](https://github.com/intershop/intershop-pwa/pull/403) most of the components that are specific to a single product.
This includes:

- Targeted components no longer require a `product` input, as they retrieve the product from the context.
- The handling for adding products to the basket was refactored and simplified.
- Product quantity handling moved almost completely to the context.
- The decision for displaying certain components on product tiles and rows also moved into the context.

## From 0.25 to 0.26

The project configuration was updated to use and test with Node.js version 14.15.0 LTS (including npm 6.14.8) for any further development.

We upgraded the Intershop PWA to use Angular 11.
With that a breaking change was introduced.
The [RouterModule's `relativeLinkResolution` property changed](https://angular.io/api/router/ExtraOptions#relativeLinkResolution) from `legacy` to `corrected`.
We could not detect any impact for the PWA itself but custom code might have to be adapted.

We removed the Intershop PWA mock-data, as there are currently public servers provided for testing and exploring.
The handling for mocking REST API calls during development is hereby untouched.
The Angular CLI environment property `mockServerAPI` became obsolete, the property `mustMockPaths` was renamed to `apiMockPaths`.

## From 0.24 to 0.25

We replaced the simple [ngx-cookie-banner](https://github.com/exportarts/ngx-cookie-banner) cookie banner with an own implementation that provides the means to configure and set more fine grained cookie consent options.
A basic configuration is already provided.
The cookie consent configuration and usage is documented in our [Cookie Consent Guide](./cookie-consent.md).
With this change it is necessary to adapt all uses of the `cookiesService.cookieLawSeen$` observable with the new synchronous method - `cookiesService.cookieConsentFor('tracking')` - provided to check for the required cookie consent.

We reworked the configuration format for setting up multiple channels in the nginx to enable context-path support.
Multiple `PWA_X_` environment properties are no longer supported, instead a structured configuration has to be supplied.
For more information, see [Nginx documentation](./nginx-startup.md).

## From 0.23 to 0.24

We introduced a [localization file clean up script](../concepts/localization.md#localization-file-clean-up-process) that removes all unused localization keys from the localization files and sorts the remaining keys.
The clean up result is contained in a separate commit that should probably not be applied during a migration and instead a `npm run clean-localizations` should be performed on the project sources.

We renamed the testing helper `findAllIshElements` from [`ish-core/utils/dev/html-query-utils`](../../src/app/core/utils/dev/html-query-utils.ts) to `findAllCustomElements` to support project customization.
The returned lists from `findAllCustomElements` and `findAllDataTestingIDs` are no longer sorted to represent the actual template structure.

With Angular version 10.1, the testing utility [async](https://angular.io/api/core/testing/async) was [deprecated](https://github.com/angular/angular/commit/8f074296c2ffb20521e2ad1bbbb3dc8f2194cae6).
We refactored our code base to use native async/await instead, which was possible in all cases.
The TSLint rule `use-new-async-in-tests` takes care of automatically transforming TestBed initialization code in component tests.
Other cases have to be refactored manually.

## From 0.22 to 0.23

We removed deprecated exports related to the NgRx testing refactorings introduced in version 0.21.

We switched our main development to the new headless REST application type provided by ICM 7.10.21.0.
If you are upgrading and want to continue using the Responsive Starter Store application types, do not cherry-pick the [commits that switch application types](https://github.com/intershop/intershop-pwa/compare/a63d2a2fc1ffdb404e6b1fe8ffb79310fa2ef60f...741454c8c839dd001a3943236172d75ffd05541d).

We refactored the way ICM Http Errors are handled in the PWA.
You can read about it [here](./icm-http-error-mapping.md).
Tests emulating HTTP errors now have to use the helper function `makeHttpError` from [`ish-core/utils/dev/api-service-utils`](../../src/app/core/utils/dev/api-service-utils.ts).

We removed grouping folders of shared components in extensions and sub projects for a better overview.
You can migrate using the script `node schematics/migration/0.22-to-0.23` (for running this script Git version 2.28 or above is recommended since earlier versions resulted in problems).

## From 0.20 to 0.21

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

## From 0.19.1 to 0.20

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

## From 0.18 to 0.19

We migrated from using [ngrx-router](https://github.com/amcdnl/ngrx-router) to the official and better supported [@ngrx/router-store](https://ngrx.io/guide/router-store).
This means that throughout the code all usage of the `ofRoute` operator and `RouteNavigation` actions are no longer available.

As some of these implementations were very specific, we cannot provide a migration script.

## From 0.16 to 0.17

In this version change, we decided to no longer recommend the container-component-pattern and, therefore, changed the folder structure of the project.

We did this, because the previously introduced facades provide a more convenient way to interact with the state management and more and more logic was moved out of containers, hence removing all ngrx-related imports there.

You can run the migration by executing `node schematics/migration/0.16-to-0.17`.

The script will check if all your components can be moved to the new folder structure and will then perform the migration or notify you of work previously needed.
