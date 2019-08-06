// tslint:disable:no-commented-out-code
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --prod` then `environment.prod.ts` will be used instead.
// The list of which configuration maps to which file can be found in `angular.json`.

export const environment = {
  production: false,

  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */

  icmBaseURL: 'http://localhost:4200',
  icmServer: 'INTERSHOP/rest/WFS',
  icmServerStatic: 'INTERSHOP/static/WFS',
  icmChannel: 'inSPIRED-inTRONICS-Site',
  // icmApplication: 'pwa',

  // set 'mockServerAPI' to true if not working against a real ICM server
  mockServerAPI: true,
  // array of REST path expressions that should always be mocked
  // mustMockPaths: ['cms/.*'],

  /* FEATURE TOOGLES */

  features: [
    'compare',
    'recently',

    /* B2B features */
    // 'businessCustomerRegistration',
    // 'quoting',

    /* Third-party Integrations */
    // 'tracking',
    // 'sentry',

    /* features which have not the degree of maturity to use them in production */
    'experimental',
    // 'captcha',
  ],

  /* ADDITIONAL FEATURE CONFIGURATIONS */

  // track shop interaction via Google Tag Manager (to be used with 'tracking' feature)
  // gtmToken: 'GTM-XXXXXXX',

  // log client-side-javascript-errors to sentry.io (to be used with 'sentry' feature)
  // sentryDSN: 'https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@sentry.io/XXXXXXX',

  // protect form submission with captchas (to be used with 'captcha' feature)
  /** For production systems the captcha site key needs to match the one configured in the ICM ReCaptcha service configuration.
   * For development we use the development keys provided by Google (https://developers.google.com/recaptcha/docs/faq)
   * that don't require real verification and are used in the ICM as well.
     Site key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
     Secret key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
   */
  // TODO: get captcha site key, when Configuration Response in REST API is available
  // captchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',

  /* PROGRESSIVE WEB APP CONFIGURATIONS */

  // Bootstrap grid system breakpoint widths as defined in the variables-bootstrap-customized.scss for usage in Javascript logic
  smallBreakpointWidth: 576,
  mediumBreakpointWidth: 768,
  largeBreakpointWidth: 992,
  extralargeBreakpointWidth: 1200,

  // global definition of the maximal depth of the main navigation sub categories
  mainNavigationMaxSubCategoriesDepth: 2,

  // global definition of the endless scrolling page size
  endlessScrollingItemsPerPage: 9,

  // enable or disable service worker
  serviceWorker: false,

  // experimental feature: enable the transfer of the application state to another tab or keep it after a full page refresh/load - disabled for now
  syncLocalStorage: false,

  // configuration of the available locales - hard coded for now
  locales: [
    { lang: 'en_US', currency: 'USD', value: 'en', displayName: 'English', displayLong: 'English (United States)' },
    { lang: 'de_DE', currency: 'EUR', value: 'de', displayName: 'German', displayLong: 'German (Germany)' },
    { lang: 'fr_FR', currency: 'EUR', value: 'fr', displayName: 'French', displayLong: 'French (France)' },
  ],
};
