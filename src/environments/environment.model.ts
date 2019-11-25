import { Locale } from 'ish-core/models/locale/locale.model';
import { DeviceType, ViewType } from 'ish-core/models/viewtype/viewtype.types';

export interface Environment {
  production: boolean;

  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */

  icmBaseURL: string;
  icmServer: string;
  icmServerStatic: string;

  // application specific
  icmChannel: string;
  icmApplication?: string;

  // set 'mockServerAPI' to true if not working against a real ICM server
  mockServerAPI?: boolean;
  // array of REST path expressions that should always be mocked
  mustMockPaths?: string[];

  /* FEATURE TOOGLES */
  features: (
    | 'compare'
    | 'rating'
    | 'recently'
    /* B2B features */
    | 'advancedVariationHandling'
    | 'businessCustomerRegistration'
    | 'quoting'
    | 'quickorder'
    | 'orderTemplates'
    /* Third-party Integrations */
    | 'sentry'
    | 'tracking'
    /* B2C features */
    | 'wishlists'
  )[];

  /* ADDITIONAL FEATURE CONFIGURATIONS */

  // track shop interaction via Google Tag Manager (to be used with 'tracking' feature, works with server side rendering only)
  gtmToken?: string;

  // log client-side javascript errors to sentry.io (to be used with 'sentry' feature, works with server side rendering only)
  sentryDSN?: string;

  /* PROGRESSIVE WEB APP CONFIGURATIONS */

  // Bootstrap grid system breakpoint widths as defined in the variables-bootstrap-customized.scss for usage in Javascript logic
  smallBreakpointWidth: number;
  mediumBreakpointWidth: number;
  largeBreakpointWidth: number;
  extralargeBreakpointWidth: number;

  // global definition of the maximal depth of the main navigation sub categories
  mainNavigationMaxSubCategoriesDepth: number;

  // global definition of the product listing page size
  productListingItemsPerPage: number;

  // default viewType used for product listings
  defaultProductListingViewType: ViewType;

  // default device type used for initial page responses
  defaultDeviceType: DeviceType;

  // enable or disable service worker
  serviceWorker: boolean;

  // configuration of the available locales - hard coded for now
  locales: Locale[];

  // configuration of the styling theme ('default' if not configured)
  // format: 'themeName|themeColor' e.g. theme: 'blue|688dc3',
  theme?: string;
}

export const ENVIRONMENT_DEFAULTS: Environment = {
  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: 'NOT SET',
  icmChannel: 'inSPIRED-inTRONICS-Site',
  icmServer: 'INTERSHOP/rest/WFS',
  icmServerStatic: 'INTERSHOP/static/WFS',
  icmApplication: 'rest',

  production: false,
  mockServerAPI: false,

  /* FEATURE TOOGLES */
  features: ['compare', 'recently', 'rating', 'wishlists'],

  /* PROGRESSIVE WEB APP CONFIGURATIONS */
  serviceWorker: false,
  smallBreakpointWidth: 576,
  mediumBreakpointWidth: 768,
  largeBreakpointWidth: 992,
  extralargeBreakpointWidth: 1200,
  mainNavigationMaxSubCategoriesDepth: 2,
  productListingItemsPerPage: 9,
  defaultProductListingViewType: 'grid',
  defaultDeviceType: 'mobile',
  locales: [
    { lang: 'en_US', currency: 'USD', value: 'en', displayName: 'English', displayLong: 'English (United States)' },
    { lang: 'de_DE', currency: 'EUR', value: 'de', displayName: 'German', displayLong: 'German (Germany)' },
    { lang: 'fr_FR', currency: 'EUR', value: 'fr', displayName: 'French', displayLong: 'French (France)' },
  ],
};
