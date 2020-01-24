# [0.17.0](https://github.com/intershop/intershop-pwa/releases/tag/0.17.0) (2020-01-24)

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
  0.16 to 0.17](https://github.com/intershop/intershop-pwa/blob/develop/docs/migrations.md#016-to-017) for more details.

# [0.16.1](https://github.com/intershop/intershop-pwa/releases/tag/0.16.1) (2019-12-13)

> NOTE: To address the issue with trademarked content or content of questionable origin it was neccessary to clean the complete GitHub repository resulting in a rewritten history. Because of that change it is advisable to work with a new clone of the repository.

> NOTE: Release 0.16.1 is the first release that contains all necessary assets again to run "out of the box". Older releases will miss some referenced assets that had to be removed from an Open Source project.

**required Intershop Commerce Management version: 7.10.15.2**

### Bug Fixes

- remove trademark content from open source project (#39)
- always write apiToken cookie as it is a functional cookie (#36)

### Code Refactoring

- switch from roboto font files contained in the sources to ones provided via npm packages
- move all used images to a central img folder for a better overview

# [0.16.0](https://github.com/intershop/intershop-pwa/releases/tag/0.16.0) (2019-11-29)

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

# [0.15.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.15.0/) (2019-10-11)

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

# [0.14.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.14.0/) (2019-09-10)

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

# 0.13.1 (2019-08-01)

**required Intershop Commerce Management version: 7.10.13.1**

### Features

- support of the Concardis credit card as a redirect after checkout payment method (ISREST-694)

### Bug Fixes

- fix responsive design of edit modal for variation products in the cart (ISREST-792)
- expression changed after it has been checked error for quoting with recently viewed products on product detail page (ISREST-765)

# [0.13.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.13.0/) (2019-07-23)

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

# [0.12.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.12.0/) (2019-06-13)

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

# [0.11.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.11.0/) (2019-04-24)

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

# [0.10.5](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.10.5/) (2019-03-12)

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

# [0.9.1](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.9.1/) (2019-02-07)

### Features

- display PWA version info in footer (ISREST-215)

### Bug Fixes

- display cookie warning on client side only (ISREST-557)
- display company info in profile settings (ISREST-587)
- localization and styling issues
- compare products columns don't have same sizes on mobile (ISREST-558)
- various quoting issues (ISREST-588)

# [0.9.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.9.0/) (2019-01-31)

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

# [0.8.0](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.8.0/) (2018-12-20)

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

# [0.7.10](https://repository.intershop.de/releases/com/intershop/public/source/intershop-pwa/0.7.10/) (2018-09-10)

First public release of the Intershop Progressive Web App

**required Intershop Commerce Management version: 7.10.2.4**

# 0.6.0 (2018-09-08)

### Features

- CMS integration - conditional rendering (ISREST-213) - EXPERIMENTAL
- sticky header - header styling and behavior changes (ISREST-435) - EXPERIMENTAL

# 0.5.0 (2018-09-07)

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

# 0.4.0 (2018-08-22)

### Features

- migration to Bootstrap 4
- migration from Less to Sass
- replace ngx-bootstrap with ng-bootstrap
- add Endless Scrolling for Family Pages including SEO adaptions

### Bug Fixes

- repair state transfer to work with ngrx state management
- improve mobile menu handling

# [0.3.0](https://repository.intershop.de//releases/com/intershop/public/source/intershop-pwa/0.3.0/) (2018-08-08)

### Features

- add Quoting support (enable via feature toggle, disabled by default, works only agains B2B applications)
- introduce Endless Scrolling (for search results)
- add Filter Navigation
- new Homepage dummy teaser content
- complete happy path Checkout steps
- update Angular to 6.1.0 (+ update of other dependencies)
- introduce manually managed change log

# [0.2.0](https://repository.intershop.de//releases/com/intershop/public/source/intershop-pwa/0.2.0/) (2018-07-11)

### Features

- add checkout blueprint pages

### Bug Fixes

- improve IE 11 compatibility

# [0.1.1](https://repository.intershop.de//releases/com/intershop/public/source/intershop-pwa/0.1.1/) (2018-06-05)

First public beta release of the Intershop Progressive Web App (intershop-pwa).

# 0.1.0 (2018-05-31)

Initial internal beta release of the Intershop Progressive Web App.
