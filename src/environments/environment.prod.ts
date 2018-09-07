export const environment = {
  production: true,
  needMock: false,
  // mustMockPaths: [],

  // Intershop Commerce Management REST server configuration
  icmBaseURL: 'http://192.168.99.100:8081',
  icmServer: 'INTERSHOP/rest/WFS',
  icmServerStatic: 'INTERSHOP/static/WFS',
  icmApplication: 'inSPIRED-inTRONICS-Site',

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
  serviceWorker: true,

  // experimental feature: enable the transfer of the application state to another tab or keep it after a full page refresh/load - disabled for now
  syncLocalStorage: false,

  // experimental feature: enable feature toggles for specific features
  features: {
    compare: true,
    recently: true,
    quoting: false,
  },
};
