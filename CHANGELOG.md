<!--
kb_sync_latest_only
kb_pwa
kb_releasenote
kb_everyone
-->

# Changelog

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
