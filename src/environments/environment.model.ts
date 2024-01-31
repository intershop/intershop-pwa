import { Auth0Config } from 'ish-core/identity-provider/auth0.identity-provider';
import { CookieConsentOptions } from 'ish-core/models/cookies/cookies.model';
import { DeviceType, ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { DataRetentionPolicy } from 'ish-core/utils/meta-reducers';
import { MultiSiteLocaleMap } from 'ish-core/utils/multi-site/multi-site.service';

import { AddressDoctorConfig } from '../app/extensions/address-doctor/models/address-doctor/address-doctor-config.model';
import { TactonConfig } from '../app/extensions/tacton/models/tacton-config/tacton-config.model';

export interface Environment {
  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: string;
  icmServer: string;
  icmServerStatic: string;
  icmChannel: string;
  icmApplication?: string;
  hybridApplication?: string;

  // array of REST path expressions that should always be mocked
  apiMockPaths?: string[];

  // global identity provider ID (fallback 'ICM')
  identityProvider?: string;

  /* FEATURE TOGGLES */
  features: (
    | 'compare'
    | 'contactUs'
    | 'extraConfiguration'
    | 'productNotifications'
    | 'rating'
    | 'recently'
    | 'saveLanguageSelection'
    | 'storeLocator'
    /* B2B features */
    | 'businessCustomerRegistration'
    | 'costCenters'
    | 'quoting'
    | 'quickorder'
    | 'orderTemplates'
    | 'punchout'
    /* B2C features */
    | 'guestCheckout'
    | 'wishlists'
    | 'wishlistSharing'
    /* ICM compatibility - a.o. to be used with the ICMCompatibilityInterceptor */
    // | 'messageToMerchant'
    | 'legacyEncoding'
    /* Third-party Integrations */
    | 'addressDoctor'
    | 'sentry'
    | 'tracking'
    | 'tacton'
    | 'maps'
  )[];

  /* ADDITIONAL FEATURE CONFIGURATIONS */

  // Google Maps API Key
  gmaKey?: string;

  // track shop interaction via Google Tag Manager (to be used with 'tracking' feature, works with server side rendering only)
  gtmToken?: string;

  // log client-side javascript errors to sentry.io (to be used with 'sentry' feature, works with server side rendering only)
  sentryDSN?: string;

  // tacton integration
  tacton?: TactonConfig;

  // address doctor integration
  addressDoctor?: AddressDoctorConfig;

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

  /**
   * default viewType used for product listings
   *
   * default value is 'grid'
   *
   * - to override it for all device types use `defaultProductListingViewType: 'list'`
   * - to override it for mobile and tablet use `defaultProductListingViewType: { mobile: 'list', tablet: 'list' }`
   */
  defaultProductListingViewType?: ViewType | Partial<Record<DeviceType, ViewType>>;

  // default device type used for initial page responses
  defaultDeviceType: DeviceType;

  // default locale that is used as fallback if no default locale from the ICM REST call is available (should only be set for local development)
  defaultLocale?: string;

  // fallback locales if the locales from the configurations REST call are not available/not responding (to have a working translation functionality with the translations provided as source code)
  fallbackLocales?: string[];

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

  /** Price update mechanism:
   * - 'always': fetch fresh price information all the time
   * - 'stable': only fetch prices once per application lifetime
   */
  priceUpdate: 'stable' | 'always';
}

export const ENVIRONMENT_DEFAULTS: Omit<Environment, 'icmChannel'> = {
  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: 'https://develop.icm.intershop.de',
  icmServer: 'INTERSHOP/rest/WFS',
  icmServerStatic: 'INTERSHOP/static/WFS',
  icmApplication: '-',

  /* FEATURE TOGGLES */
  features: [
    'compare',
    'contactUs',
    'productNotifications',
    'rating',
    'recently',
    'saveLanguageSelection',
    'storeLocator',
  ],

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
  defaultDeviceType: 'mobile',
  fallbackLocales: ['en_US', 'de_DE', 'fr_FR'],
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
    allowedCookies: [
      'apiToken',
      'cookieConsent',
      'preferredLocale',
      'punchout_SID',
      'punchout_BasketID',
      'punchout_ReturnURL',
      'punchout_HookURL',
    ],
  },
  cookieConsentVersion: 1,

  dataRetention: {
    compare: 'session',
    recently: 60 * 24 * 7, // 1 week
    tacton: 'forever',
  },
  priceUpdate: 'always',
};
