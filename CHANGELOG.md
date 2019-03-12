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
