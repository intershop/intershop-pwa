// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --prod` then `environment.prod.ts` will be used instead.
// The list of which configuration maps to which file can be found in `angular.json`.

export const environment = {
  production: false,
  needMock: true,

  // Intershop Commerce Management REST server configuration
  icmBaseURL: 'http://localhost:4200',
  icmServer: 'INTERSHOP/rest/WFS',
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
  serviceWorker: false,

  // experimental feature: enable the transfer of the application state to another tab or keep it after a full page refresh/load - disabled for now
  syncLocalStorage: false,

  // experimental feature: enable feature toggles for specific features
  features: {
    compare: true,
    recently: true,
    quoting: false,
  },
};
