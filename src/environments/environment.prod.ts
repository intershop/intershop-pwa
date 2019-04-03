// tslint:disable:no-commented-out-code
export const environment = {
  production: true,
  // set to true if not working against a real ICM server
  // mockServerAPI: false,
  // array of REST path expressions that should always be mocked
  // mustMockPaths: [],

  // Intershop Commerce Management REST server configuration
  icmBaseURL: 'http://192.168.99.100:8081',
  icmServer: 'INTERSHOP/rest/WFS',
  icmServerStatic: 'INTERSHOP/static/WFS',
  icmChannel: 'inSPIRED-inTRONICS-Site',

  // To use the Google Tag Manager, insert a correct GTM-Token and uncomment the next line
  // gtmToken: 'GTM-XXXXXXX',

  // log client-side-javascript-errors to sentry.io
  sentryDSN: undefined, // 'https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@sentry.io/XXXXXXX',

  // configuration of the available locales - hard coded for now
  locales: [
    { lang: 'en_US', currency: 'USD', value: 'en', displayName: 'English', displayLong: 'English (United States)' },
    { lang: 'de_DE', currency: 'EUR', value: 'de', displayName: 'German', displayLong: 'German (Germany)' },
    { lang: 'fr_FR', currency: 'EUR', value: 'fr', displayName: 'French', displayLong: 'French (France)' },
  ],

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

  // enable feature toggles for specific features
  features: [
    'compare',
    'recently',
    // 'quoting',
    // 'stickyHeader',
    // 'tracking',
    // 'businessCustomerRegistration',
    'sentry',
  ],
};
