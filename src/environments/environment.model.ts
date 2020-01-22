import { Locale } from 'ish-core/models/locale/locale.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';

export interface Environment {
  production: boolean;

  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */

  // base server url mapping, see appserver.properties
  icmBaseURL: string;
  icmURLPrefix: string;
  icmServerGroup: string;
  icmRestURLPath: string;
  icmStaticURLPath: string;
  icmWebURLPath: string;

  // application specific
  icmChannel: string;
  icmApplication?: string;

  // set 'mockServerAPI' to true if not working against a real ICM server
  mockServerAPI?: boolean;
  // array of REST path expressions that should always be mocked
  mustMockPaths?: string[];

  /* FEATURE TOOGLES */
  features: (
    | 'captchaV2'
    | 'captchaV3'
    | 'compare'
    | 'rating'
    | 'recently'
    | 'securityQuestion'
    /* B2B features */
    | 'advancedVariationHandling'
    | 'businessCustomerRegistration'
    | 'quoting'
    /* Third-party Integrations */
    | 'sentry'
    | 'tracking')[];

  /* ADDITIONAL FEATURE CONFIGURATIONS */

  // track shop interaction via Google Tag Manager (to be used with 'tracking' feature, works with server side rendering only)
  gtmToken?: string;

  // log client-side javascript errors to sentry.io (to be used with 'sentry' feature, works with server side rendering only)
  sentryDSN?: string;

  // protect form submission with captchas (to be used with 'captcha' feature)
  /** For production systems the captcha site key needs to match the one configured in the ICM ReCaptcha service configuration.
   * For development we use the development keys provided by Google (https://developers.google.com/recaptcha/docs/faq)
   * that don't require real verification and are used in the ICM as well.
     Site key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
     Secret key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
   */
  // TODO: get captcha site key, when Configuration Response in REST API is available
  captchaSiteKey?: string;

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

  // enable or disable service worker
  serviceWorker: boolean;

  // configuration of the available locales - hard coded for now
  locales: Locale[];

  // configuration of the styling theme ('default' if not configured)
  theme?: string;
}
