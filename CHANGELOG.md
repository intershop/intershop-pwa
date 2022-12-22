<!--
kb_sync_latest_only
kb_pwa
kb_releasenote
kb_everyone
-->

# Changelog

## [3.2.0](https://github.com/intershop/intershop-pwa/releases/tag/3.2.0) (2022-12-22)

**required Intershop Commerce Management version: 7.10.38.11-LTS**

**required/tested Node.js version: 16.16.0 LTS (including npm 8.11.0)**

### Features

- use ICM '/token' REST endpoint for authentication (#1156) ([4e02efd](https://github.com/intershop/intershop-pwa/commit/4e02efd))
- introduce additional components for product variation select display (#1317) ([ddd6e2e](https://github.com/intershop/intershop-pwa/commit/ddd6e2e))
- introduce variation attribute mapping with extended /variations call (#1317) ([d9e4b17](https://github.com/intershop/intershop-pwa/commit/d9e4b17))
- provide and combine metrics of theme instances (#1340) ([88b4206](https://github.com/intershop/intershop-pwa/commit/88b4206))
- route to product detail page if only one search result was found (#1316) ([9964ebd](https://github.com/intershop/intershop-pwa/commit/9964ebd))
- save desired delivery date at basket items (#1325) ([f8fba29](https://github.com/intershop/intershop-pwa/commit/f8fba29))
- add zebra striped table style for attributes in product details tab (#1326) ([7999f02](https://github.com/intershop/intershop-pwa/commit/7999f02))
- customer address update in the My Account section (#1315) ([a98d391](https://github.com/intershop/intershop-pwa/commit/a98d391))

### Bug Fixes

- apply ordered-import rule on multiline import statements (#1344) ([5887c41](https://github.com/intershop/intershop-pwa/commit/5887c41))
- prevent outdated basket information on /basket route (#1342) ([1a730f8](https://github.com/intershop/intershop-pwa/commit/1a730f8))
- remove check for variations or variation master data for variation product data handling ([41e674f](https://github.com/intershop/intershop-pwa/commit/41e674f))
- error when submitting consecutive search after submitting search from search suggestion (#1332) ([9d063a9](https://github.com/intershop/intershop-pwa/commit/9d063a9))
- add SSR hybrid backend configuration option for kubernetes deployments (#1320) ([3e293fa](https://github.com/intershop/intershop-pwa/commit/3e293fa))
- prevent budget bar arrow and product label ribbons to be shown in the subcategories layer (#1329) ([7f4d34c](https://github.com/intershop/intershop-pwa/commit/7f4d34c))
- replace the product label image sprite, use CSS only styling and localized HTML text (#1319) ([7f63863](https://github.com/intershop/intershop-pwa/commit/7f63863))
- replace the empty cart image with pure CSS and remove the image file (#1319) ([eebebec](https://github.com/intershop/intershop-pwa/commit/eebebec))
- remove active_catalog.png and budget-bar-indicator.png and replace with CSS styling (#1319) ([9aeafaf](https://github.com/intershop/intershop-pwa/commit/9aeafaf))
- display company input fields for anonymous b2b users on checkout edit address form (#1312) ([23a9257](https://github.com/intershop/intershop-pwa/commit/23a9257))
- change and display an anonymous user`s email during the checkout process (#1312) ([b2c265b](https://github.com/intershop/intershop-pwa/commit/b2c265b))
- validate email during the checkout process of an anonymous user (#1312) ([5ba41ec](https://github.com/intershop/intershop-pwa/commit/5ba41ec))
- apiToken cookie should be shared between same host (#1321) ([80d5f9d](https://github.com/intershop/intershop-pwa/commit/80d5f9d))
- add promotion scope to the validation of the first basket checkout step (#1322) ([8da52d6](https://github.com/intershop/intershop-pwa/commit/8da52d6))
- keep the footer at the bottom of the page (#1318) ([feb1648](https://github.com/intershop/intershop-pwa/commit/feb1648))
- 'npm install' not working with PWA release zip file (#1314) ([33be4cc](https://github.com/intershop/intershop-pwa/commit/33be4cc))
- display login modal after authentication token has expired (#1280, #1311) ([025818c](https://github.com/intershop/intershop-pwa/commit/025818c))
- add matrix parameter spgid to promotion REST calls (#1310) ([1cae0d8](https://github.com/intershop/intershop-pwa/commit/1cae0d8))

### Documentation

- improve authentication documentation (#1156) ([cf89956](https://github.com/intershop/intershop-pwa/commit/cf89956))
- extend PurgeCSS integration documentation (#1313) ([d4db9d6](https://github.com/intershop/intershop-pwa/commit/d4db9d6))

### BREAKING CHANGES

- PWA uses the ICM `/token` REST endpoint to retrieve user token, every anonymous user will get a anonymous user token, every identity provider has to configure the `oAuthService` with information about the token endpoint, before expiration the given token should be refreshed.
- Changed the rendering of the `ProductVariationSelectComponent` and introduced additional product variation select rendering components (see [Migrations / 3.1 to 3.2](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#31-to-32) for more details).
- `ProductsService` was changed to use an `extended=true` details and variations call. `VariationAttribute` model was cleaned up and extended (see [Migrations / 3.1 to 3.2](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#31-to-32) for more details).
- The product label ribbon image is replaced with localized text and CSS styling.
- The empty cart image is removed and replaced with localized text and CSS styling.
- The `active_catalog.png` and `budget-bar-indicator.png` are removed and replaced with CSS styling.
- Formly has been upgraded from version 5 to 6 (see [Migrations / 3.1 to 3.2](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#31-to-32) for more details).

## [3.1.0](https://github.com/intershop/intershop-pwa/releases/tag/3.1.0) (2022-10-17)

**required Intershop Commerce Management version: 7.10.38.11-LTS**

**required/tested Node.js version: 16.16.0 LTS (including npm 8.11.0)**

### Features

- add customer approval handling (#1284) ([2c6ac07](https://github.com/intershop/intershop-pwa/commit/2c6ac07))
- add personal data request handling - GDPR (#1214) ([b8ba675](https://github.com/intershop/intershop-pwa/commit/b8ba675))
- support for two separate applications in hybrid mode (#1289) ([6b99953](https://github.com/intershop/intershop-pwa/commit/6b99953))
- show inactive flag for cost center users (#958, #1283) ([752e38e](https://github.com/intershop/intershop-pwa/commit/752e38e))
- add html text formly field type ([295e122](https://github.com/intershop/intershop-pwa/commit/295e122))
- display server error page if the loading of the server configuration fails ([856b3f7](https://github.com/intershop/intershop-pwa/commit/856b3f7))
- display a maintenance page if a http error 503 occurs (#1111) ([27d937a](https://github.com/intershop/intershop-pwa/commit/27d937a))
- add specific header component for error pages ([a461e35](https://github.com/intershop/intershop-pwa/commit/a461e35))
- add "no server side rendering" guard to protect routes that should not be rendered in SSR (#1277) ([e0cbc91](https://github.com/intershop/intershop-pwa/commit/e0cbc91))
- extended default mobile listing view type environment configuration (#1268) ([713675e](https://github.com/intershop/intershop-pwa/commit/713675e))
- add default mobile listing view type environment configuration (#1243) ([e4ec8e7](https://github.com/intershop/intershop-pwa/commit/e4ec8e7))

### Bug Fixes

- replace the PNG image with a self explaining SVG image without text (#625, #1296) ([9a984da](https://github.com/intershop/intershop-pwa/commit/9a984da))
- product list after a logged in user clicked a filter navigation link on family page (#1300) ([ef8e2ba](https://github.com/intershop/intershop-pwa/commit/ef8e2ba))
- equality validation of input fields like password/passwordConfirmation (#1297) ([7895931](https://github.com/intershop/intershop-pwa/commit/7895931))
- prevent filter changes when opening sign in popup (#468, #1286) ([ef234c1](https://github.com/intershop/intershop-pwa/commit/ef234c1))
- display filter navigation after page refresh with logged in user (#1232, #1286) ([c6bbe51](https://github.com/intershop/intershop-pwa/commit/c6bbe51))
- show mini cart animation after add quote to cart (#1041, #1287) ([a1cf6c8](https://github.com/intershop/intershop-pwa/commit/a1cf6c8))
- explicitly set breadcrumb data when using the Static Content Page Component (#1250) ([efa1323](https://github.com/intershop/intershop-pwa/commit/efa1323))
- account pages with enabled quoting feature should be at least one time stable (#1265) ([8ef8768](https://github.com/intershop/intershop-pwa/commit/8ef8768))
- replace server encoded whitespace in productfilters '+' with '%20' (#1278) ([4692947](https://github.com/intershop/intershop-pwa/commit/4692947))
- merge product information for lower product completeness levels (#1279) ([eec9cda](https://github.com/intershop/intershop-pwa/commit/eec9cda))
- repair dead-code script finding comments (#1222, #1273) ([0a550ea](https://github.com/intershop/intershop-pwa/commit/0a550ea))
- rework category completeness computation (#1276) ([a6783cc](https://github.com/intershop/intershop-pwa/commit/a6783cc))
- use productprices api for retail sets and product master (#1262) ([208decc](https://github.com/intershop/intershop-pwa/commit/208decc))
- open product description tab by default when navigating between product detail pages (#1263) ([8138800](https://github.com/intershop/intershop-pwa/commit/8138800))
- extend ishServerHtml mediaobject handling to handle new image resource format (#1263) ([c4066d4](https://github.com/intershop/intershop-pwa/commit/c4066d4))
- render product descriptions with images properly (#1263) ([5477d85](https://github.com/intershop/intershop-pwa/commit/5477d85))
- add fallbackLocales to show translations even if there is no connection to the server (#1259) ([9b3ec42](https://github.com/intershop/intershop-pwa/commit/9b3ec42))
- show success messages for cost center buyer actions (#959, #1249) ([9e079a2](https://github.com/intershop/intershop-pwa/commit/9e079a2))
- do not override theme specific favicon if requested from assets (#1257, #1261) ([8b5c5e2](https://github.com/intershop/intershop-pwa/commit/8b5c5e2))
- do not merge product filter query params by default but only for products of the product listing component (#1252) ([8a4f66e](https://github.com/intershop/intershop-pwa/commit/8a4f66e))
- add missing translation key for company information on registration page ([40e5362](https://github.com/intershop/intershop-pwa/commit/40e5362))
- do not override product information in the state with information with lower completeness level (#1256) ([81b2220](https://github.com/intershop/intershop-pwa/commit/81b2220))
- product attributes not nullable (#1197, #1248) ([90c384c](https://github.com/intershop/intershop-pwa/commit/90c384c))
- **eslint-rules:** repair ban-imports-file-pattern rule ([0c65e3d](https://github.com/intershop/intershop-pwa/commit/0c65e3d))

### Documentation

- update getting started, development and customization documentation (#1275) ([f8eb9b9](https://github.com/intershop/intershop-pwa/commit/f8eb9b9))

### BREAKING CHANGES

- We removed the `not_available.png` image and replaced it with an SVG image (without text inside the image) and adjusted file references (see [Migrations / 3.0 to 3.1](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#30-to-31) for more details).
- We changed the default queryParamsHandling for product detail links via product image or product name component (see [Migrations / 3.0 to 3.1](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#30-to-31) for more details).
- The validator `equalToControl` did not work properly. For that reason we removed it. Use the validator `equalTo` instead. Find more information in the method description in the `special-validators.ts`.

### CHANGES THAT REQUIRE MORE RECENT ICM VERSIONS

- add customer approval handling (#1284) - 7.10.38.15-LTS
- add personal data request handling - GDPR (#1214) - 7.10.38.14-LTS
- show inactive flag for cost center users (#958, #1283) - 7.10.38.15-LTS
- display a maintenance page if a http error 503 occurs (#1111) - ICM 7.10.38.16-LTS

## [3.0.0](https://github.com/intershop/intershop-pwa/releases/tag/3.0.0) (2022-08-12)

**required Intershop Commerce Management version: 7.10.38.11-LTS**

**required/tested Node.js version: 16.16.0 LTS (including npm 8.11.0)**

### Features

- add "Back To Top" button (#1180) ([27f1f27](https://github.com/intershop/intershop-pwa/commit/27f1f27))
- show system reject errors for requisition (#1238) ([ace4c77](https://github.com/intershop/intershop-pwa/commit/ace4c77))
- display multiple basket errors (#1230, #1108) ([c0d73c7](https://github.com/intershop/intershop-pwa/commit/c0d73c7))
- translate CMS configuration parameter URL based on type (#385, #1223) ([3957b14](https://github.com/intershop/intershop-pwa/commit/3957b14))
- Angular A11y ESLint Rules (Accessibility) (#1168) ([e584271](https://github.com/intershop/intershop-pwa/commit/e584271))
- display basket loading only on items list ([1cabc4b](https://github.com/intershop/intershop-pwa/commit/1cabc4b))
- add paging bar to the list of line items (basket, requisition, order, quote) ([afd7995](https://github.com/intershop/intershop-pwa/commit/afd7995))
- active files report includes style files (#1190) ([2f7c765](https://github.com/intershop/intershop-pwa/commit/2f7c765))
- complex configuration can be supplied as yaml (#1133) ([4a71df7](https://github.com/intershop/intershop-pwa/commit/4a71df7))
- select payment methods as default in the payment settings (#1159) ([87a19f8](https://github.com/intershop/intershop-pwa/commit/87a19f8))
- enable additional features extending defaults in multi-site (#1191) ([8a260b1](https://github.com/intershop/intershop-pwa/commit/8a260b1))
- CMS managed footer (#1144, #1166) ([562c56a](https://github.com/intershop/intershop-pwa/commit/562c56a))
- introduce SSR variable for platform checks (#1080) ([7c6a226](https://github.com/intershop/intershop-pwa/commit/7c6a226))
- remove pagespeed module from our nginx container (#1150) ([d2897f9](https://github.com/intershop/intershop-pwa/commit/d2897f9))
- create a product review on product detail page (#1198) ([9ac2f85](https://github.com/intershop/intershop-pwa/commit/9ac2f85))
- add a custom description to the textarea description wrapper ([80a69c3](https://github.com/intershop/intershop-pwa/commit/80a69c3))
- **seo:** optimized content page URLs with full content page path (#1161) ([7a71372](https://github.com/intershop/intershop-pwa/commit/7a71372))
- **seo:** optimized product URLs with full category path (#1164) ([0252857](https://github.com/intershop/intershop-pwa/commit/0252857))
- **seo:** optimized category URLs with full category path (#1163) ([2a212bb](https://github.com/intershop/intershop-pwa/commit/2a212bb))

### Bug Fixes

- prevent directory traversal on SSR (#1241) ([c7d8d00](https://github.com/intershop/intershop-pwa/commit/c7d8d00))
- disable add-to-basket when quantity is zero (#1066) ([edf1573](https://github.com/intershop/intershop-pwa/commit/edf1573))
- correct selector for custom components in projects generated by schematics (#1240) ([3280dd4](https://github.com/intershop/intershop-pwa/commit/3280dd4))
- missing display name for default sorting in product lists ([5fb6ee9](https://github.com/intershop/intershop-pwa/commit/5fb6ee9))
- do not display a shipping method details popover if no shipping method description is managed ([8fe342b](https://github.com/intershop/intershop-pwa/commit/8fe342b))
- unnecessary emissions of the getCurrentBasket selector if the basket loading state changes (#1234) ([d22ba7d](https://github.com/intershop/intershop-pwa/commit/d22ba7d))
- prevent linting for running schematics with dry-run option (#1221, #1226) ([5183ed4](https://github.com/intershop/intershop-pwa/commit/5183ed4))
- failing precommit hook, if this commit doesn't include tests (#1228) ([ac782ba](https://github.com/intershop/intershop-pwa/commit/ac782ba))
- display the order confirmation page when returning from redirect after checkout (#1227) ([3ea3b8c](https://github.com/intershop/intershop-pwa/commit/3ea3b8c))
- revert selector-not-notation behavior to overload Bootstrap standard styles (#1218) ([6bf7e47](https://github.com/intershop/intershop-pwa/commit/6bf7e47))
- static page component needs to load the content page tree for the breadcrumb even if the navigation is not shown (#1215) ([51275d5](https://github.com/intershop/intershop-pwa/commit/51275d5))
- use double encoded resource ids to support special characters in email address as user login (#939, #940) ([2e8f7e4](https://github.com/intershop/intershop-pwa/commit/2e8f7e4))
- repair jest optimization for Angular 14 upgrade (#1210) ([491d78b](https://github.com/intershop/intershop-pwa/commit/491d78b))
- repair cleanup testbed ([c824159](https://github.com/intershop/intershop-pwa/commit/c824159))
- Invite page in ssr is not working (#1200) ([215525e](https://github.com/intershop/intershop-pwa/commit/215525e))
- purgecss exeption for generated filter-layer CSS classes (#1204, #1207) ([3bd0626](https://github.com/intershop/intershop-pwa/commit/3bd0626))
- make default favicon accessible from root ([2cda276](https://github.com/intershop/intershop-pwa/commit/2cda276))
- don't display the review tab on product master variation page (#1193) ([c70b0ff](https://github.com/intershop/intershop-pwa/commit/c70b0ff))
- content page not found when reloading a page with an authenticated user (#1198) ([1e7af60](https://github.com/intershop/intershop-pwa/commit/1e7af60))
- pin nginx version to 1.21.6 instead of using latest (#1188) ([2ba3d94](https://github.com/intershop/intershop-pwa/commit/2ba3d94))

### Performance Improvements

- reduce add product to basket debounce time ([243a567](https://github.com/intershop/intershop-pwa/commit/243a567))
- limit the number of items shown in the mini basket ([7175453](https://github.com/intershop/intershop-pwa/commit/7175453))

### Documentation

- update mapper documentation (#1224) ([d5155d3](https://github.com/intershop/intershop-pwa/commit/d5155d3))
- **seo:** add chapter for search engine optimized URLs/routes ([b8424e2](https://github.com/intershop/intershop-pwa/commit/b8424e2))

### Code Refactoring

- replace unmaintained angular2-uuid lib (#1203) ([3c6b924](https://github.com/intershop/intershop-pwa/commit/3c6b924))
- **schematics:** invert noCMSPrefixing option ([d1258fb](https://github.com/intershop/intershop-pwa/commit/d1258fb))

### Dependencies

- Cypress 10 upgrade (#1225) ([a8b3d4e](https://github.com/intershop/intershop-pwa/commit/a8b3d4e))
- remove unused http-loader dependency (#1154) ([636a6e2](https://github.com/intershop/intershop-pwa/commit/636a6e2))
- update to Angular 14 and fix issues ([c216537](https://github.com/intershop/intershop-pwa/commit/c216537))
- update Jest and fix issues ([8087fa7](https://github.com/intershop/intershop-pwa/commit/8087fa7))
- remove deferLoad and use loading lazy (#1097) ([8c74111](https://github.com/intershop/intershop-pwa/commit/8c74111))

### BREAKING CHANGES

- **seo:** Content page routes/URLs were changed (see [Migrations / 2.4 to 3.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#24-to-30) for more details).
- **seo:** Product routes/URLs were changed (see [Migrations / 2.4 to 3.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#24-to-30) for more details).
- **seo:** Category routes/URLs were changed (see [Migrations / 2.4 to 3.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#24-to-30) for more details).
- The `footer.content` localization key was replaced for most of its content by a CMS manageable content include.
- Introduced double encoding of resource ids in REST API calls for user login (see [Migrations / 2.4 to 3.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#2.4-to-30) for more details).
- Introduced the build variable `SSR` that is now used for all checks if the application is running in SSR or Browser context (see [Migrations / 2.4 to 3.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#2.4-to-30) for more details).
- Angular 14 and dependecies update (see [Migrations / 2.4 to 3.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#24-to-30) for more details).
- Jest upgrade to version 28, the jest-marbles package has been replaced by jasmine-marbles.
- The @ngx-translate/http-loader has been removed from the dependencies.
- The [pagespeed module](https://www.modpagespeed.com) of NGINX has been removed without replacement.
- We removed the unmaintained `angular2-uuid` library in favor of the standard `uuid` library (see [Migrations / 2.4 to 3.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#24-to-30) for more details).
- Removed `(deferLoad)` directive and replaced it with `loading="lazy"` (see [Migrations / 2.4 to 3.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#24-to-30) for more details).
- The cypress test files moved from cypress/integration folder to cypress/e2e. The cypress config file changed and also some scripts have been adapted to reflect the new config structure.
- **schematics:** The `cms` schematic's `noCMSPrefixing` option has been renamed to `cmsPrefixing` with an inverted behavior.

## [2.4.1](https://github.com/intershop/intershop-pwa/releases/tag/2.4.1) (2022-07-13)

**required Intershop Commerce Management version: 7.10.38.0-LTS**

**required/tested Node.js version: 16.16.0 LTS (including npm 8.11.0)**

### Bug Fixes

- dependencies and package-lock fixes (#1182) ([5f22ccc](https://github.com/intershop/intershop-pwa/commit/5f22ccc))
- pin nginx version to 1.21.6 instead of using latest (#1188) ([c983feb](https://github.com/intershop/intershop-pwa/commit/c983feb))
- use a fixed node.js version to prevent build issues with unknown versions (#1208) ([841feba](https://github.com/intershop/intershop-pwa/commit/841feba))
- purgecss exeption for generated filter-layer CSS classes (#1204, #1207) ([0105006](https://github.com/intershop/intershop-pwa/commit/0105006))
- make default favicon accessible from root (#1194, #1199) ([893bfd2](https://github.com/intershop/intershop-pwa/commit/893bfd2))
- don't display the review tab on product master variation page (#1193) ([8a0a265](https://github.com/intershop/intershop-pwa/commit/8a0a265))
- content page not found when reloading a page with an authenticated user (#1198) ([401b393](https://github.com/intershop/intershop-pwa/commit/401b393))

## [2.4.0](https://github.com/intershop/intershop-pwa/releases/tag/2.4.0) (2022-06-03)

**required Intershop Commerce Management version: 7.10.38.0-LTS**

### Features

- display product reviews on product detail page (#1174) ([8a2d88d](https://github.com/intershop/intershop-pwa/commit/8a2d88d))
- selectively activate source maps on runtime (#1127) ([aeb39f5](https://github.com/intershop/intershop-pwa/commit/aeb39f5))
- load only visible products in the product links carousel (#1162) ([e44ee3e](https://github.com/intershop/intershop-pwa/commit/e44ee3e))
- display dynamic promotion messages on shopping cart (#1145) ([ffafdc5](https://github.com/intershop/intershop-pwa/commit/ffafdc5))

### Bug Fixes

- window object can only be used on browser side (#1178) ([1b9fc1b](https://github.com/intershop/intershop-pwa/commit/1b9fc1b))
- rearange the display of product tabs for retail sets and product bundles ([f8cf5c1](https://github.com/intershop/intershop-pwa/commit/f8cf5c1))
- display the number of reviews behind the product rating stars instead of the average rating (#1174) ([604f387](https://github.com/intershop/intershop-pwa/commit/604f387))
- preserve semicolons in query params (#1167) ([e776e14](https://github.com/intershop/intershop-pwa/commit/e776e14))
- prevent View Context REST API calls with an undefined CategoryRefID value ([f7e0de7](https://github.com/intershop/intershop-pwa/commit/f7e0de7))
- only update cost center when it actually changes (#1153) ([f00e626](https://github.com/intershop/intershop-pwa/commit/f00e626))
- display undiscounted single base price on shopping basket if it differs from single base price (#1149) ([02cdb78](https://github.com/intershop/intershop-pwa/commit/02cdb78))
- non-existing content pages should result in a "Page Not Found" page (#1152) ([7ccd223](https://github.com/intershop/intershop-pwa/commit/7ccd223))
- cookie page guard results in error with SSR (#1148) ([dc92011](https://github.com/intershop/intershop-pwa/commit/dc92011))
- **schematics:** make override schematic robust to path seperators (#1146) ([8f28705](https://github.com/intershop/intershop-pwa/commit/8f28705))
- **schematics:** create gitignore with correct ignore path (#1124) ([3eb320f](https://github.com/intershop/intershop-pwa/commit/3eb320f))

### Performance Improvements

- **test:** local jest speedup with custom haste map (#1119) ([7564b01](https://github.com/intershop/intershop-pwa/commit/7564b01))

### Documentation

- add 2.3 datepicker migration note and hybrid approach requirements ([4d9b009](https://github.com/intershop/intershop-pwa/commit/4d9b009))

### Code Refactoring

- move rating components to an extension (#1174) ([96c1dbe](https://github.com/intershop/intershop-pwa/commit/96c1dbe))

### Chores

- clean up obsolete html comments and removed unused localization keys ([652195e](https://github.com/intershop/intershop-pwa/commit/652195e))

### BREAKING CHANGES

- Angular 13.3.10 and dependencies update (see [Migrations / 2.3 to 2.4](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#23-to-24) for more details).
- The ratings & reviews functionality was moved into an extension (see [Migrations / 2.3 to 2.4](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#23-to-24) for more details).
- Removed unused newsletter localization keys.

## [2.3.0](https://github.com/intershop/intershop-pwa/releases/tag/2.3.0) (2022-05-03)

**required Intershop Commerce Management version: 7.10.38.0-LTS**

### Features

- introduce price update strategies (#1089) ([c980cbe](https://github.com/intershop/intershop-pwa/commit/c980cbe))
- make products service default attrs easily overridable (#1098) ([78ef2e1](https://github.com/intershop/intershop-pwa/commit/78ef2e1))
- clean-localizations on used sources (#1047) ([bf81099](https://github.com/intershop/intershop-pwa/commit/bf81099))
- display loading overlay for basket merge ([811b540](https://github.com/intershop/intershop-pwa/commit/811b540))
- allow strings as propagate index ([fc19edd](https://github.com/intershop/intershop-pwa/commit/fc19edd))
- export product context for debug usage ([036602b](https://github.com/intershop/intershop-pwa/commit/036602b))
- support language plural rules for translations (#1073) ([af747b0](https://github.com/intershop/intershop-pwa/commit/af747b0))
- **eslint:** add rule disallowing optional inputs (#1121) ([e4121a4](https://github.com/intershop/intershop-pwa/commit/e4121a4))

### Bug Fixes

- enable locale override for development mode (#1139) ([ae7237b](https://github.com/intershop/intershop-pwa/commit/ae7237b))
- allow same product list call after a specified time (#1140) ([c4bfe88](https://github.com/intershop/intershop-pwa/commit/c4bfe88))
- URL encode formParamsToString values (#1115) ([269bf72](https://github.com/intershop/intershop-pwa/commit/269bf72))
- use feature subscription instead of static check in lazy components (#1138) ([a8c75ac](https://github.com/intershop/intershop-pwa/commit/a8c75ac))
- handle ICM static files with the ICM proxy configuration (#1105) ([29be2c1](https://github.com/intershop/intershop-pwa/commit/29be2c1))
- pin usage of ubuntu focal ([0ddcb74](https://github.com/intershop/intershop-pwa/commit/0ddcb74))
- add missing feature guards to feature routing modules ([5eef759](https://github.com/intershop/intershop-pwa/commit/5eef759))
- re-implement tracking of anonymous basket for merge basket logic (#1130) ([b9ff6cb](https://github.com/intershop/intershop-pwa/commit/b9ff6cb))
- login gets lost after a link is opened in a different tab (#938, #1109) ([2daea47](https://github.com/intershop/intershop-pwa/commit/2daea47))
- display buyer information for orders based on order data and not based on data of the logged in customer (#1104) ([85888d9](https://github.com/intershop/intershop-pwa/commit/85888d9))
- remove equal character from url slugs (#1112) ([26c61d6](https://github.com/intershop/intershop-pwa/commit/26c61d6))
- fix spacing for old prices and scaled prices ([8b9a10c](https://github.com/intershop/intershop-pwa/commit/8b9a10c))
- **schematics:** add feature toggle guard to new pages if required ([fcd0ac5](https://github.com/intershop/intershop-pwa/commit/fcd0ac5))

### Performance Improvements

- debounce changes made to the context ([8aee8b1](https://github.com/intershop/intershop-pwa/commit/8aee8b1))

### Documentation

- debugging flaky cypress tests ([7d442b7](https://github.com/intershop/intershop-pwa/commit/7d442b7))
- documentation adjustments (#1116) ([c3251bd](https://github.com/intershop/intershop-pwa/commit/c3251bd))

### Code Refactoring

- adapt 'apiToken' cookie handling after ICM api token changes (#1105) ([7e24ba1](https://github.com/intershop/intershop-pwa/commit/7e24ba1))

### BREAKING CHANGES

- For a working hybrid approach ICM 7.10.32.16-LTS or 7.10.38.6-LTS or newer is required. The changes in the PWA should not be incompatible with older ICM version if no hybrid approach is needed.
- The method `getFilteredProducts` was moved from `FilterService` to `ProductsService`.

## [2.2.0](https://github.com/intershop/intershop-pwa/releases/tag/2.2.0) (2022-04-01)

**required Intershop Commerce Management version: 7.10.38.0-LTS**

**required/tested Node.js version: 16.14.2 LTS (including npm 8.5.0)**

### Features

- introduce formly field reusability feature (#1017) ([0889f38](https://github.com/intershop/intershop-pwa/commit/0889f38))
- add desired delivery date with NgbDatePicker & date-fns (#1056) ([638609e](https://github.com/intershop/intershop-pwa/commit/638609e))
- display feedback when product is out of stock on order templates (#1067) ([7c84791](https://github.com/intershop/intershop-pwa/commit/7c84791))
- enable nginx access logging in json format (#1086) ([099af1f](https://github.com/intershop/intershop-pwa/commit/099af1f))
- handle and display scaled prices (#1030) ([699b260](https://github.com/intershop/intershop-pwa/commit/699b260))
- support Payone Eps payment method (#1053) ([efe7884](https://github.com/intershop/intershop-pwa/commit/efe7884))
- **eslint:** rules for customization (#1055) ([8107fcf](https://github.com/intershop/intershop-pwa/commit/8107fcf))

### Bug Fixes

- support the character sequence 'sku' in product SKUs (#963) ([a22a56d](https://github.com/intershop/intershop-pwa/commit/a22a56d))
- improve product tile actions visibility + improve compare icon (#1082) ([dc36f5c](https://github.com/intershop/intershop-pwa/commit/dc36f5c))
- repair cleanup testbed script with parallel execution and apply changes (#1072) ([32953c1](https://github.com/intershop/intershop-pwa/commit/32953c1))
- display addToQuote and addToOrderTemplate buttons on cart page even in case the cart contains quote items (#1054) ([1f0bb53](https://github.com/intershop/intershop-pwa/commit/1f0bb53))
- quote items on cart UI issues (#1054) ([c9769c2](https://github.com/intershop/intershop-pwa/commit/c9769c2))
- don't display 'UNDEFINED' in case the promotion title is missing for the current locale (#1054) ([71a845d](https://github.com/intershop/intershop-pwa/commit/71a845d))
- repair cleanup testbed script and apply changes (#1057) ([a4e403c](https://github.com/intershop/intershop-pwa/commit/a4e403c))

### Code Refactoring

- compare as extension (#1069) ([3332337](https://github.com/intershop/intershop-pwa/commit/3332337))

### BREAKING CHANGES

- Angular 13.3.0 and dependencies update (see [Migrations / 2.1 to 2.2](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#21-to-22) for more details).
- Node.js 16 is now used for development and deployment.
- The compare functionality was moved into an extension (see [Migrations / 2.1 to 2.2](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#21-to-22) for more details).

## [2.1.0](https://github.com/intershop/intershop-pwa/releases/tag/2.1.0) (2022-03-08)

**required Intershop Commerce Management version: 7.10.38.0-LTS**

### Features

- fetch product price information with new productprice REST API (#1018) ([26ebdf2](https://github.com/intershop/intershop-pwa/commit/26ebdf2))
- fetch and display personalized category and product data (#1021) ([fd08931](https://github.com/intershop/intershop-pwa/commit/fd08931))
- remove quote items from cart (#1029) ([84c449e](https://github.com/intershop/intershop-pwa/commit/84c449e))
- use demo content artifact in header navigation (#1038) ([e065b3f](https://github.com/intershop/intershop-pwa/commit/e065b3f))
- support payone iDeal payment method (#974) ([06a25c4](https://github.com/intershop/intershop-pwa/commit/06a25c4))
- move localization keep patterns where they are needed (#960) ([9b6a996](https://github.com/intershop/intershop-pwa/commit/9b6a996))
- context with propagateActive as input (#1007) ([a4c1c16](https://github.com/intershop/intershop-pwa/commit/a4c1c16))
- recalculate basket after currency change (#1005) ([04b44bc](https://github.com/intershop/intershop-pwa/commit/04b44bc))

### Bug Fixes

- repair service worker (#1045) ([2a7a47d](https://github.com/intershop/intershop-pwa/commit/2a7a47d))
- prevent out of stock products from being added to basket on order templates (#1031) ([5f85f9d](https://github.com/intershop/intershop-pwa/commit/5f85f9d))
- prevent console error messages on checkout shipping page (#1040) ([7af76a6](https://github.com/intershop/intershop-pwa/commit/7af76a6))
- render content of product detail description tab as html (#1037) ([147b07c](https://github.com/intershop/intershop-pwa/commit/147b07c))
- checkout payment parameter form validation (#1035) ([4dbccaf](https://github.com/intershop/intershop-pwa/commit/4dbccaf))
- update propagation of parent context if child context is removed (#1022) ([61cb60a](https://github.com/intershop/intershop-pwa/commit/61cb60a))
- product search is cached in PWA and does not trigger a new REST call (#983, #1024) ([db38c8a](https://github.com/intershop/intershop-pwa/commit/db38c8a))
- trim payment parameter form values (#1013) ([507966f](https://github.com/intershop/intershop-pwa/commit/507966f))
- include 'all' theme in allowed overrides (#1014) ([302285f](https://github.com/intershop/intershop-pwa/commit/302285f))
- payment & order redirect respects baseHref (#1010) ([d29c1ec](https://github.com/intershop/intershop-pwa/commit/d29c1ec))

### Performance Improvements

- **schematics:** better linter performance (#1044) ([49497c9](https://github.com/intershop/intershop-pwa/commit/49497c9))

### Code Refactoring

- recently viewed products as extension (#1034) ([d7a8613](https://github.com/intershop/intershop-pwa/commit/d7a8613))

### BREAKING CHANGES

- Product prices are now fetched by separate `productprices` REST calls instead of using the information fetched with the products REST call.
- Handling personalized REST calls for category and product data required some possibly breaking changes (see [Migrations / 2.0 to 2.1](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#20-to-21) for more details).
- The recently viewed products functionality was moved into an extension (see [Migrations / 2.0 to 2.1](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#20-to-21) for more details).

## [2.0.0](https://github.com/intershop/intershop-pwa/releases/tag/2.0.0) (2022-02-08)

**required Intershop Commerce Management version: 7.10.38.0-LTS**

### Features

- introduce footer top component that integrates the store locator ([9a433e9](https://github.com/intershop/intershop-pwa/commit/9a433e9))
- store locator with Google Maps integration (#911) ([2f3bc1a](https://github.com/intershop/intershop-pwa/commit/2f3bc1a))
- replace product detail info accordion with tabs (#994) ([3b9f9d1](https://github.com/intershop/intershop-pwa/commit/3b9f9d1))
- local ICM cache for (performance) testing purposes (#867) ([9aedbfc](https://github.com/intershop/intershop-pwa/commit/9aedbfc))
- render additional CMS demo content artifacts (#967) ([d31f430](https://github.com/intershop/intershop-pwa/commit/d31f430))
- extend product image component by an optional link target parameter ([037253c](https://github.com/intershop/intershop-pwa/commit/037253c))

### Bug Fixes

- add title to registration form (#1002) ([3e1d3b0](https://github.com/intershop/intershop-pwa/commit/3e1d3b0))
- terms and conditions link on checkout review page ([e044069](https://github.com/intershop/intershop-pwa/commit/e044069))
- minor bugs concerning the preferred wishlist behavior ([b4d98a7](https://github.com/intershop/intershop-pwa/commit/b4d98a7))
- cost center management improvements and fixes ([4413804](https://github.com/intershop/intershop-pwa/commit/4413804))
- optional info-box heading, parameter docu ([4ec081f](https://github.com/intershop/intershop-pwa/commit/4ec081f))
- move the position of the CSSClass configuration from the 'img' to the 'div' tag ([8a92b10](https://github.com/intershop/intershop-pwa/commit/8a92b10))
- respect ICM setting basket.maxItemQuantity (#993) ([81341ce](https://github.com/intershop/intershop-pwa/commit/81341ce))
- lazily resolve translate service in translate compiler (#978) ([3838171](https://github.com/intershop/intershop-pwa/commit/3838171))
- remove matrix parameters from URL to prevent accumulation (#976) ([83a1711](https://github.com/intershop/intershop-pwa/commit/83a1711))
- catch and log errors from translation API ([e04c735](https://github.com/intershop/intershop-pwa/commit/e04c735))
- stringify SSR error if possible ([50cafde](https://github.com/intershop/intershop-pwa/commit/50cafde))
- remove console.log from schematic ([98daa81](https://github.com/intershop/intershop-pwa/commit/98daa81))
- include healthcheck.js in docker compile scripts (#969) ([9946ca2](https://github.com/intershop/intershop-pwa/commit/9946ca2))
- rename component inputs named 'class' to 'cssClass' (#975) ([892a1ef](https://github.com/intershop/intershop-pwa/commit/892a1ef))
- code documentation of the attribute helper class ([44111ab](https://github.com/intershop/intershop-pwa/commit/44111ab))
- improve Cybersource Credit Card styling ([2e3f5bf](https://github.com/intershop/intershop-pwa/commit/2e3f5bf))
- display product labels by adding PurgeCSS exeption to keep 'product-label' styling ([6b7657c](https://github.com/intershop/intershop-pwa/commit/6b7657c))
- display of unlimited budget (phone view) (#950) ([17c37a9](https://github.com/intershop/intershop-pwa/commit/17c37a9))
- improve requisition buyer approval widget ui in case the buyer has an unlimited budget (#951) ([cd3e3c0](https://github.com/intershop/intershop-pwa/commit/cd3e3c0))
- unify budget input fields layout in phone view (#957) ([cb4355c](https://github.com/intershop/intershop-pwa/commit/cb4355c))
- remove unnecessary quoting breadcrumb data (#964) ([3c35ac5](https://github.com/intershop/intershop-pwa/commit/3c35ac5))
- add quote to cart in case no cart exists (#952) ([114c8d5](https://github.com/intershop/intershop-pwa/commit/114c8d5))
- query-params should not duplicate at rewrite (#945) ([498ecbe](https://github.com/intershop/intershop-pwa/commit/498ecbe))

### Documentation

- adapt outdated component documentation ([02f2c0d](https://github.com/intershop/intershop-pwa/commit/02f2c0d))
- **eslint:** update documentation regarding the switch from tslint to eslint ([bad71ea](https://github.com/intershop/intershop-pwa/commit/bad71ea))

### Code Refactoring

- replace deprecated methods after dependencies update ([c7766ed](https://github.com/intershop/intershop-pwa/commit/c7766ed))
- necessary code adaptions after dependencies updates ([bd87999](https://github.com/intershop/intershop-pwa/commit/bd87999))
- use the ICM channel preference to configure the advancedVariationHandling instead of the feature toggle of the same name (#991) ([b459006](https://github.com/intershop/intershop-pwa/commit/b459006))
- remove obsolete form components (#953) ([7cc7ec1](https://github.com/intershop/intershop-pwa/commit/7cc7ec1))
- move SelectOption interface to the model folder (#953) ([c634b58](https://github.com/intershop/intershop-pwa/commit/c634b58))
- rename standard PWA themes - (b2b + b2c) (#923) ([12c52ae](https://github.com/intershop/intershop-pwa/commit/12c52ae))
- **eslint:** e2e test code changes from tslint to eslint ([eb211be](https://github.com/intershop/intershop-pwa/commit/eb211be))
- **eslint:** code adaptions to respect "no-negated-async" rule ([c98c4d1](https://github.com/intershop/intershop-pwa/commit/c98c4d1))
- **eslint:** code adaptions to respect "no-output-native" and "no-output-on-prefix" rule ([6194435](https://github.com/intershop/intershop-pwa/commit/6194435))
- **eslint:** code adaptions to respect "complexity" rule ([85e2616](https://github.com/intershop/intershop-pwa/commit/85e2616))
- **eslint:** code adaptions to respect "prefer-template" rule ([4cde7f6](https://github.com/intershop/intershop-pwa/commit/4cde7f6))
- **eslint:** code adaptions to respect "member-ordering" rule ([dc2af27](https://github.com/intershop/intershop-pwa/commit/dc2af27))
- **eslint:** code adaptions to respect "no-empty-interface" rule ([6e11d11](https://github.com/intershop/intershop-pwa/commit/6e11d11))
- **eslint:** code adaptions to respect "sort-ngmodule-metadata-arrays" rule ([013236c](https://github.com/intershop/intershop-pwa/commit/013236c))
- **eslint:** code adaptions to respect minor rule requirements ([fcf2b74](https://github.com/intershop/intershop-pwa/commit/fcf2b74))
- **eslint:** application code changes from tslint to eslint ([23578b9](https://github.com/intershop/intershop-pwa/commit/23578b9))
- **eslint:** helper code changes from tslint to eslint ([4d8114e](https://github.com/intershop/intershop-pwa/commit/4d8114e))
- **eslint:** add eslint rule 'prefer-optional-chain' to enforce the usage of the elvis operator (#987) ([4f6ad62](https://github.com/intershop/intershop-pwa/commit/4f6ad62))

### Dependencies

- update swiper to version 7 (#892) ([c771796](https://github.com/intershop/intershop-pwa/commit/c771796))
- formly 6 update and necessary code adaptions ([f01ebbf](https://github.com/intershop/intershop-pwa/commit/f01ebbf))
- update polyfills.ts and .browserslistrc according to Angular 13.0.2 defaults ([e18b0e3](https://github.com/intershop/intershop-pwa/commit/e18b0e3))
- Angular 13.0.2 update + dependencies updates + configuration adaptions ([6f68e77](https://github.com/intershop/intershop-pwa/commit/6f68e77))

### Build

- **eslint:** switch project configuration from tslint to eslint ([0034553](https://github.com/intershop/intershop-pwa/commit/0034553))
- **eslint:** add eslint configuration ([f3a5230](https://github.com/intershop/intershop-pwa/commit/f3a5230))
- **eslint:** add custom eslint rules and eslint rule schematic ([3cb52b4](https://github.com/intershop/intershop-pwa/commit/3cb52b4))
- **eslint:** remove custom tslint rules and tslint configuration ([c19c99c](https://github.com/intershop/intershop-pwa/commit/c19c99c))

### BREAKING CHANGES

- Switch linting from `tslint` to `eslint` (see [Migrations / 1.4 to 2.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#14-to-20) for more details).
- Swiper 7 upgrade (see [Migration Guide to Swiper 7](https://swiperjs.com/migration-guide) for more details).
- Formly 6 upgrade (see [upgrade from 5.0 to 6.0](https://github.com/ngx-formly/ngx-formly/blob/v6.0.0-next.7/UPGRADE-6.0.md) for more details).
- Angular 13 and dependencies update (see [Migrations / 1.4 to 2.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#14-to-20) for more details).
- Angular 13 removes support for IE 11 (see [Internet Explorer 11 support deprecation and removal](https://github.com/angular/angular/issues/41840) for more details).
- The feature toggle 'advancedVariationHandling' has been removed. Use the ICM channel preference for 'Variations List View' now. (see [Migrations / 1.4 to 2.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#14-to-20) for more details.
- The input parameter `class` was changed to `cssClass` for the following components: `ish-basket-create-order-template`,`ish-lazy-basket-create-order-template`, `ish-lazy-product-add-to-order-template`,`ish-lazy-product-add-to-quote`, `ish-lazy-product-add-to-wishlist`, `ish-product-add-to-basket`, `ish-product-add-to-compare`, `ish-product-add-to-order-template`, `ish-product-add-to-quote`, `ish-product-add-to-wishlist`. All uses of these components need to be adapted in custom code.
- Our deprecated form components have been removed, use Formly to generate and maintain your forms. (see [Migrations / 1.4 to 2.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#14-to-20) for more details.
- The `SelectOption` interface has been moved to the select-option.model.ts file of the core/model folder, the related import statements have been adapted.
- The B2C theme `default` is renamed to `b2c` and the B2B theme `blue` is renamed to `b2b` and `b2b` is now used as the default theme (see [Migrations / 1.4 to 2.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#14-to-20) for more details.

## [1.4.0](https://github.com/intershop/intershop-pwa/releases/tag/1.4.0) (2021-12-07)

**required Intershop Commerce Management version: 7.10.32.10-LTS**

### Features

- cost center management (#920) ([a11651d](https://github.com/intershop/intershop-pwa/commit/a11651d))
- introduce formly field plain-text-field ([57c6162](https://github.com/intershop/intershop-pwa/commit/57c6162))
- introduce template option 'inputClass' to set css classes at input/select/textarea tags in formly components ([0a7ccaa](https://github.com/intershop/intershop-pwa/commit/0a7ccaa))
- formly - data type of the input addon text extended by Observable<string> ([bb1a47c](https://github.com/intershop/intershop-pwa/commit/bb1a47c))
- set accent color for inputs ([5e44ece](https://github.com/intershop/intershop-pwa/commit/5e44ece))
- SSR-only ICM call cache interceptor ([369d94c](https://github.com/intershop/intershop-pwa/commit/369d94c))
- punchout identity provider (#916) ([36fb90f](https://github.com/intershop/intershop-pwa/commit/36fb90f))
- cybersource creditcard save for later checkbox. (#925) ([058533f](https://github.com/intershop/intershop-pwa/commit/058533f))
- add 'lang' property to 'html' tag (#926) ([5828487](https://github.com/intershop/intershop-pwa/commit/5828487))
- add option to enable SSR only for crawlers in nginx (#899) ([c826583](https://github.com/intershop/intershop-pwa/commit/c826583))

### Bug Fixes

- CMSImageEnhancedComponent remove component CSS class from img tag (#943) ([38124c7](https://github.com/intershop/intershop-pwa/commit/38124c7))
- support sitemap locations for muliple servers ([bbf98ce](https://github.com/intershop/intershop-pwa/commit/bbf98ce))
- display a default promotion name if promotion messaging is disabled (#934) ([67967c8](https://github.com/intershop/intershop-pwa/commit/67967c8))
- use newest Bootstrap release 4.6.1 with own divide() function (#921) ([13ce267](https://github.com/intershop/intershop-pwa/commit/13ce267))
- make ICM sitemap files available via nginx ([9574457](https://github.com/intershop/intershop-pwa/commit/9574457))

### BREAKING CHANGES

- We no longer use `@use 'sass:math';` and `math.div();` in our `.scss` files but instead switched to the new Bootstrap default way using `divide()`. This is more a note to check your styling customizations for possible adaptions. Both ways should still work together and adaptions are not required.

## [1.3.0](https://github.com/intershop/intershop-pwa/releases/tag/1.3.0) (2021-10-29)

**required Intershop Commerce Management version: 7.10.32.7-LTS**

### Features

- requisition approval usability improvements (#887) ([2de6856](https://github.com/intershop/intershop-pwa/commit/2de6856))
- add cost center approval widget (#887) ([7b412b7](https://github.com/intershop/intershop-pwa/commit/7b412b7))
- display a success/info message after a requisition has been approved/rejected (#887) ([9846c87](https://github.com/intershop/intershop-pwa/commit/9846c87))
- display cost center approval information in the checkout approval dialog (#887) ([1fb61f3](https://github.com/intershop/intershop-pwa/commit/1fb61f3))
- extend the authorization service and directive to check against multiple permissions ([b4d9c38](https://github.com/intershop/intershop-pwa/commit/b4d9c38))
- introduce info message component (#909) ([4eb6f24](https://github.com/intershop/intershop-pwa/commit/4eb6f24))
- adapt styling for toast messages (#909) ([725eeb1](https://github.com/intershop/intershop-pwa/commit/725eeb1))
- add quickorder sample CSV file (#895) ([cd420f7](https://github.com/intershop/intershop-pwa/commit/cd420f7))

### Bug Fixes

- display wishlist items in the wishlist widget (#917) ([17224f1](https://github.com/intershop/intershop-pwa/commit/17224f1))
- contact us page can't be used twice (#915) ([41eae48](https://github.com/intershop/intershop-pwa/commit/41eae48))
- DNS resolve issue in SSR ([0e7010c](https://github.com/intershop/intershop-pwa/commit/0e7010c))
- update placeholders correctly on SSR (#906) ([b734680](https://github.com/intershop/intershop-pwa/commit/b734680))
- check for whole occurences of localizations (#907) ([a952146](https://github.com/intershop/intershop-pwa/commit/a952146))
- don't display 'please select' in the cost center selection dropdown if a cost center has already been assigned to a basket ([8a2a6d3](https://github.com/intershop/intershop-pwa/commit/8a2a6d3))
- wait for retrieving localized ICM data until configuration is retrieved (#902) ([fc068c2](https://github.com/intershop/intershop-pwa/commit/fc068c2))
- disable inlineCriticalCss for Angular Universal engine (#904) ([00377e5](https://github.com/intershop/intershop-pwa/commit/00377e5))
- respect ICM setting "Add Product Behavior" when adding basket items (#905) ([a5fd804](https://github.com/intershop/intershop-pwa/commit/a5fd804))
- styling of radio buttons on shipping page (#900) ([072f747](https://github.com/intershop/intershop-pwa/commit/072f747))
- missing styles for main navigation hover menu - removed by PurgeCSS (#901) ([0205842](https://github.com/intershop/intershop-pwa/commit/0205842))
- repair chunk output file names for differential loading (#896) ([b1e27d5](https://github.com/intershop/intershop-pwa/commit/b1e27d5))
- quick order CSV file error message doesn't overlap button (#897) ([c23b9d5](https://github.com/intershop/intershop-pwa/commit/c23b9d5))

### Performance Improvements

- refactor loading of server-side translations (#890) ([3048485](https://github.com/intershop/intershop-pwa/commit/3048485))

### Documentation

- revive customization documentation (#910) ([fa1d321](https://github.com/intershop/intershop-pwa/commit/fa1d321))

### Code Refactoring

- remove b64u library and use native methods (#898) ([440828a](https://github.com/intershop/intershop-pwa/commit/440828a))

### BREAKING CHANGES

- The PWA no longer relies on the dependency to 'b64u' since no encoding and decoding Base64 is needed any more in SSR. In the browser native methods are used. If your custom code uses b64u in SSR you should not remove this dependency or use a polyfill like 'btoa-polyfill'.

## [1.2.0](https://github.com/intershop/intershop-pwa/releases/tag/1.2.0) (2021-09-30)

**required Intershop Commerce Management version: 7.10.32.3-LTS**

### Features

- helper for never forgetting npm install on branch change (#875) ([7c0b11a](https://github.com/intershop/intershop-pwa/commit/7c0b11a))
- add option for only building specific themes in docker build (#856) ([ad3fb75](https://github.com/intershop/intershop-pwa/commit/ad3fb75))
- add virtual theme "all" for always overriding files (#841) ([9b595d1](https://github.com/intershop/intershop-pwa/commit/9b595d1))
- customizable nginx cache duration (#873) ([b33dc3e](https://github.com/intershop/intershop-pwa/commit/b33dc3e))

### Bug Fixes

- enable cXML punchout with unclean user state (#861) ([5f2e4de](https://github.com/intershop/intershop-pwa/commit/5f2e4de))
- restrict product-quantity input to numbers (browser dependend) (#884) ([ecef9e4](https://github.com/intershop/intershop-pwa/commit/ecef9e4))
- no search results displayed when filter name contains special characters (#885) ([5f628d6](https://github.com/intershop/intershop-pwa/commit/5f628d6))
- use translate get instead of instant for product-image component (#876) ([d4ba64c](https://github.com/intershop/intershop-pwa/commit/d4ba64c))
- noSSR PWA Docker container does not support deep links (#871) ([0df009e](https://github.com/intershop/intershop-pwa/commit/0df009e))
- use get instead of value for global variables in Jest tests (#866) ([bc2517c](https://github.com/intershop/intershop-pwa/commit/bc2517c))

### Performance Improvements

- restrict NgRx state transfer filtering to two levels (#889) ([a1e4efd](https://github.com/intershop/intershop-pwa/commit/a1e4efd))
- prevent unnecessary individual loading of path categories (#877) ([dc820a7](https://github.com/intershop/intershop-pwa/commit/dc820a7))
- prevent compiling translations with very large values (#880) ([36aebad](https://github.com/intershop/intershop-pwa/commit/36aebad))
- cache compiled translations in PWA process (#881) ([82de3a4](https://github.com/intershop/intershop-pwa/commit/82de3a4))
- reduce breadcrumb set delay as it also blocks SSR (#870) ([a0eafd7](https://github.com/intershop/intershop-pwa/commit/a0eafd7))
- prevent api token restore on SSR (#870) ([c9425f5](https://github.com/intershop/intershop-pwa/commit/c9425f5))
- prevent basket loading subscription for SSR (#870) ([cffd192](https://github.com/intershop/intershop-pwa/commit/cffd192))
- prevent suggest search trigger on SSR (#870) ([25624e3](https://github.com/intershop/intershop-pwa/commit/25624e3))
- retrieve links and child products only on successful products call (#870) ([9b7ab1a](https://github.com/intershop/intershop-pwa/commit/9b7ab1a))
- cache 404 longer in nginx (#870) ([bdab77a](https://github.com/intershop/intershop-pwa/commit/bdab77a))

### Documentation

- update hybrid approach SSL documentation (#882) ([da1b1aa](https://github.com/intershop/intershop-pwa/commit/da1b1aa))

### Code Refactoring

- build and bundle docker scripts with webpack (#853) ([94e7fb9](https://github.com/intershop/intershop-pwa/commit/94e7fb9))

### BREAKING CHANGES

- JavaScript files from `dist` folder have been moved. See [Migrations / 1.1 to 1.2](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#11-to-12) for more details.
- The identity provider's `triggerLogout` method now takes 0 instead of 2 arguments.

## [1.1.0](https://github.com/intershop/intershop-pwa/releases/tag/1.1.0) (2021-09-03)

**required Intershop Commerce Management version: 7.10.32.3-LTS**

### Features

- add version method for inspecting version information (#858) ([4b9294f](https://github.com/intershop/intershop-pwa/commit/4b9294f))
- Cost Center selection for checkout (#807) ([72a439f](https://github.com/intershop/intershop-pwa/commit/72a439f))
- display product attachments at the product detail page (#840) ([d275b95](https://github.com/intershop/intershop-pwa/commit/d275b95))

### Bug Fixes

- enable logout of punchout user in combination with SSO (#852) ([eb4f222](https://github.com/intershop/intershop-pwa/commit/eb4f222))
- let purgecss only search app sources ([8db741a](https://github.com/intershop/intershop-pwa/commit/8db741a))
- stylePreprocessorOptions missing on server build (#834) ([2069f47](https://github.com/intershop/intershop-pwa/commit/2069f47))
- broken page on missing requisition data like user and budget (#859) ([0f3f847](https://github.com/intershop/intershop-pwa/commit/0f3f847))
- prevent double requests after inserting a SKU on direct order and quickorder form including validation ([fb2e192](https://github.com/intershop/intershop-pwa/commit/fb2e192))
- prevent call for empty product on quickorder and direct order (#844) ([385a855](https://github.com/intershop/intershop-pwa/commit/385a855))
- propagate extra arguments in build:multi script ([5ece62e](https://github.com/intershop/intershop-pwa/commit/5ece62e))
- mainNavigationMaxSubCategoriesDepth configuration with '0' fails to disable main navigation hover menu (#850) ([725cfb8](https://github.com/intershop/intershop-pwa/commit/725cfb8))
- use translate compiler for fallback translations (#843) ([69af5ff](https://github.com/intershop/intershop-pwa/commit/69af5ff))
- THEME variable should be string ([fc519bc](https://github.com/intershop/intershop-pwa/commit/fc519bc))
- align table heading with associated content in quickorder form (#832) ([64c0e1d](https://github.com/intershop/intershop-pwa/commit/64c0e1d))
- insert none default theme at the end ([e2d7639](https://github.com/intershop/intershop-pwa/commit/e2d7639))

## [1.0.0](https://github.com/intershop/intershop-pwa/releases/tag/1.0.0) (2021-08-04)

**required Intershop Commerce Management version: 7.10.32.0-LTS**

### Features

- add readiness and liveness probe for pm2 (#818) ([8a21fb1](https://github.com/intershop/intershop-pwa/commit/8a21fb1))
- multi-PWA container build with runtime theme switching (#775) ([b4c6060](https://github.com/intershop/intershop-pwa/commit/b4c6060))
- payone creditcard payment (#717) ([1b6190e](https://github.com/intershop/intershop-pwa/commit/1b6190e))
- provide deploy-url as runtime property (#630) ([03911e1](https://github.com/intershop/intershop-pwa/commit/03911e1))
- rework Quickorder page (#752) ([b06ac13](https://github.com/intershop/intershop-pwa/commit/b3bb4c5))
- add Quickorder Link for mobile view (#794) ([b06ac13](https://github.com/intershop/intershop-pwa/commit/b06ac13))
- add translate-placeholder extension and use it (#801) ([a413c3e](https://github.com/intershop/intershop-pwa/commit/a413c3e))
- add formly phone number input with basic validator (#778, #424) ([3a20d3c](https://github.com/intershop/intershop-pwa/commit/3a20d3c))
- add direct order on cart when feature quickorder is enabled (#745) ([a1e2aff](https://github.com/intershop/intershop-pwa/commit/a1e2aff))
- disable ngrx Store Devtools in production environments (#773) ([22ef75e](https://github.com/intershop/intershop-pwa/commit/22ef75e))
- container provide better error message when given ICM uses a not valid ssl certificate (#779) ([d2793a6](https://github.com/intershop/intershop-pwa/commit/d2793a6))
- adapt language switch with configurable multisite support (#722) ([4949be1](https://github.com/intershop/intershop-pwa/commit/4949be1))
- add basic formly radio button functionality ([031fc53](https://github.com/intershop/intershop-pwa/commit/031fc53))
- forward mouse event to callback handler in server-html directive (#750) ([478c096](https://github.com/intershop/intershop-pwa/commit/478c096))
- basic auth support for nginx (#677) ([7c3e193](https://github.com/intershop/intershop-pwa/commit/7c3e193))
- replace i18nPlural pipe usage with translate compiler (#719) ([0df6e8d](https://github.com/intershop/intershop-pwa/commit/0df6e8d))
- enable the B2B user to enter an order reference id during checkout (#714) ([2cf15f2](https://github.com/intershop/intershop-pwa/commit/2cf15f2))
- individual page sizes for product listings (category, search, master) (#709) ([e6d41ca](https://github.com/intershop/intershop-pwa/commit/e6d41ca))
- enable data retention for ngrx store slices (recently, compare, tacton) (#720) ([3f0069e](https://github.com/intershop/intershop-pwa/commit/3f0069e))
- unification of "Product List (Manual)" with the other CMS Product Lists (#673) ([6edf125](https://github.com/intershop/intershop-pwa/commit/6edf125))
- add support for CMS component "Product List (Category)" (#673) ([d3f0489](https://github.com/intershop/intershop-pwa/commit/d3f0489))
- add support for CMS component "Product List (Filter)" (#673) ([fbc5e3e](https://github.com/intershop/intershop-pwa/commit/fbc5e3e))
- introduce shared ProductsList component with list and carousel view (#673) ([8df9599](https://github.com/intershop/intershop-pwa/commit/8df9599))
- introduce content parameter state management - initial with filtered product lists (#673) ([6aa7fb4](https://github.com/intershop/intershop-pwa/commit/6aa7fb4))
- improve detecting missing translations (#659) ([32c57bd](https://github.com/intershop/intershop-pwa/commit/32c57bd))
- load translations with webpack (#655) ([267395c](https://github.com/intershop/intershop-pwa/commit/267395c))

### Bug Fixes

- address countryCode and mainDivision behaviour (#819) ([5f2e70c](https://github.com/intershop/intershop-pwa/commit/5f2e70c))
- remove type=text from registration password fields (#820) ([8907f36](https://github.com/intershop/intershop-pwa/commit/8907f36))
- translate-select-options without expressionProperty (#813) ([5b4c817](https://github.com/intershop/intershop-pwa/commit/5b4c817))
- ensure only one REST call is executed to get eligible shipping/payment methods on checkout pages ([f19434d](https://github.com/intershop/intershop-pwa/commit/f19434d))
- fetch endlessly addresses on checkout address page all the time ([8e2f66f](https://github.com/intershop/intershop-pwa/commit/8e2f66f))
- incorrect hover styles for nav links in hamburger menu (#805) ([dafafe1](https://github.com/intershop/intershop-pwa/commit/dafafe1))
- checkout shipping selection error and test (#798) ([50d9413](https://github.com/intershop/intershop-pwa/commit/50d9413))
- display an error message in case the customer creation failed ([21e19e0](https://github.com/intershop/intershop-pwa/commit/21e19e0))
- set canonical link and 'og:url' info independent from SSR container context to 'https' (#777) ([e3f0749](https://github.com/intershop/intershop-pwa/commit/e3f0749))
- exclude table styles from removing by purgeCSS ([5983945](https://github.com/intershop/intershop-pwa/commit/5983945))
- styling issue concerning mobile language switch (#769) ([7b7e835](https://github.com/intershop/intershop-pwa/commit/7b7e835))
- formly styling issues ([c548ca4](https://github.com/intershop/intershop-pwa/commit/c548ca4))
- adapt post wrappers extension and fix occurences ([e061d25](https://github.com/intershop/intershop-pwa/commit/e061d25))
- repair 'npm run start:local' (#758, #760) ([1a07855](https://github.com/intershop/intershop-pwa/commit/1a07855))
- incorrect product label display on product detail page (#762, #763) ([757c1eb](https://github.com/intershop/intershop-pwa/commit/757c1eb))
- add support for CMS component "Product List (Filter)" - use correct scope configuration (#755) ([1fa5e02](https://github.com/intershop/intershop-pwa/commit/1fa5e02))
- adapt project SCSS definitions in regards to sass '/' deprecation warnings (#751) ([9ba3618](https://github.com/intershop/intershop-pwa/commit/9ba3618))
- don't display payment costs on checkout payment page if the value is zero (#744) ([c94c3fb](https://github.com/intershop/intershop-pwa/commit/c94c3fb))
- don't display multiple buckets message after redirect before checkout (#735) ([ad029d5](https://github.com/intershop/intershop-pwa/commit/ad029d5))
- display edit line item link only for variation products (#741) ([03c9988](https://github.com/intershop/intershop-pwa/commit/03c9988))
- quick order - enable the add-to-cart button after a valid csv file has been selected (#736) ([72aaf83](https://github.com/intershop/intershop-pwa/commit/72aaf83))
- trigger change detection in the authorization toggle directive after permission changes ([74810ed](https://github.com/intershop/intershop-pwa/commit/74810ed))
- add permission check to edit the company profile ([2096b26](https://github.com/intershop/intershop-pwa/commit/2096b26))
- double-check missing translation before reporting (#728) ([f1eb525](https://github.com/intershop/intershop-pwa/commit/f1eb525))

### Documentation

- update changed/moved links in documentation ([d17d133](https://github.com/intershop/intershop-pwa/commit/d17d133))
- extend environment.ts configuration documentation ([4ca29d6](https://github.com/intershop/intershop-pwa/commit/4ca29d6))
- add single theme configuration description for multi theme support ([302be6d](https://github.com/intershop/intershop-pwa/commit/302be6d))
- add code documentation for formly things (#806) ([614b9d1](https://github.com/intershop/intershop-pwa/commit/614b9d1))
- documentation for deploy url (#646) ([8418166](https://github.com/intershop/intershop-pwa/commit/8418166))

### Dependencies

- update to Angular 12 and Webpack 5 (#718) ([c3c80ed](https://github.com/intershop/intershop-pwa/commit/c3c80ed))

### BREAKING CHANGES

- Webpack 5 upgrade - custom webpack configuration has to be updated if customized.
- Build process in docker image was enhanced to enable multiple configurations at runtime.
- The `environment.ts` handling and with that the handling of `environment.local.ts` was changed. See [Migrations / 0.30 to 1.0](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#031-to-10) for more details.
- Locale definitions in `environment.ts` models are no longer supported, only ICM channel configurations are now used for switching locales.

## [0.31.0](https://github.com/intershop/intershop-pwa/releases/tag/0.31.0) (2021-06-02)

**required Intershop Commerce Management version: 7.10.30.2**

### Features

- enable loading translations from ICM (#695) ([7f8ae68](https://github.com/intershop/intershop-pwa/commit/7f8ae68))
- display only available products in product links carousels and lists (#626) ([386a584](https://github.com/intershop/intershop-pwa/commit/386a584))
- omit default redirect in multi channel when one base href is root route (#704) ([76c9074](https://github.com/intershop/intershop-pwa/commit/76c9074))
- use locales from ICM configuration (#685) ([204fd36](https://github.com/intershop/intershop-pwa/commit/204fd36))

### Bug Fixes

- breadcrumb styling harmonization (#713) ([abb2c4e](https://github.com/intershop/intershop-pwa/commit/abb2c4e))
- set punchout cookies with "SameSite=None; Secure" to work in https iframes (#683) ([f5900eb](https://github.com/intershop/intershop-pwa/commit/f5900eb))
- timing issue when fetching CMS content include data after logout (#711) ([712c91b](https://github.com/intershop/intershop-pwa/commit/712c91b))
- adapt static content navigation styling to meet new IAD/VD requirements (#682) ([2fd56b1](https://github.com/intershop/intershop-pwa/commit/2fd56b1))
- use region code instead of id for US new-address-form (#708) ([06f466c](https://github.com/intershop/intershop-pwa/commit/06f466c))
- add missing loading spinner when creating an account (registration) (#705) ([8a77c4d](https://github.com/intershop/intershop-pwa/commit/8a77c4d))
- undesired logout after contact us submission (#686) ([a76d4a6](https://github.com/intershop/intershop-pwa/commit/a76d4a6))
- track item changes as local state in checkout facade (#702) ([8600213](https://github.com/intershop/intershop-pwa/commit/8600213))
- mini cart opens if the user navigates from checkout to other pages (#688) ([5a0ed25](https://github.com/intershop/intershop-pwa/commit/5a0ed25))

## [0.30.0](https://github.com/intershop/intershop-pwa/releases/tag/0.30.0) (2021-05-05)

**required Intershop Commerce Management version: 7.10.30.2**

### Features

- full support for categoryRef CMS configuration parameters and additional categoryref routing (#672) ([1d7ea7f](https://github.com/intershop/intershop-pwa/commit/1d7ea7f))
- support CMS static content pages navigation (#651) ([e038d4d](https://github.com/intershop/intershop-pwa/commit/e038d4d))
- SSO with invite support for B2B (#670) ([5b819db](https://github.com/intershop/intershop-pwa/commit/5b819db))
- add feature toggle for guest checkout (#654) ([e5138e4](https://github.com/intershop/intershop-pwa/commit/e5138e4))
- Punchout User Management for cXML and OCI users (#544) ([553c1a3](https://github.com/intershop/intershop-pwa/commit/553c1a3))
- modal on SSO registration navigation and refactorings (#647) ([f5452bf](https://github.com/intershop/intershop-pwa/commit/f5452bf))

### Bug Fixes

- reset children when switching sku in context (#680) ([a8cb95a](https://github.com/intershop/intershop-pwa/commit/a8cb95a))
- reset order creation errors after the user navigated to another checkout page ([057a3f2](https://github.com/intershop/intershop-pwa/commit/057a3f2))
- in case of multiple buckets display message on checkout review page ([eca7625](https://github.com/intershop/intershop-pwa/commit/eca7625))
- repair data refresh on product pages (#675) ([8eaac04](https://github.com/intershop/intershop-pwa/commit/8eaac04))
- auth0 silentRefresh requires offline_acces scope (#644) ([c6850a7](https://github.com/intershop/intershop-pwa/commit/c6850a7))
- add missing text for navigation toggle (#666) ([03a3770](https://github.com/intershop/intershop-pwa/commit/03a3770))
- compodoc generation with own tsconfig.doc.json (#664) ([46901e0](https://github.com/intershop/intershop-pwa/commit/46901e0))
- cms carousel component should handle not completely filled slides (#663) ([baff0c4](https://github.com/intershop/intershop-pwa/commit/baff0c4))
- display a product unavailable image on product detail page if there are no product images (#653) ([0d1be10](https://github.com/intershop/intershop-pwa/commit/0d1be10))
- basket acceleration in case the cost center is required but missing (#652) ([6f0200d](https://github.com/intershop/intershop-pwa/commit/6f0200d))
- multi site not working language switch (#649) ([3c01d7d](https://github.com/intershop/intershop-pwa/commit/3c01d7d))

### BREAKING CHANGES

- Registration page SSO configuration now via '/sso' sub route.

## [0.29.0](https://github.com/intershop/intershop-pwa/releases/tag/0.29.0) (2021-04-01)

**required Intershop Commerce Management version: 7.10.29.2**

### Features

- support for cXML punchout shopping (login, transfer order) (#550) ([b23d5ef](https://github.com/intershop/intershop-pwa/commit/b23d5ef))
- check for multiple punchout roles (cXML or OCI) for punchout UI adaptions ([f5a1a2c](https://github.com/intershop/intershop-pwa/commit/f5a1a2c))
- support for new OCI Punchout REST API v2 including product validation and background search ([a5226f7](https://github.com/intershop/intershop-pwa/commit/a5226f7))
- extend the role-toggle service and not-role-toggle directive to check against multiple roles if one is included ([4a8f7e3](https://github.com/intershop/intershop-pwa/commit/4a8f7e3))
- extend basket handling to work with a specific basket id instead of 'current' ([edd1d0a](https://github.com/intershop/intershop-pwa/commit/edd1d0a))
- login user with given token (e.g. from URL) ([107aff9](https://github.com/intershop/intershop-pwa/commit/107aff9))
- add support for setting 'responseType' header for REST calls ([e73343e](https://github.com/intershop/intershop-pwa/commit/e73343e))
- add support for providing options for the 'resolveLink/resolveLinks' functionality ([f8b2be6](https://github.com/intershop/intershop-pwa/commit/f8b2be6))
- SSO with Auth0 for B2B (#597) ([b8ada93](https://github.com/intershop/intershop-pwa/commit/b8ada93))
- replace any typescript file by configuration (#616) ([7b39473](https://github.com/intershop/intershop-pwa/commit/7b39473))
- parameterized user/customer related success messages ([f739c45](https://github.com/intershop/intershop-pwa/commit/f739c45))
- inquire password for user email/login update (#599) ([9980e21](https://github.com/intershop/intershop-pwa/commit/9980e21))
- same-site property for cookies service ([adc1ec6](https://github.com/intershop/intershop-pwa/commit/adc1ec6))
- product context access directive (#605) ([fedbc59](https://github.com/intershop/intershop-pwa/commit/fedbc59))
- show available stock if available (#598) ([57bf890](https://github.com/intershop/intershop-pwa/commit/57bf890))

### Bug Fixes

- re-apply transferred state for later initialized feature states (#628) ([b2dd286](https://github.com/intershop/intershop-pwa/commit/b2dd286))
- unnecessary feature module load (#631) ([9baa213](https://github.com/intershop/intershop-pwa/commit/9baa213))
- allow parentheses in urls (#611) ([15a66f6](https://github.com/intershop/intershop-pwa/commit/15a66f6))
- adapt nginx Dockerfile to nginx-prometheus-exporter changes and pinned version (#632, #633) ([496753c](https://github.com/intershop/intershop-pwa/commit/496753c))
- adapt purgecss configuration to prevent purging needed styles (#601) ([87a3135](https://github.com/intershop/intershop-pwa/commit/87a3135))
- display validation error messages for payment method ISH Demo Credit Card ([f7f7ea1](https://github.com/intershop/intershop-pwa/commit/f7f7ea1))
- display error message in case the profanity check fails after wishlist/order template creation ([8386523](https://github.com/intershop/intershop-pwa/commit/8386523))
- map server-config value for null correctly ([fef26d9](https://github.com/intershop/intershop-pwa/commit/fef26d9))
- run pipeline only on intershop account (#606) ([f0c3255](https://github.com/intershop/intershop-pwa/commit/f0c3255))
- repair add-destroy schematic (#602) ([bcc0401](https://github.com/intershop/intershop-pwa/commit/bcc0401))

### Performance Improvements

- use lazy properties on product context (#617) ([1126496](https://github.com/intershop/intershop-pwa/commit/1126496))
- forbid omit from lodash-es as it is not used to its full potential (#604) ([30a43c8](https://github.com/intershop/intershop-pwa/commit/30a43c8))

### Documentation

- describe each formly extension (#621) ([0b38846](https://github.com/intershop/intershop-pwa/commit/0b38846))
- documentation for product contexts (#608) ([4657432](https://github.com/intershop/intershop-pwa/commit/4657432))

### BREAKING CHANGES

- Introduced registration form configuration via a new registration configuration service.
- Further form refactorings to use Formly forms.

## [0.28.0](https://github.com/intershop/intershop-pwa/releases/tag/0.28.0) (2021-03-03)

**required Intershop Commerce Management version: 7.10.27.0**

### Features

- introduce formly (a dynamic form library) for standard form handling ([932e36b](https://github.com/intershop/intershop-pwa/commit/932e36b))
- use formly for many forms ([110f28d](https://github.com/intershop/intershop-pwa/commit/110f28d))
- add formly checkbox field, minor formly improvements (#574) ([d850ee6](https://github.com/intershop/intershop-pwa/commit/d850ee6))
- generate lazy component for content-include to be used in application shell ([b8ae40d](https://github.com/intershop/intershop-pwa/commit/b8ae40d))
- multi-channel with multi ICM support (#536,#420) ([434ed47](https://github.com/intershop/intershop-pwa/commit/434ed47))
- set unique ids for form fields in payment components (#586) ([832cdba](https://github.com/intershop/intershop-pwa/commit/832cdba))
- add order template detail links on order template widget (#575) ([8112321](https://github.com/intershop/intershop-pwa/commit/8112321))
- allow overriding component templates and component styles depending on environment (#537) ([b15a471](https://github.com/intershop/intershop-pwa/commit/b15a471))
- provide Dockerfile for deployment without SSR (#538) ([1307a0b](https://github.com/intershop/intershop-pwa/commit/1307a0b))
- use seo metadata provided by CMS REST API for content pages (#540) ([2b473ed](https://github.com/intershop/intershop-pwa/commit/2b473ed))
- display ICM managed display names for sorting keys on listings (#535) ([f432188](https://github.com/intershop/intershop-pwa/commit/f432188))
- devcontainer for VSCode (#515) ([7b3d937](https://github.com/intershop/intershop-pwa/commit/7b3d937))
- **schematics:** generate lazy components for shared components in shell module ([beea0b4](https://github.com/intershop/intershop-pwa/commit/beea0b4))

### Bug Fixes

- use customer id when fetching company user ([3d684bf](https://github.com/intershop/intershop-pwa/commit/3d684bf))
- working and adjusted concardis-directdebit validation (#590) ([deaed69](https://github.com/intershop/intershop-pwa/commit/deaed69))
- flexible safety checks for custom webpack ([c358249](https://github.com/intershop/intershop-pwa/commit/c358249))
- use new checkbox type in directdebit ([3b0adb4](https://github.com/intershop/intershop-pwa/commit/3b0adb4))
- prevent endless loading with empty array for wishlists and order templates (#571) ([3f5f799](https://github.com/intershop/intershop-pwa/commit/3f5f799))
- display of crossed prices in the checkout items widget (#559) ([19d88bb](https://github.com/intershop/intershop-pwa/commit/19d88bb))
- add feature toggle route guard for 'punchout' routes (#527) ([7d27960](https://github.com/intershop/intershop-pwa/commit/7d27960))
- regenerate self signed SSL certificate (#542) ([8ce720d](https://github.com/intershop/intershop-pwa/commit/8ce720d))
- include production webpack in docker build to repair production build ([d464e58](https://github.com/intershop/intershop-pwa/commit/d464e58))
- preserve URLs when errors are encountered (#511) ([97ad95b](https://github.com/intershop/intershop-pwa/commit/97ad95b))
- loading overlay for quickorder ([0fc7045](https://github.com/intershop/intershop-pwa/commit/0fc7045))
- expand minibasket when loading finished ([c96477f](https://github.com/intershop/intershop-pwa/commit/c96477f))
- initialize quantity for retail set parts to repair add to cart from listing pages ([0ab511f](https://github.com/intershop/intershop-pwa/commit/0ab511f))

### Performance Improvements

- restructure chunk splitting for feature toggles (#570) ([6198f8f](https://github.com/intershop/intershop-pwa/commit/6198f8f))
- purgecss for css minification integrated into webpack build (#562) ([2199b82](https://github.com/intershop/intershop-pwa/commit/2199b82))
- shell module as standalone module (#568) ([c438931](https://github.com/intershop/intershop-pwa/commit/c438931))
- move sentry to lazy loaded bundle by lazy invocation ([983ae82](https://github.com/intershop/intershop-pwa/commit/983ae82))
- move formly to lazy bundle (#566) ([101e3a3](https://github.com/intershop/intershop-pwa/commit/101e3a3))
- main bundle reduction (#553) ([0f3b23f](https://github.com/intershop/intershop-pwa/commit/0f3b23f))
- add purgecss for css minification ([e4aa79f](https://github.com/intershop/intershop-pwa/commit/e4aa79f))
- tune webpack chunk settings ([5e8f67e](https://github.com/intershop/intershop-pwa/commit/5e8f67e))
- remove data-testing attributes for production build ([82ad581](https://github.com/intershop/intershop-pwa/commit/82ad581))

### Documentation

- dependencies update/upgrade documentation additions (branch naming, package-lock.json) ([a695bc4](https://github.com/intershop/intershop-pwa/commit/a695bc4))
- optimizations documentation ([ef85d1c](https://github.com/intershop/intershop-pwa/commit/ef85d1c))
- add chapter running server side rendering with https ([eeddc76](https://github.com/intershop/intershop-pwa/commit/eeddc76))

### Code Refactoring

- product selector memoization (#528) ([ac0b35a](https://github.com/intershop/intershop-pwa/commit/ac0b35a))
- use native swiper instead of ngx-swiper-wrapper (#552) ([f596d0b](https://github.com/intershop/intershop-pwa/commit/f596d0b))

### BREAKING CHANGES

- Introduced formly for standard form handling. See [Migrations / 0.27 to 0.28](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#027-to-028) for more details.
- Refactoring the way product memoization is done and additional product components retrieve data with context facade
- Removed the dependency to ngx-swiper-wrapper and used swiper with native Angular support.
- Refactored setting `production` mode to support running Angular CLI with multiple configurations (`ng serve -c brand,production`).

## [0.27.0](https://github.com/intershop/intershop-pwa/releases/tag/0.27.0) (2021-01-30)

**required Intershop Commerce Management version: 7.10.27.0**

### Features

- support for Cybersource credit card payment (#464) ([e953874](https://github.com/intershop/intershop-pwa/commit/e953874))
- punchout functionality - user management, basket transmission, functions routing (OCI Punchout) (#490) ([2529e89](https://github.com/intershop/intershop-pwa/commit/2529e89))
- add structural not-role-toggle-directive to hide html elements if the current user has a certain role ([24fb46b](https://github.com/intershop/intershop-pwa/commit/24fb46b))
- extend authorization store by roleIds ([68a3fc6](https://github.com/intershop/intershop-pwa/commit/68a3fc6))
- set business errors independent of REST API errors to trigger the error page ([397a285](https://github.com/intershop/intershop-pwa/commit/397a285))
- add order templates widget on MyAccount overview page (#502) ([6eff141](https://github.com/intershop/intershop-pwa/commit/6eff141))
- if the basket total equals 0 display only an info message on checkout payment page (#499) ([508450f](https://github.com/intershop/intershop-pwa/commit/508450f))

### Bug Fixes

- use localStorage as storage for oauth (#518) ([ae000ee](https://github.com/intershop/intershop-pwa/commit/ae000ee))
- hide badge for recaptcha v3 (#510) ([c3568cc](https://github.com/intershop/intershop-pwa/commit/c3568cc))
- use carousel select method to set active slide (#508) ([2302a53](https://github.com/intershop/intershop-pwa/commit/2302a53))
- properly calculate product availability ([a5e4612](https://github.com/intershop/intershop-pwa/commit/a5e4612))
- send PGID for CMS View Context calls (#501) ([402ffc6](https://github.com/intershop/intershop-pwa/commit/402ffc6))
- user registration mail always sent in english even if the user triggers the registration from a different locale (#498) ([d235ca7](https://github.com/intershop/intershop-pwa/commit/d235ca7))
- basket promotion code assignment gets lost after registration (#497) ([4b42fa6](https://github.com/intershop/intershop-pwa/commit/4b42fa6))
- wrap budget-widget to approval scope (#493) ([3bffb9a](https://github.com/intershop/intershop-pwa/commit/3bffb9a))
- payment error message when multiple errors are received after creating a payment instrument (#491) ([2c54961](https://github.com/intershop/intershop-pwa/commit/2c54961))

### Documentation

- documentation and migration note for product contexts (#517) ([043d2eb](https://github.com/intershop/intershop-pwa/commit/043d2eb))

### Code Refactoring

- introduce product context (#403) ([cce23e3](https://github.com/intershop/intershop-pwa/commit/cce23e3))

### BREAKING CHANGES

- refactoring the way product specific components retrieve data with context facade

## [0.26.0](https://github.com/intershop/intershop-pwa/releases/tag/0.26.0) (2020-12-18)

**required Intershop Commerce Management version: 7.10.26.2-LTS**

**required/tested Node.js version: 14.15.0 LTS (including npm 6.14.8)**

### Features

- checkout - simple basket acceleration (#479) ([ff08159](https://github.com/intershop/intershop-pwa/commit/ff08159))
- display buyer widget for B2B customers on checkout and order details pages (#486) ([5f046c1](https://github.com/intershop/intershop-pwa/commit/5f046c1))
- custom attributes support for basket and orders (#476) ([6cc98e0](https://github.com/intershop/intershop-pwa/commit/6cc98e0))
- Requisition Management / Order Approval functionality (#326) ([eee665f](https://github.com/intershop/intershop-pwa/commit/eee665f))
- SSO with Auth0 for B2C (#352) ([a8cc433](https://github.com/intershop/intershop-pwa/commit/a8cc433))
- use new REST API for filters and products on master variation page (#414) ([5b9847c](https://github.com/intershop/intershop-pwa/commit/5b9847c))
- **schematics:** adapt lazy-components for projects (#437) ([18a3f2f](https://github.com/intershop/intershop-pwa/commit/18a3f2f))
- add server configuration pipe and feature toggle pipe ([906a5b4](https://github.com/intershop/intershop-pwa/commit/906a5b4))

### Bug Fixes

- display the inactive status on the b2b user list ([5f7a55e](https://github.com/intershop/intershop-pwa/commit/5f7a55e))
- repair schema build (#475) ([96e12f9](https://github.com/intershop/intershop-pwa/commit/96e12f9))
- display only one validation error for a form element at once ([fdc1480](https://github.com/intershop/intershop-pwa/commit/fdc1480))
- replace interfering special characters from product and category slugs (#469) ([591fc99](https://github.com/intershop/intershop-pwa/commit/591fc99))
- disable add-to-cart button on quick order page if the form is invalid ([57bcabb](https://github.com/intershop/intershop-pwa/commit/57bcabb))
- hide add-to-cart button on order template details page if the order template is empty ([11f71ca](https://github.com/intershop/intershop-pwa/commit/11f71ca))
- customization start script should add themes with inject false (#462) ([bb15b79](https://github.com/intershop/intershop-pwa/commit/bb15b79))
- prevent error if language switched on order details page in case of ssr ([0023025](https://github.com/intershop/intershop-pwa/commit/0023025))

### Performance Improvements

- prevent SSR rendering cycle for static resources (#465) ([2b81911](https://github.com/intershop/intershop-pwa/commit/2b81911))
- run configurations call only once for SSR (#466) ([8c211de](https://github.com/intershop/intershop-pwa/commit/8c211de))

### Documentation

- add migration note for new multi-channel format (#457) ([ab733d1](https://github.com/intershop/intershop-pwa/commit/ab733d1))

## [0.25.0](https://github.com/intershop/intershop-pwa/releases/tag/0.25.0) (2020-11-05)

**required Intershop Commerce Management version: 7.10.24.1**

### Features

- configurable, granular custom cookie consent implementation (#357) ([6bb732e](https://github.com/intershop/intershop-pwa/commit/6bb732e))
- remove ngx-cookie-banner functionality ([38231c1](https://github.com/intershop/intershop-pwa/commit/38231c1))
- render view context content (#4) ([dc36c87](https://github.com/intershop/intershop-pwa/commit/dc36c87))
- multi channel deployment with context path support (#432) ([1f35ad6](https://github.com/intershop/intershop-pwa/commit/1f35ad6))
- remove unnecessary first/last name fields from password retrieval (#408) ([e9421c2](https://github.com/intershop/intershop-pwa/commit/e9421c2))
- monitor PWA containers with prometheus (#391) ([f4fb1b1](https://github.com/intershop/intershop-pwa/commit/f4fb1b1))
- display user role description on create/edit b2b user pages (#393) ([07b6ab9](https://github.com/intershop/intershop-pwa/commit/07b6ab9))

### Bug Fixes

- consolidate the display of promotion messages (#448) ([ce3cfb7](https://github.com/intershop/intershop-pwa/commit/ce3cfb7))
- repair setting of locales meta tags (#451) ([dc3a206](https://github.com/intershop/intershop-pwa/commit/dc3a206))
- improve the ui of out-of-stock products on the cart page after a failing cart validation (#443) ([5488707](https://github.com/intershop/intershop-pwa/commit/5488707))
- display line item quantity on the cart page after merging quantities (#442) ([aab2be4](https://github.com/intershop/intershop-pwa/commit/aab2be4))
- display error messages on the header of checkout pages ([c6f526a](https://github.com/intershop/intershop-pwa/commit/c6f526a))
- display error message for duplicate payment instruments on checkout payment page ([31cfbab](https://github.com/intershop/intershop-pwa/commit/31cfbab))
- submit a promotion code by pressing enter (#436) ([360b649](https://github.com/intershop/intershop-pwa/commit/360b649))
- repair limitation for theme apply to fix prod mode with webpack-dev-server (#430) ([f45c6a0](https://github.com/intershop/intershop-pwa/commit/f45c6a0))
- adjust quote list item padding (#418) ([6547d1e](https://github.com/intershop/intershop-pwa/commit/6547d1e))
- set default icmHost in nginx URL rewiriting to prevent security issue (#415) ([a8992d6](https://github.com/intershop/intershop-pwa/commit/a8992d6))
- provide configuration meta reducer only on SSR side (#415) ([cf09ee8](https://github.com/intershop/intershop-pwa/commit/cf09ee8))
- repair setting of canonical urls and other meta data (#412) ([05e54c0](https://github.com/intershop/intershop-pwa/commit/05e54c0))
- remove loading animation after address creation during the checkout (#413) ([eb08ae9](https://github.com/intershop/intershop-pwa/commit/eb08ae9))
- display error messages on the b2b user edit profile page (#409) ([3800872](https://github.com/intershop/intershop-pwa/commit/3800872))
- set breadcrumb from routing only if none was set previously (#399,#402) ([530ba90](https://github.com/intershop/intershop-pwa/commit/530ba90))
- display and edit the b2b user's active status in the organization management of the myAccount (#397) ([e44fbf8](https://github.com/intershop/intershop-pwa/commit/e44fbf8))
- close toast on routing (#404) ([bb38d50](https://github.com/intershop/intershop-pwa/commit/bb38d50))
- don't trigger order actions unnecessarily ([56e2bc5](https://github.com/intershop/intershop-pwa/commit/56e2bc5))
- send payment parameters for redirect before checkout payment methods ([119bbbc](https://github.com/intershop/intershop-pwa/commit/119bbbc))
- remove basket messages after route changes ([169abae](https://github.com/intershop/intershop-pwa/commit/169abae))
- display payment costs according to the configured display type (gross/net) (#396) ([b89c59d](https://github.com/intershop/intershop-pwa/commit/b89c59d))
- replace parantheses in URL slugs (#395) ([85e110a](https://github.com/intershop/intershop-pwa/commit/85e110a))

### Documentation

- improve configuration documentation ([c0091ea](https://github.com/intershop/intershop-pwa/commit/c0091ea))
- deployment and PWA building blocks documentation (#398) ([807fafb](https://github.com/intershop/intershop-pwa/commit/807fafb))
- deployment documentation rework (#398) ([9640bfb](https://github.com/intershop/intershop-pwa/commit/9640bfb))
- customization for cypress tests (#426) ([a5dc212](https://github.com/intershop/intershop-pwa/commit/a5dc212))

### Code Refactoring

- abstract ICM as identity provider (#447) ([f97b114](https://github.com/intershop/intershop-pwa/commit/f97b114))

### BREAKING CHANGES

- Setting certain cookies can no longer be dependent on the `cookieLawSeen$` state but needs to be checked with `cookieService.cookieConsentFor()`.
- The login/logout handling is abstracted as identity provider service.
- The format for setting up Multi-Site support with nginx has changed.

## [0.24.0](https://github.com/intershop/intershop-pwa/releases/tag/0.24.0) (2020-09-30)

**required Intershop Commerce Management version: 7.10.22.3**

### Features

- recheck concardis credit card cvc if necessary (#359) ([8c4b452](https://github.com/intershop/intershop-pwa/commit/8c4b452))
- add posibility to deploy nginx with selected features (#386) ([1f0c4a4](https://github.com/intershop/intershop-pwa/commit/1f0c4a4))
- component for inplace editing ([25f10f1](https://github.com/intershop/intershop-pwa/commit/25f10f1))
- introduce dedicated endpoint for b2b user related API requests ([b15e6c9](https://github.com/intershop/intershop-pwa/commit/b15e6c9))
- styled toasts for success and error messages (#356) ([9e7d99b](https://github.com/intershop/intershop-pwa/commit/9e7d99b))
- save for later for Concardis Direct Debit (#319) ([a31f16c](https://github.com/intershop/intershop-pwa/commit/a31f16c))
- node script to clean up localization files 'npm run clean-localizations' ([9863fe7](https://github.com/intershop/intershop-pwa/commit/9863fe7))
- enhance option to overwrite URL for ICM in express server (#372) ([edf07dc](https://github.com/intershop/intershop-pwa/commit/edf07dc))

### Bug Fixes

- use product name for basket line item name and order line item name for orders (#387) ([6c7a3d7](https://github.com/intershop/intershop-pwa/commit/6c7a3d7))
- prevent navigating twice on user login ([75fdc15](https://github.com/intershop/intershop-pwa/commit/75fdc15))
- set breadcrumb only on successful navigation ([3e55b63](https://github.com/intershop/intershop-pwa/commit/3e55b63))
- **schematics:** respect original component selector when generating lazy components (#379) ([b92230a](https://github.com/intershop/intershop-pwa/commit/b92230a))
- load lazy components via extension modules (#376) ([e1eacd1](https://github.com/intershop/intershop-pwa/commit/e1eacd1))
- **schematics:** enable customized-copy schematic for subfolders (#374) ([932aa01](https://github.com/intershop/intershop-pwa/commit/932aa01))

### Performance Improvements

- add preload link for stylesheet (#389) ([dee2bba](https://github.com/intershop/intershop-pwa/commit/dee2bba))
- remove product views from entities for improved memoization (#373) ([4805fed](https://github.com/intershop/intershop-pwa/commit/4805fed))

### Code Refactoring

- rework quoting feature (#367) ([3ce106b](https://github.com/intershop/intershop-pwa/commit/3ce106b))

### BREAKING CHANGES

- The quoting feature was completely reworked to provide a better performance with growing numbers of users quotes and quote requests. It was changed to work with less necessary REST requests (e.g. by relying on improvements in the quoting REST API) and several known issues were fixed. Besides that the whole implementation was reworked with newer, improved implementation patterns of the PWA.

## [0.23.0](https://github.com/intershop/intershop-pwa/releases/tag/0.23.0) (2020-08-27)

**required Intershop Commerce Management version: 7.10.21.0**

### Features

- support for configurable products via Tacton CPQ integration (#329) ([2a60f9d](https://github.com/intershop/intershop-pwa/commit/2a60f9d))
- switch customer REST resource depending on application and customer type (#302) ([04abd41](https://github.com/intershop/intershop-pwa/commit/04abd41))
- switch to the new headless REST application type applications demo content (#302) ([741454c](https://github.com/intershop/intershop-pwa/commit/741454c))
- switch to the new headless REST application type CMS content model (#302) ([50dc72e](https://github.com/intershop/intershop-pwa/commit/50dc72e))
- switch from the Responsive Starter Store applications to the new headless REST application type applications (#302) ([0a356cc](https://github.com/intershop/intershop-pwa/commit/0a356cc))

### Bug Fixes

- tacton improvements (#368) ([84ed633](https://github.com/intershop/intershop-pwa/commit/84ed633))
- **schematics:** reduce greedy path replacement ([1235287](https://github.com/intershop/intershop-pwa/commit/1235287))
- **schematics:** enable move-component helper for projects ([d8299ea](https://github.com/intershop/intershop-pwa/commit/d8299ea))
- enforce noSpecialChars for firstName and lastName ([f01c2de](https://github.com/intershop/intershop-pwa/commit/f01c2de))
- **schematics:** disable subpaging for page schematic if parent page cannot be found ([f01c0ce](https://github.com/intershop/intershop-pwa/commit/f01c0ce))
- adapt localized texts for user management (#346, #358) ([29dc79d](https://github.com/intershop/intershop-pwa/commit/29dc79d))
- repair sentry error reporting (#339) ([6b41035](https://github.com/intershop/intershop-pwa/commit/6b41035))

### Documentation

- document HTTP error mapping for ICM errors (#339) ([9e3b6d7](https://github.com/intershop/intershop-pwa/commit/9e3b6d7))
- add headless app type migration information (#303) ([2c13f44](https://github.com/intershop/intershop-pwa/commit/2c13f44))

### Code Refactoring

- adapt to REST API changes for user management ([d814cc0](https://github.com/intershop/intershop-pwa/commit/d814cc0))
- remove deprecated exports (#347) ([7ef505a](https://github.com/intershop/intershop-pwa/commit/7ef505a))
- remove groups from shared components (#362)

### BREAKING CHANGES

- With the introduction of a new headless Application Type (intershop.REST) in ICM 7.10.21.0 the PWA default environment configuration was switched to the new headless 'rest' application in the ICM demo content. Because of this change the PWA now uses the ICM CMS content model and demo content of the new headless 'rest' application.
- User management calls were adapted to match CMS REST API changes in ICM.
- Deprecated exports were removed concerning the NgRx testing refactorings introduced in version 0.21.

## [0.22.0](https://github.com/intershop/intershop-pwa/releases/tag/0.22.0) (2020-07-23)

**required Intershop Commerce Management version: 7.10.20.1**

### Features

- show account identifier attribute of payment instrument ([75e4a31](https://github.com/intershop/intershop-pwa/commit/75e4a31))
- use new filter REST API for product filter display and navigation (#148) ([3f493c5](https://github.com/intershop/intershop-pwa/commit/3f493c5))
- display loading page when service worker is booting up ([9f89684](https://github.com/intershop/intershop-pwa/commit/9f89684))
- manage B2B user roles in organization-management ([5ac6577](https://github.com/intershop/intershop-pwa/commit/5ac6577))
- display information for B2B users above my account navigation (#298) ([ee5e1cb](https://github.com/intershop/intershop-pwa/commit/ee5e1cb))
- add guard, directive and service for toggling depending on user permissions (#298) ([af9ce44](https://github.com/intershop/intershop-pwa/commit/af9ce44))
- retrieve roles and permissions for B2B users (#298) ([e4ba676](https://github.com/intershop/intershop-pwa/commit/e4ba676))
- delete B2B users in organization-management (#258, #310) ([d8d8523](https://github.com/intershop/intershop-pwa/commit/d8d8523))
- add and edit B2B users in organization-management (#260, #310) ([3185084](https://github.com/intershop/intershop-pwa/commit/3185084))
- serialize currently matched path in router state ([d83068c](https://github.com/intershop/intershop-pwa/commit/d83068c))
- add B2B users management base version as part of organization management in my account (#295, #246, #247, #305) ([9c46eec](https://github.com/intershop/intershop-pwa/commit/9c46eec))

### Bug Fixes

- inconsistent breadcrumb updates on category, search & product page ([83ac5f9](https://github.com/intershop/intershop-pwa/commit/83ac5f9))
- Minor user management issues (#338) ([caaa600](https://github.com/intershop/intershop-pwa/commit/caaa600))
- **tslint-rules:** repair use-async-synchronization-in-tests rule (#330) ([e83437d](https://github.com/intershop/intershop-pwa/commit/e83437d))
- save bic for concardis direct debit payment method (#323) ([b5d26dd](https://github.com/intershop/intershop-pwa/commit/b5d26dd))
- set 404 status when route is not found ([29570b4](https://github.com/intershop/intershop-pwa/commit/29570b4))
- Correcting field type for Concardis directdebit payment error message key (#317) ([a762d12](https://github.com/intershop/intershop-pwa/commit/a762d12))
- delay routing and only route after profile edit (#314) ([9c08b52](https://github.com/intershop/intershop-pwa/commit/9c08b52))

### Performance Improvements

- correctly memoize cms selectors ([fa910d4](https://github.com/intershop/intershop-pwa/commit/fa910d4))
- correctly memoize category selectors (#284) ([afc69ed](https://github.com/intershop/intershop-pwa/commit/afc69ed))

### Documentation

- add documentation for progressive web app features ([8d96718](https://github.com/intershop/intershop-pwa/commit/8d96718))
- add KB labels and adjust title for documentation overview (#301) ([5f5ca9a](https://github.com/intershop/intershop-pwa/commit/5f5ca9a))

### Code Refactoring

- remove ngx-custom-validators dependency and custom implement the two validators we use (#332) ([7a3fb0a](https://github.com/intershop/intershop-pwa/commit/7a3fb0a))
- adapt parsing for changed configurations REST call (#307) ([3d82674](https://github.com/intershop/intershop-pwa/commit/3d82674))
- set breadcrumb trail consistently via store (#289) ([8282584](https://github.com/intershop/intershop-pwa/commit/8282584))

### BREAKING CHANGES

- Dependency ngx-custom-validators was removed from the project.
- Adapted parsing for changed configurations REST call in Intershop Commerce Management version 7.10.20.1.
- Setting the breadcrumb trail can now only be done consistently by using route data or by dispatching the appropriate action.

## [0.21.0](https://github.com/intershop/intershop-pwa/releases/tag/0.21.0) (2020-06-23)

**required Intershop Commerce Management version: 7.10.19.2**

### Features

- add migration script for NgRx 8 creator functions ([5800cd2](https://github.com/intershop/intershop-pwa/commit/5800cd2))
- **schematics:** add helper for adding destroy subject to Angular artifact ([4013ff6](https://github.com/intershop/intershop-pwa/commit/4013ff6))
- **tslint-rules:** add rule for enforcing newline before root statements ([34c20e5](https://github.com/intershop/intershop-pwa/commit/34c20e5))
- **tslint-rules:** add tslint rule force-jsdoc-comments for enforcing JSDoc usage ([26b25a7](https://github.com/intershop/intershop-pwa/commit/26b25a7))
- **tslint-rules:** add rule for removing star imports in store ([3c0b528](https://github.com/intershop/intershop-pwa/commit/3c0b528))

### Bug Fixes

- add a product to order template on a product row (#271, #277) ([4714657](https://github.com/intershop/intershop-pwa/commit/4714657))

### Documentation

- update 0.20-to-0.21 migration guide ([6324ebe](https://github.com/intershop/intershop-pwa/commit/6324ebe))
- update state management documentation regarding creator functions ([8818b16](https://github.com/intershop/intershop-pwa/commit/8818b16))
- update for the new store structure ([2d9cafa](https://github.com/intershop/intershop-pwa/commit/2d9cafa))
- new testing approach for NgRx ([b573e18](https://github.com/intershop/intershop-pwa/commit/b573e18))
- update for using destroy Subject with takeUntil in Angular artifacts ([8331521](https://github.com/intershop/intershop-pwa/commit/8331521))

### Code Refactoring

- change sending of PGID for CMS calls according to ICM 7.10.19.2 CMS REST API changes (#192, #193) ([a5bfff5](https://github.com/intershop/intershop-pwa/commit/a5bfff5))
- supply operators for resolving links via ApiService ([82e0de7](https://github.com/intershop/intershop-pwa/commit/82e0de7))
- perform action creator migration ([31acf5d](https://github.com/intershop/intershop-pwa/commit/31acf5d))
- new structure for core store ([0fe99e4](https://github.com/intershop/intershop-pwa/commit/0fe99e4))

### BREAKING CHANGES

- Pipable operators for resolving links are now ApiService members.
- NgRx code artifacts are transformed to a new pattern, follow the instructions in the migration guide.
- Core store was restructured. Follow instructions in the migration guide.
- CMS service personalized content call adaptions to match CMS REST API changes in ICM.

## [0.20.0](https://github.com/intershop/intershop-pwa/releases/tag/0.20.0) (2020-05-29)

**required Intershop Commerce Management version: 7.10.18.1**

### Features

- add order templates functionality as configurable feature (#230) ([75683ce](https://github.com/intershop/intershop-pwa/commit/75683ce))
- remove (feature toggle) security question on forgot password and registration page (#255, #253) ([9b5d10d](https://github.com/intershop/intershop-pwa/commit/9b5d10d))
- display captcha component according to the related ICM captcha service (#200) ([447317b](https://github.com/intershop/intershop-pwa/commit/447317b))
- **tslint-rules:** tslint rule ng-module-sorted-fields respects bundle arrays in modules ([09f4295](https://github.com/intershop/intershop-pwa/commit/09f4295))
- **tslint-rules:** add testing capabilities for tslint-rules ([c0fc9c8](https://github.com/intershop/intershop-pwa/commit/c0fc9c8))
- add a link to order details page for registered users on checkout receipt page (#216) ([64b0056](https://github.com/intershop/intershop-pwa/commit/64b0056))
- **schematics:** add lazy option to page schematic ([d07a378](https://github.com/intershop/intershop-pwa/commit/d07a378))
- **schematics:** adapt schematics for creating files in projects ([3e08d4b](https://github.com/intershop/intershop-pwa/commit/3e08d4b))
- **tslint-rules:** adapt folder structure rules for projects ([187a485](https://github.com/intershop/intershop-pwa/commit/187a485))
- respect returnUrl query parameter when logout guard is triggered ([c7d49c2](https://github.com/intershop/intershop-pwa/commit/c7d49c2))
- accept 'always' and 'never' as input for feature-toggle artifacts ([e2372a9](https://github.com/intershop/intershop-pwa/commit/e2372a9))
- **schematics:** add schematic for generating lazy component (#215) ([0468e73](https://github.com/intershop/intershop-pwa/commit/0468e73))
- introduce module-loader for lazy loading extension modules depending on feature toggles (#215) ([fc6e504](https://github.com/intershop/intershop-pwa/commit/fc6e504))
- **schematics:** add linting to files generated or touched by schematics ([bf21771](https://github.com/intershop/intershop-pwa/commit/bf21771))
- display loading animation while restoring user on first navigation (#211) ([337d9d3](https://github.com/intershop/intershop-pwa/commit/337d9d3))

### Bug Fixes

- PWA container healthcheck now supports ICM https (#261) ([8ce42be](https://github.com/intershop/intershop-pwa/commit/8ce42be))
- **schematics:** handle imports of complex typings for input decorated fields in lazy-component schematic (#254) ([b1b4ec3](https://github.com/intershop/intershop-pwa/commit/b1b4ec3))
- set captcha authorization key for 'contact us' REST requests (#200) ([a838a8a](https://github.com/intershop/intershop-pwa/commit/a838a8a))
- display concardis direct debit form on checkout payment page (#240) ([30444ef](https://github.com/intershop/intershop-pwa/commit/30444ef))
- find possible variation for selection based on changed attribute ([a951e27](https://github.com/intershop/intershop-pwa/commit/a951e27))
- variation select "Not Available" flag in case of one variation attribute ([0229788](https://github.com/intershop/intershop-pwa/commit/0229788))
- display the region in the address form on the checkout address page (#241) ([7b8e1bf](https://github.com/intershop/intershop-pwa/commit/7b8e1bf))
- hide loading spinner after order creation failed (#217) ([9d48c50](https://github.com/intershop/intershop-pwa/commit/9d48c50))
- use exhaustMap for user login to prevent creating multiple sessions (#236) ([b144f47](https://github.com/intershop/intershop-pwa/commit/b144f47))
- add a concardis direct debit payment instrument on checkout payment page (#234) ([b778b00](https://github.com/intershop/intershop-pwa/commit/b778b00))
- prevent mixed locale due to race condition using ngx-translate service use method (#207, #222) ([7750993](https://github.com/intershop/intershop-pwa/commit/7750993))
- debounce loading wishlists to prevent picking up wrong token ([cf35e52](https://github.com/intershop/intershop-pwa/commit/cf35e52))

### Documentation

- replace dead link ([df996e4](https://github.com/intershop/intershop-pwa/commit/df996e4))
- guide for upgrading dependencies (#243) ([663a361](https://github.com/intershop/intershop-pwa/commit/663a361))
- notes on migrating to PWA with Angular 9 (#215) ([4d1e806](https://github.com/intershop/intershop-pwa/commit/4d1e806))

### BREAKING CHANGES

- Upgrade to Angular 9, follow the recommendations in the migration guide.
- The feature toggle 'securityQuestion' and the related functionality has been removed.
- The feature toggles 'captchaV2' and 'captchaV3' are obsolete. This is now configured via ICM Backoffice and fetched via 'configurations' REST call. The component 'ish-captcha' is replaced by 'ish-lazy-captcha' with a mandatory topic input for the captcha context to check whether it is activated or not.

## [0.19.1](https://github.com/intershop/intershop-pwa/releases/tag/0.19.1) (2020-04-28)

**required Intershop Commerce Management version: 7.10.17.0**

### Bug Fixes

- suppress display of total payment costs with zero value on cost summary ([67fa061](https://github.com/intershop/intershop-pwa/commit/67fa061))
- display correct label for VAT inclusion on cost summary ([910e643](https://github.com/intershop/intershop-pwa/commit/910e643))
- do not synchronize server config via state transfer ([e0ae3f3](https://github.com/intershop/intershop-pwa/commit/e0ae3f3))

### Documentation

- import and update documentation from PWA Guide (#125) ([4934b66](https://github.com/intershop/intershop-pwa/commit/4934b66))

## [0.19.0](https://github.com/intershop/intershop-pwa/releases/tag/0.19.0) (2020-04-20)

**required Intershop Commerce Management version: 7.10.17.0**

### Features

- wishlist widget on account overview page (#195) ([8ae0b7e](https://github.com/intershop/intershop-pwa/commit/8ae0b7e))
- detect device type in nginx and cache SSR responses individually (#171, #188) ([00c9640](https://github.com/intershop/intershop-pwa/commit/00c9640))
- add quickorder functionality as configurable feature (#177) ([97c4cd6](https://github.com/intershop/intershop-pwa/commit/97c4cd6))
- integrated quote request submittedDate ([86839d7](https://github.com/intershop/intershop-pwa/commit/86839d7))
- **schematics:** add customization script for enabling and disabling service worker ([30bec4d](https://github.com/intershop/intershop-pwa/commit/30bec4d))
- calculate payment cost threshold according to ICM pricing settings (#179) ([eb981ec](https://github.com/intershop/intershop-pwa/commit/eb981ec))
- display checkout and order prices respecting ICM pricing settings (#179) ([44ad2a5](https://github.com/intershop/intershop-pwa/commit/44ad2a5))
- read ICM server configuration on PWA startup (#179) ([d305c8a](https://github.com/intershop/intershop-pwa/commit/d305c8a))
- delete payment instrument link on checkout payment page (#182) ([2944589](https://github.com/intershop/intershop-pwa/commit/2944589))
- add opt-in mocks for browser to fix window, document, HTMLElement and navigator issues on server-side rendering (#180) ([e9d4551](https://github.com/intershop/intershop-pwa/commit/e9d4551))
- support Concardis Direct Debit payment method (#165) ([567b61e](https://github.com/intershop/intershop-pwa/commit/567b61e))
- make PWA docker build configuration aware (#143) ([3af4a1d](https://github.com/intershop/intershop-pwa/commit/3af4a1d))
- nginx can be run with default PWA channel configuration if environment variables are omitted (#143) ([3634d44](https://github.com/intershop/intershop-pwa/commit/3634d44))
- make complete domain configurable for multi-channel setup (#143) ([c8d6eb5](https://github.com/intershop/intershop-pwa/commit/c8d6eb5))

### Bug Fixes

- prevent an error after login on checkout address page (#194) ([8fbeaf2](https://github.com/intershop/intershop-pwa/commit/8fbeaf2))
- deactivate service worker index.html fetch ([be4e289](https://github.com/intershop/intershop-pwa/commit/be4e289))
- if payment has failed after order creation navigate to checkout payment page and display a message (#184) ([1a1bccb](https://github.com/intershop/intershop-pwa/commit/1a1bccb))
- fix styling for product-row product items in carousels and add tile configuration options to the product link carousel ([e41e2e8](https://github.com/intershop/intershop-pwa/commit/e41e2e8))
- display swiper navigation buttons (fixed styling issue) ([7f66cc7](https://github.com/intershop/intershop-pwa/commit/7f66cc7))
- fix styling of user information box for mobile (#90, #168) ([b7843e7](https://github.com/intershop/intershop-pwa/commit/b7843e7))
- remove personalized content from store ([8da665e](https://github.com/intershop/intershop-pwa/commit/8da665e))
- prevent changing the basket item quantities if they belong to a quote (#81) ([d74cb3d](https://github.com/intershop/intershop-pwa/commit/d74cb3d))
- prevent "null" as search term on search box initialization (#159) ([6bacee7](https://github.com/intershop/intershop-pwa/commit/6bacee7))
- use data.id for ContentPageletEntryPoint id (#151, #152) ([0529af5](https://github.com/intershop/intershop-pwa/commit/0529af5))
- consistent success messages in My Account area (#147) ([41bb17e](https://github.com/intershop/intershop-pwa/commit/41bb17e))

### Performance Improvements

- deactivate throttle time in products effects on SSR ([274ca49](https://github.com/intershop/intershop-pwa/commit/274ca49))
- use new parameter omitHasOnlineProducts for more performant categories tree call ([52e3cd0](https://github.com/intershop/intershop-pwa/commit/52e3cd0))

### Documentation

- add note about router-store replacement to migration guide ([632e74f](https://github.com/intershop/intershop-pwa/commit/632e74f))
- add labels for syncing documents to knowledge base ([b4280a2](https://github.com/intershop/intershop-pwa/commit/b4280a2))

### Code Refactoring

- rename device type 'pc' to 'desktop' ([fa8afc5](https://github.com/intershop/intershop-pwa/commit/fa8afc5))
- use @ngrx/router-store instead of ngrx-router (#167) ([032b2ae](https://github.com/intershop/intershop-pwa/commit/032b2ae))

### BREAKING CHANGES

- renamed device type 'pc' to 'desktop'
- Angular CLI environment configurations now need defaultDeviceType property
- all dependencies of ngrx-router are replaced with @ngrx/router-store

## [0.18.1](https://github.com/intershop/intershop-pwa/releases/tag/0.18.1) (2020-04-01)

**required Intershop Commerce Management version: 7.10.16.6**

### Features

- support Concardis Direct Debit payment method (#165) ([a3b3e74](https://github.com/intershop/intershop-pwa/commit/a3b3e74))

## [0.18.0](https://github.com/intershop/intershop-pwa/releases/tag/0.18.0) (2020-03-09)

**required Intershop Commerce Management version: 7.10.16.6**

### Features

- manage multiple personal wishlists (#34, #129) ([199f25b](https://github.com/intershop/intershop-pwa/commit/199f25b))
- SEO friendly localized URLs for category and product list pages (#110) ([4e3169e](https://github.com/intershop/intershop-pwa/commit/4e3169e))
- SEO friendly localized URLs for product detail pages (#110) ([91767f3](https://github.com/intershop/intershop-pwa/commit/91767f3))
- support running ICM and PWA in hybrid mode (#99) ([d95b36e](https://github.com/intershop/intershop-pwa/commit/d95b36e))
- HTTPS deployment for universal server (#99) ([90e6440](https://github.com/intershop/intershop-pwa/commit/90e6440))
- proxy ICM through express server (#99) ([f39bd83](https://github.com/intershop/intershop-pwa/commit/f39bd83))
- use nginx with https upstream (#99) ([d0fdd75](https://github.com/intershop/intershop-pwa/commit/d0fdd75))
- add support for CMS Landing Page components (#108) ([da50347](https://github.com/intershop/intershop-pwa/commit/da50347))
- use morgan for logging in expressjs server ([ea4c800](https://github.com/intershop/intershop-pwa/commit/ea4c800))
- add url property to RouteNavigation ([ca946f2](https://github.com/intershop/intershop-pwa/commit/ca946f2))
- extend ishServerHtml directive to apply default handling to 'javascript:' links and allow a callback function in combination with further link handling ([8716834](https://github.com/intershop/intershop-pwa/commit/8716834))
- use ishServerHtml for header error-keys in error-message component ([2e87448](https://github.com/intershop/intershop-pwa/commit/2e87448))
- error-message component uses header error-key as fallback ([b4f7ae9](https://github.com/intershop/intershop-pwa/commit/b4f7ae9))
- dynamic breadcrumb for quote-edit and quote-request-edit ([5769cba](https://github.com/intershop/intershop-pwa/commit/5769cba))
- provide preview image for social media sharing - add og:image to meta tags (#126) ([52a1907](https://github.com/intershop/intershop-pwa/commit/52a1907))
- display product labels in product lists (#73, #131) ([7314bf0](https://github.com/intershop/intershop-pwa/commit/7314bf0))
- extended multiple theme support to control system icons (e.g. favicon), manifest.webmanifest and theme-color as well (#88, #100) ([46e84ba](https://github.com/intershop/intershop-pwa/commit/46e84ba))
- **schematics:** create facade skeleton when creating an extension ([c02d4d2](https://github.com/intershop/intershop-pwa/commit/c02d4d2))

### Bug Fixes

- quotes routerActiveLink on account menu ([c95c31f](https://github.com/intershop/intershop-pwa/commit/c95c31f), [5bf460c](https://github.com/intershop/intershop-pwa/commit/5bf460c))
- 'submit quote request' and 'copy submitted quote request' from modal dialog should not navigate to my account (#112) ([8039fe5](https://github.com/intershop/intershop-pwa/commit/8039fe5))
- "Add Quote to Cart" behaviour changed to only route on success and hide the button on error (#51) ([a70da64](https://github.com/intershop/intershop-pwa/commit/a70da64))
- show quote item availability on quote detail page (#51) ([788b6dd](https://github.com/intershop/intershop-pwa/commit/788b6dd))
- save quote request from modal dialog navigates to my account (#56) ([e26d4e1](https://github.com/intershop/intershop-pwa/commit/e26d4e1))
- missing product names in quote items listing (#111) ([af71f23](https://github.com/intershop/intershop-pwa/commit/af71f23))
- breadcrumb quote detail page ([d9ddcfe](https://github.com/intershop/intershop-pwa/commit/d9ddcfe))
- display user friendly error messages for quoting (#51) ([0c9a943](https://github.com/intershop/intershop-pwa/commit/0c9a943))
- add user friendly error message for "Forbidden (QuoteRequest is not editable)" with reload link (ISREST-943) ([671aad3](https://github.com/intershop/intershop-pwa/commit/671aad3))
- correct "Thank you for your quote" page heading to "Thank you for your quote request" (ISREST-945) ([5067f93](https://github.com/intershop/intershop-pwa/commit/5067f93))
- remove duplicated content on "Thank you for your quote request" page (ISREST-944) ([5efa993](https://github.com/intershop/intershop-pwa/commit/5efa993), [d506c8e](https://github.com/intershop/intershop-pwa/commit/d506c8e))
- set correct URL for sharing product page via email (#128, #138) ([a338c22](https://github.com/intershop/intershop-pwa/commit/a338c22))
- respect selected category when switching variations on product detail page ([3a806f3](https://github.com/intershop/intershop-pwa/commit/3a806f3))
- display localized product attribute names (#91, #107) ([3205ba5](https://github.com/intershop/intershop-pwa/commit/3205ba5))
- display product labels on search result pages (#134) ([0062272](https://github.com/intershop/intershop-pwa/commit/0062272))
- remove preferred language management in user profile (#120) ([9f44cff](https://github.com/intershop/intershop-pwa/commit/9f44cff))
- correctly propagate queryParams to login route ([95bf324](https://github.com/intershop/intershop-pwa/commit/95bf324))
- timeout in auth guard only on first routing ([d7a310c](https://github.com/intershop/intershop-pwa/commit/d7a310c))
- change password redirects to login page on success instead of displaying the login dialog (#130) ([ebf8379](https://github.com/intershop/intershop-pwa/commit/ebf8379))
- **schematics:** prevent using same name for store and store-group ([09d66f4](https://github.com/intershop/intershop-pwa/commit/09d66f4))
- **schematics:** make store location selection more robust ([c0ab56c](https://github.com/intershop/intershop-pwa/commit/c0ab56c))

## [0.17.0](https://github.com/intershop/intershop-pwa/releases/tag/0.17.0) (2020-01-24)

**required Intershop Commerce Management version: 7.10.15.2**

### Features

- add customized-copy schematic for creating a customization copy (#77) ([f92bcbc](https://github.com/intershop/intershop-pwa/commit/f92bcbc))
- script for setting up customization (#77) ([0a2059f](https://github.com/intershop/intershop-pwa/commit/0a2059f))
- add My Account / Payment section with saved payment information (#78) ([df8407f](https://github.com/intershop/intershop-pwa/commit/df8407f))
- add anchor scrolling / fragment navigation on the current route for serverHtml content (#80) ([ccf461c](https://github.com/intershop/intershop-pwa/commit/ccf461c))
- include logo images via CSS to configure them via theme styling (#49, #64) ([a5f49fb](https://github.com/intershop/intershop-pwa/commit/a5f49fb))
- styling restructuring for multiple themes support and introduction of an alternative blue theme (#49, #64) ([fb62ebb](https://github.com/intershop/intershop-pwa/commit/fb62ebb))
- support for multiple themes and switching via environment (#49, #64) ([9f53006](https://github.com/intershop/intershop-pwa/commit/9f53006))
- add counter input component (#61) ([a7f5aee](https://github.com/intershop/intershop-pwa/commit/a7f5aee))
- serve robots.txt from universal server (#66) ([34bbd04](https://github.com/intershop/intershop-pwa/commit/34bbd04))
- seo canonical link support (#45) ([7e19179](https://github.com/intershop/intershop-pwa/commit/7e19179))
- remove promotion code from basket (#71) ([16c6f1f](https://github.com/intershop/intershop-pwa/commit/16c6f1f))
- migration script for removing container-component-pattern ([c7a1c9e](https://github.com/intershop/intershop-pwa/commit/c7a1c9e))
- add move-component schematic ([6b1523b](https://github.com/intershop/intershop-pwa/commit/6b1523b))
- basket validation with adjustments on checkout shipping, review & payment page ([b04fadf](https://github.com/intershop/intershop-pwa/commit/b04fadf))
- run Cypress e2e tests with GitHub actions ([996b5c1](https://github.com/intershop/intershop-pwa/commit/996b5c1))
- extend ishServerHtml directive to handle links with callbacks, e.g. to open dialogs (#8) ([08416f7](https://github.com/intershop/intershop-pwa/commit/08416f7))

### Bug Fixes

- missing route in user effects RouterTestingModule (#95, #97) ([a73d17f](https://github.com/intershop/intershop-pwa/commit/a73d17f))
- open 'Terms & Conditions' and 'Privacy Policy' in new tab instead of in a dialog (#84) ([1fcb795](https://github.com/intershop/intershop-pwa/commit/1fcb795))
- my account overview breadcrumb should not have parent / child structure (#43) ([25ce59a](https://github.com/intershop/intershop-pwa/commit/25ce59a))
- prevent elements with non-unique ids in product-variation-select-component (#74, #76) ([85c8cb2](https://github.com/intershop/intershop-pwa/commit/85c8cb2))
- product master should not display product availability and shipping information (#44) ([17c684a](https://github.com/intershop/intershop-pwa/commit/17c684a))
- defer-load images not loading in carousel in Chrome/Chromium on Linux (#47) ([9b0cb0c](https://github.com/intershop/intershop-pwa/commit/9b0cb0c))
- ngx-meta translate on load is not working (#69, #72) ([b77a3ee](https://github.com/intershop/intershop-pwa/commit/b77a3ee))
- repair memoization of promotion selectors (#70) ([3ea5ee9](https://github.com/intershop/intershop-pwa/commit/3ea5ee9))
- reopen the pwa in the user's language after coming back from payment redirect (#55) ([8638bc0](https://github.com/intershop/intershop-pwa/commit/8638bc0))
- load quote-requests on login and page refresh (#37) ([b43d5b4](https://github.com/intershop/intershop-pwa/commit/b43d5b4))
- wrong alignment of forgot password link for mobile view (#59) ([f8a05eb](https://github.com/intershop/intershop-pwa/commit/f8a05eb))
- remove trademark content from open source project (#39) ([9759b26](https://github.com/intershop/intershop-pwa/commit/9759b26))
- always write apiToken cookie as it is a functional cookie (#36) ([cbcfc86](https://github.com/intershop/intershop-pwa/commit/cbcfc86))
- display error messages on empty cart ([0d75e7c](https://github.com/intershop/intershop-pwa/commit/0d75e7c))
- universal EmptyError in console (#38) ([3547cef](https://github.com/intershop/intershop-pwa/commit/3547cef))
- lazy loading (ng-defer-load) works in chromium only on block-elements (#28) ([cba69a9](https://github.com/intershop/intershop-pwa/commit/cba69a9))

### Documentation

- documentation for search engine optimizations (#85) ([75c9338](https://github.com/intershop/intershop-pwa/commit/75c9338))
- introduce developer documentation within the project (Project Structure, State Management, Migrations) (#67) ([95bc368](https://github.com/intershop/intershop-pwa/commit/95bc368))

### Code Refactoring

- perform migration to pattern without containers ([11d729d](https://github.com/intershop/intershop-pwa/commit/11d729d))

### BREAKING CHANGES

- Using containers and components is no longer a recommended pattern. See [Migrations /
  0.16 to 0.17](https://github.com/intershop/intershop-pwa/blob/develop/docs/guides/migrations.md#016-to-017) for more details.

## [0.16.1](https://github.com/intershop/intershop-pwa/releases/tag/0.16.1) (2019-12-13)

> NOTE: To address the issue with trademarked content or content of questionable origin it was neccessary to clean the complete GitHub repository resulting in a rewritten history. Because of that change it is advisable to work with a new clone of the repository.

> NOTE: Release 0.16.1 is the first release that contains all necessary assets again to run "out of the box". Older releases will miss some referenced assets that had to be removed from an Open Source project.

**required Intershop Commerce Management version: 7.10.15.2**

### Bug Fixes

- remove trademark content from open source project (#39)
- always write apiToken cookie as it is a functional cookie (#36)

### Code Refactoring

- switch from roboto font files contained in the sources to ones provided via npm packages
- move all used images to a central img folder for a better overview

## [0.16.0](https://github.com/intershop/intershop-pwa/releases/tag/0.16.0) (2019-11-29)

**required Intershop Commerce Management version: 7.10.15.2**

### Features

- enable Intershop test payment methods for redirect before and after checkout (ISH creditCard and onlinePay)
- use modal dialog for login
- keep session alive by regularly fetching basket
- handle outdated auth tokens
- lazy loading for cms managed images and videos (ng-defer-load)
- lazy loading for product and category images (ng-defer-load)
- display checkout error messages with full width (ISREST-885)
- address basket validation with adjustments (ISREST-885)
- display info messages for adding, updating, deleting basket items (ISREST-852)
- display removed items on cart after basket was adjusted (ISREST-852)
- add page meta information for SEO with ngx-meta (ISREST-913)
- Open Source preparation (change license, add contributing information, update readme)
- add confirmation for terms and conditions to registration page (ISREST-888)
- add update password functionality (from generated email link) to the forgot password handling
- Google reCaptcha V3 support (ISREST-859)
- fill contact us form with user details if user is logged in
- tuning for nginx responses and caching
- fetch price ranges for retail sets on product lists
- swatch image and color code navigation filter improvement

### Bug Fixes

- production mode support for concardis credit card
- remove anonymous basket if auth token vanishes
- improve categories list rendering with a trackBy function (prevents unnecessary re-rendering)
- hide compare link in mobile view for disabled compare feature (ISREST-928) (#12)
- quote request notification messages improvements (ISREST-880)
- enable company input fields when registration form is loaded
- add wrong variation to cart from product tile after variation change
- server-html-directive patch elements on input change
- rework basket merge handling (ISREST-848)
- navigate to checkout payment page if order creation is rolled back. (ISREST-853)
- apply a consistent form grid width layout (ISREST-906)
- display bucket surcharges on checkout cost summary widget (ISREST-904)
- remove wrong 'Cancel' button styling in edit profile forms (ISREST-839)
- multiple product-requests on category-page
- display delivery times and shipping costs for eligible shipping methods (ISREST-869)
- update quote request before submit if quote request has unsaved changes
- also send currentPassword when changing user passwords

### Performance Improvements

- decouple content-pagelet-container for more efficient memoization

### BREAKING CHANGES

- The feature toggle 'captcha' was renamed to 'captchaV2' in contrast to the newly introduced 'captchaV3' option that could be used with the reCaptcha V3 service activated in ICM and the PWA.
- To resolve naming conflicts for the upcoming removal of the container-component-pattern some containers and components were merged into simpler components.

## [0.15.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.15.0/) (2019-10-11)

**required Intershop Commerce Management version: 7.10.14.0**

### Features

- use isServerHTML directive for all relevant places
- search filter navigation interaction and visual design rework (ISREST-847)
- provide guide for customization in project development
- facades as additional layer of abstraction, mainly to hide complexity of NgRx usage from components
- quote state feedback messages (ISREST-865)
- contact us functionality (ISREST-840)
- Angular 8 upgrade and other dependencies update (ISREST-800)
- changed positioning of breadcrumb and page title for pages with left navigation
- validate basket on each checkout step without server-side adjustments (ISREST-846)
- remove local storage sync functionality (was experimental but not really used)

### Bug Fixes

- IE 11 issues (added missing polyfills for unsupported browser functionality that caused JavaScript errors)
- calculate correct counts in product-master-variations service
- AddQuoteToBasket action runs into endless loop if the user has no basket yet (ISREST-856)
- do a second call to retrieve all remaining variations if more than 50 are available
- disable 'window.scroll' functionality for server side rendering
- redirect to login if anonymous user creates quote request from basket
- forgot password functionality handle (mail) server error with error message instead of error page
- regressions with health check
- products loose attributes on compare page
- default locale gets overridden when no locale is supplied (ISREST-858)
- make search filter collapsible in mobile and consistent with filter navigation (ISREST-465)
- position captcha on registration form below company inputs (business customer registration)
- filter with space in ID cannot be deselected
- filter selection shows search input at sticky header

### BREAKING CHANGES

- The PWA is now using Angular 8, follow the upgrade guide to update your own components: https://update.angular.io/#7.0:8.0.
- Using NgRx artifacts in Angular components is now deprecated, use facades instead.
- Changed default import references for relative imports within the project and adapted tslint rules to enforce it (old import notation would still work but would lead to tslint errors).

## [0.14.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.14.0/) (2019-09-10)

**required Intershop Commerce Management version: 7.10.13.4**

### Features

- show ratings for products (ISREST-817)
- add forgot password functionality to request an email with a password reset link (ISREST-844)
- improved searchbox with search suggest handling (ISREST-229)
- enable a customer to redeem a promotion code in shopping cart and checkout (ISREST-697)
- require old password when updating the user password
- advanced variation handling - filter variations on product master pages (ISREST-515)
- display basket and order errors in mini basket or on the checkout pages, respectively (ISREST-275)
- client side filter navigation for deselect, multiple select, price ranges
- enable security question for registration via feature toggle (disabled by default)
- add support for product links (ISREST-733)
- provide visual feedback after adding a product to cart (ISREST-618)
- display cms content in the modal dialogs 'Privacy Policy' and 'Safe & Secure' (ISREST-341)
- enable captcha via feature toggle, e.g. for user registration (ISREST-77)
- server-side basket merging after login using a REST request (ISREST-276)
- add support for retail sets (ISREST-689)
- add support for product bundles (ISREST-683)

### Bug Fixes

- display an error message if the user selects a wrong expiry date for the concardis credit card (ISREST-825)
- collapse category navigation for mobile view (ISREST-836)
- inconsitent product list count by querying the search index with the default product list call and clientside workarounds
- form control feedback colors and styling improved (ISREST-838)
- display a message if the user doesn't check the captcha (ISREST-829)
- enable endless scrolling after sorting (ISREST-837)
- display a message if no shipping method is available for the shopping cart (ISREST-594)
- keep product attributes when starting at product variation
- use always server-side merging for merging baskets after user login (ISREST-835)
- fixes for azure-pipelines.yml template
- consolidate different implementations for product id display (ISREST-761)
- consume basket rest data, minor code refactoring (ISREST-811)
- footer is not localized (ISREST-506)
- missing variation attributes in select boxes fixed by a more robust SKUs parsing from URIs
- use packing units on products for basket line items (ISREST-786)

### BREAKING CHANGES

- due to file system restrictions, mock-data file names no longer contain parameters
- CMSModule is now integrated into SharedModule

## 0.13.1 (2019-08-01)

**required Intershop Commerce Management version: 7.10.13.1**

### Features

- support of the Concardis credit card as a redirect after checkout payment method (ISREST-694)

### Bug Fixes

- fix responsive design of edit modal for variation products in the cart (ISREST-792)
- expression changed after it has been checked error for quoting with recently viewed products on product detail page (ISREST-765)

## [0.13.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.13.0/) (2019-07-23)

**required Intershop Commerce Management version: 7.10.12.2**

### Features

- support for payment method 'ISH_DEMO_Creditcard' as example for the redirect before checkout payment capability (ISREST-694)
- personalization handling for CMS
- sticky header ui and code improvements (ISREST-509)
- support ICM means to link to different objects - ishServerHtml directive (IS-24899)
- feedback with toast messages (ISREST-444)

### Bug Fixes

- synchronize product list paging order (ISREST-740)
- prevent call for individual products on product list if enough data is available (ISREST-752)
- display info message on login form if the user is redirected to the login page (ISREST-762)
- display short line item description on order detail page (ISREST-785)
- myAccount navigation minor ui issues (ISREST-488)
- improve address form region update handling
- handle undefined user on account-profile-page
- search box configuration handling to be more robust without any configuration
- set Bootstrap default body color to our themes color-primary
- wait till app is stable before starting timers

## [0.12.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.12.0/) (2019-06-13)

**required Intershop Commerce Management version: 7.10.9.0**

**required node version 10.16.0 LTS with npm 6.9.0**

### Features

- variation selection in cart (ISREST-680)
- integrate promotion information at product detail and product listing (ISREST-695)
- edit user profile (ISREST-758)
- upgrade to latest Angular 7, upgrade support dependencies
- schematics for Helm charts and Azure DevOps pipeline
- checkout - payment with concardis credit card (ISREST-622)
- support of payment instruments with parameters in checkout (ISREST-668)
- retain anonymous basket

### Bug Fixes

- filter undefined entities in getVisibleProducts-selector (ISREST-782)
- prevent authenticated user from going to login
- remove quote request if there is no item left in the quote request (ISREST-613)
- centered, repeated error page background-image (IS-26892)
- logout user depending on token only if cookie law was accepted
- recently viewed rework after product item container changes (ISREST-751)
- check cookie acceptance before writing cookies (ISREST-743)
- display address region when an address is edited (ISREST-596)
- change out of stock text in line item description (ISREST-675)
- improved english and german localization texts and added french localization for addresses (ISREST-727)

## [0.11.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.11.0/) (2019-04-24)

**required Intershop Commerce Management version: 7.10.7.3**

### Features

- schematic for CMS rendering components
- integrate Sentry for client side (browser) error tracking
- use ng-mocks for mocking components in tests
- product variation handling (ISREST-166)
- Design View support in PWA (preparation for future support in ICM)
- display promotion messages on cart and checkout (ISREST-691)
- remember user over page refreshes
- introduce category route pipe to generate category routes and map category attributes to category model instances
- display localized country names and region names on address (ISREST-677)
- adapt basket and payment REST API changes (ISREST-669)
- checkout for an unregistered user (ISREST-639)
- enable the user to set preferred addresses on account addresses page (ISREST-634)

### Bug Fixes

- specific welcome message for b2b customers on account overview page added (ISREST-676)
- product list view - quantity input missing (ISREST-656)
- fix issue if quote start date is not reached but items can already be added to the cart (ISREST-670)
- no redirect to new quote request page when creating new quote request from quote (ISREST-645)
- compare explanation text styling (ISREST-638)
- do not create select options if quantity selection is displayed as input

## [0.10.5](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.10.5/) (2019-03-12)

**required Intershop Commerce Management version: 7.10.5.5**

### Features

- render CMS content pages (Static Pages, Helpdesk Pages) (ISREST-646)
- CMS Video Component (ISREST-615)
- use new basket payment rest api (ISREST-362)
- add Order Widget and use it in Account Overview
- add Quoting Widget and use it in Account Overview (ISREST-591)
- consume changes for basket REST API (ISREST-626)

### Bug Fixes

- set adaptive max-age for static files in universal mode (ISREST-605)
- set authentication token in ApiService (ISREST-657)
- smaller quoting related bugfixes (ISREST-593, ISREST-604)
- SSR express returns appropriate HTTP error codes (ISREST-630)
- minor styling and localization quoting bug fixes (ISREST-601, ISREST-606, ISREST-599)

### BREAKING CHANGES

- renamed Angular CLI environment property 'needMock' to 'mockServerAPI' (now optional)

## [0.9.1](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.9.1/) (2019-02-07)

### Features

- display PWA version info in footer (ISREST-215)

### Bug Fixes

- display cookie warning on client side only (ISREST-557)
- display company info in profile settings (ISREST-587)
- localization and styling issues
- compare products columns don't have same sizes on mobile (ISREST-558)
- various quoting issues (ISREST-588)

## [0.9.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.9.0/) (2019-01-31)

**required Intershop Commerce Management version: 7.10.5.4**

### Features

- multi-site handling (ISREST-529)
- display cookie usage notice - used angular2-cookie-law (ISREST-557)
- business customer registration (ISREST-538)
- Add Angulartics2 to enable Tracking with Google Analytics and Google Tag Manager
- add ishDate pipe for correctly localizing dates
- use additional attributes of changed products REST API
- consume basket rest api changes (ISREST-556)
- load regions from REST API (ISREST-532)
- compare button in list view (ISREST-552)
- company input fields for business customers added to address forms (ISREST-497)
- add and delete addresses in My Account (ISREST-293)
- dependency upgrades (including ngrx@7)
- get countries per REST (ISREST-532)

### Bug Fixes

- visiting product detail page of certain products leads to endless product calls for that product in product listings (ISREST-564)
- loading deleted products in listings routes to error page
- repair address form validation feedback (ISREST-555)
- merge basket after login (ISREST-554)
- updating address during checkout using the new Basket REST API (ISREST-344)
- enable initialNavigation to prevent flickering when loading page in universal mode

### Performance Improvements

- use the font-display property with 'swap' for faster initial text display

### BREAKING CHANGES

- Properties ICM_APPLICATION (system environment) and icmApplication (environment.ts) are correctly renamed to ICM_CHANNEL and icmChannel respectively.
- Features now have to be supplied using a string array or as a string containing a comma separated list. Features are now opt-in instead of previously opt-out.

## [0.8.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.8.0/) (2018-12-20)

**required Intershop Commerce Management version: 7.10.5.2**

### Code Refactoring

- module refactoring (ISREST-505)

### Features

- Angular 7 upgrade
- update to node.js 10 LTS and npm 6.4.1
- custom schematics for new module structure (ISREST-255)
- use cypress instead of protractor for end-to-end testing
- migration to new REST API for basket - part I (ISREST-344)
- use new basket REST API for item handling (ISREST-344)
- use default category from product in breadcrumb if no category context is given (ISREST-207)
- add Product Label functionality (ISREST-522)
- change and create address during checkout (ISREST-463)
- address listing in My Account (ISREST-484)

### Bug Fixes

- URL for images delivered by an image server are not composed correctly (ISREST-524)
- add locale information to all REST requests methods (POST, PUT, PATCH, DELETE was missing) - (ISREST-533)
- undefined checks in filternavigation mapper

### Performance Improvements

- optimization for ng2-validation tree shaking
- initialize icon module only once in core module
- use treeshakeable lodash-es instead of lodash

### BREAKING CHANGES

- Folder structure changed due to module refactoring.

## [0.7.10](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.7.10/) (2018-09-10)

First public release of the Intershop Progressive Web App

**required Intershop Commerce Management version: 7.10.2.4**

## 0.6.0 (2018-09-08)

### Features

- CMS integration - conditional rendering (ISREST-213) - EXPERIMENTAL
- sticky header - header styling and behavior changes (ISREST-435) - EXPERIMENTAL

## 0.5.0 (2018-09-07)

### Features

- preparation for content page handling (ISREST-460)
- rebranding - color scheme, logo, effects (ISREST-481)
- add Order Details functionality (ISREST-430)
- instant quantity changes for line item list (basket/quote request) (ISREST-314)
- add Order List functionality (ISREST-426)

### Bug Fixes

- add home screen icons for Apple iOS devices
- repaired route definition for product routes (ISREST-459)
- remove btoa and atob as they are not available in universal mode (ISREST-445)

### Documentation

- add changelog generation with conventional-changelog
- add license information and 3rd-party-licenses overview

## 0.4.0 (2018-08-22)

### Features

- migration to Bootstrap 4
- migration from Less to Sass
- replace ngx-bootstrap with ng-bootstrap
- add Endless Scrolling for Family Pages including SEO adaptions

### Bug Fixes

- repair state transfer to work with ngrx state management
- improve mobile menu handling

## [0.3.0](https://repository.intershop.de//releases/com/intershop/public/source/intershop-pwa/0.3.0/) (2018-08-08)

### Features

- add Quoting support (enable via feature toggle, disabled by default, works only agains B2B applications)
- introduce Endless Scrolling (for search results)
- add Filter Navigation
- new Homepage dummy teaser content
- complete happy path Checkout steps
- update Angular to 6.1.0 (+ update of other dependencies)
- introduce manually managed change log

## [0.2.0](https://repository.intershop.de//releases/com/intershop/public/source/intershop-pwa/0.2.0/) (2018-07-11)

### Features

- add checkout blueprint pages

### Bug Fixes

- improve IE 11 compatibility

## [0.1.1](https://repository.intershop.de//releases/com/intershop/public/source/intershop-pwa/0.1.1/) (2018-06-05)

First public beta release of the Intershop Progressive Web App (intershop-pwa).

## 0.1.0 (2018-05-31)

Initial internal beta release of the Intershop Progressive Web App.
