import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,

  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: 'http://192.168.99.100:8081',
  icmServer: 'INTERSHOP/rest/WFS',
  icmServerStatic: 'INTERSHOP/static/WFS',
  icmChannel: 'inSPIRED-inTRONICS-Site',
  // icmApplication: 'pwa',

  /* FEATURE TOOGLES */
  features: ['compare', 'recently'],

  /* PROGRESSIVE WEB APP CONFIGURATIONS */
  smallBreakpointWidth: 576,
  mediumBreakpointWidth: 768,
  largeBreakpointWidth: 992,
  extralargeBreakpointWidth: 1200,
  mainNavigationMaxSubCategoriesDepth: 2,
  endlessScrollingItemsPerPage: 9,
  serviceWorker: false,
  syncLocalStorage: false,
  locales: [
    { lang: 'en_US', currency: 'USD', value: 'en', displayName: 'English', displayLong: 'English (United States)' },
    { lang: 'de_DE', currency: 'EUR', value: 'de', displayName: 'German', displayLong: 'German (Germany)' },
    { lang: 'fr_FR', currency: 'EUR', value: 'fr', displayName: 'French', displayLong: 'French (France)' },
  ],
};
