import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,

  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: 'https://intershoppwa.azurewebsites.net',
  icmURLPrefix: 'INTERSHOP',
  icmServerGroup: 'WFS',
  icmRestURLPath: 'rest',
  icmStaticURLPath: 'static',
  icmChannel: 'inSPIRED-inTRONICS-Site',

  /* FEATURE TOOGLES */
  features: ['compare', 'recently', 'rating'],

  /* PROGRESSIVE WEB APP CONFIGURATIONS */
  smallBreakpointWidth: 576,
  mediumBreakpointWidth: 768,
  largeBreakpointWidth: 992,
  extralargeBreakpointWidth: 1200,
  mainNavigationMaxSubCategoriesDepth: 2,
  productListingItemsPerPage: 9,
  defaultProductListingViewType: 'grid',
  serviceWorker: false,
  locales: [
    { lang: 'en_US', currency: 'USD', value: 'en', displayName: 'English', displayLong: 'English (United States)' },
    { lang: 'de_DE', currency: 'EUR', value: 'de', displayName: 'German', displayLong: 'German (Germany)' },
    { lang: 'fr_FR', currency: 'EUR', value: 'fr', displayName: 'French', displayLong: 'French (France)' },
  ],
};
