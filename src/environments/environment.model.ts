import { Auth0Config } from 'ish-core/identity-provider/auth0.identity-provider';
import { CookieConsentOptions } from 'ish-core/models/cookies/cookies.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { DeviceType, ViewType } from 'ish-core/models/viewtype/viewtype.types';

import { TactonConfig } from '../app/extensions/tacton/models/tacton-config/tacton-config.model';

export interface Environment {
  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */

  icmBaseURL: string;
  icmServer: string;
  icmServerStatic: string;

  // temporarily hard-coded identity provider ID, later supplied by configurations call
  identityProvider: 'ICM' | string;

  // application specific
  icmChannel: string;
  icmApplication?: string;

  // array of REST path expressions that should always be mocked
  apiMockPaths?: string[];

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
    | 'punchout'
    /* Third-party Integrations */
    | 'sentry'
    | 'tracking'
    | 'tacton'
    /* B2C features */
    | 'wishlists'
  )[];

  /* ADDITIONAL FEATURE CONFIGURATIONS */

  // track shop interaction via Google Tag Manager (to be used with 'tracking' feature, works with server side rendering only)
  gtmToken?: string;

  // log client-side javascript errors to sentry.io (to be used with 'sentry' feature, works with server side rendering only)
  sentryDSN?: string;

  // tacton integration
  tacton?: TactonConfig;

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

  // configuration of the available locales - hard coded for now
  locales: Locale[];

  // configuration of the styling theme ('default' if not configured)
  // format: 'themeName|themeColor' e.g. theme: 'blue|688dc3',
  theme?: string;

  // cookie consent options
  cookieConsentOptions?: CookieConsentOptions;
  cookieConsentVersion?: number;

  // client-side configuration for identity providers
  identityProviders?: {
    [name: string]:
      | {
          type: string;
          [key: string]: unknown;
        }
      | Auth0Config;
  };
}

export const ENVIRONMENT_DEFAULTS: Environment = {
  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: 'NOT SET',
  icmChannel: 'inSPIRED-inTRONICS-Site',
  icmServer: 'INTERSHOP/rest/WFS',
  icmServerStatic: 'INTERSHOP/static/WFS',
  icmApplication: 'rest',
  identityProvider: 'ICM',

  /* FEATURE TOOGLES */
  features: ['compare', 'recently', 'rating', 'wishlists'],

  /* PROGRESSIVE WEB APP CONFIGURATIONS */
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
  cookieConsentOptions: {
    options: {
      required: {
        name: 'cookie.consent.option.required.name',
        description: 'cookie.consent.option.required.description',
        required: true,
      },
      functional: {
        name: 'cookie.consent.option.functional.name',
        description: 'cookie.consent.option.functional.description',
      },
      tracking: {
        name: 'cookie.consent.option.tracking.name',
        description: 'cookie.consent.option.tracking.description',
      },
    },
    allowedCookies: ['cookieConsent', 'apiToken'],
  },
  cookieConsentVersion: 1,
};
