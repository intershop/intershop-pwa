import { Auth0Config } from 'ish-core/identity-provider/auth0.identity-provider';
import { CookieConsentOptions } from 'ish-core/models/cookies/cookies.model';
import { DeviceType, ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { DataRetentionPolicy } from 'ish-core/utils/meta-reducers';
import { MultiSiteLocaleMap } from 'ish-core/utils/multi-site/multi-site.service';

import { TactonConfig } from '../app/extensions/tacton/models/tacton-config/tacton-config.model';

export interface Environment {
  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: string;
  icmServer: string;
  icmServerStatic: string;
  icmChannel: string;
  icmApplication?: string;

  // array of REST path expressions that should always be mocked
  apiMockPaths?: string[];

  // temporarily hard-coded identity provider ID, later supplied by configurations call
  identityProvider: 'ICM' | string;

  /* FEATURE TOGGLES */
  features: (
    | 'compare'
    | 'rating'
    | 'recently'
    /* B2B features */
    | 'advancedVariationHandling'
    | 'businessCustomerRegistration'
    | 'costCenters'
    | 'quoting'
    | 'quickorder'
    | 'orderTemplates'
    | 'punchout'
    /* Third-party Integrations */
    | 'sentry'
    | 'tracking'
    | 'tacton'
    /* B2C features */
    | 'guestCheckout'
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
  productListingItemsPerPage:
    | number
    | {
        category: number;
        search: number;
        master: number;
      };

  // default viewType used for product listings
  defaultProductListingViewType: ViewType;

  // default device type used for initial page responses
  defaultDeviceType: DeviceType;

  // default locale that is used as fallback if no default locale from the ICM REST call is available
  defaultLocale?: string;

  // configuration filtering available locales and their active currencies
  localeCurrencyOverride?: { [locale: string]: string | string[] };

  // multi-site URLs to locales mapping ('undefined' if mapping should not be used)
  multiSiteLocaleMap: MultiSiteLocaleMap;

  // configuration of the styling theme color used for theme-color meta
  // format: hex color e.g. themeColor: '#688dc3',
  themeColor?: string;

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

  // enable and configure data persistence for specific stores (compare, recently, tacton)
  dataRetention: DataRetentionPolicy;
}

export const ENVIRONMENT_DEFAULTS: Omit<Environment, 'icmChannel'> = {
  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: 'https://pwa-ish-demo.test.intershop.com',
  icmServer: 'INTERSHOP/rest/WFS',
  icmServerStatic: 'INTERSHOP/static/WFS',
  icmApplication: 'rest',
  identityProvider: 'ICM',

  /* FEATURE TOGGLES */
  features: ['compare', 'guestCheckout', 'recently', 'rating', 'wishlists'],

  /* PROGRESSIVE WEB APP CONFIGURATIONS */
  smallBreakpointWidth: 576,
  mediumBreakpointWidth: 768,
  largeBreakpointWidth: 992,
  extralargeBreakpointWidth: 1200,
  mainNavigationMaxSubCategoriesDepth: 2,
  productListingItemsPerPage: {
    category: 9,
    search: 12,
    master: 6,
  },
  defaultProductListingViewType: 'grid',
  defaultDeviceType: 'mobile',
  defaultLocale: 'en_US',
  multiSiteLocaleMap: {
    en_US: '/en',
    de_DE: '/de',
    fr_FR: '/fr',
  },
  localeCurrencyOverride: { de_DE: 'EUR', fr_FR: 'EUR' },
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

  dataRetention: {
    compare: 'session',
    recently: 60 * 24 * 7, // 1 week
    tacton: 'forever',
  },
};
