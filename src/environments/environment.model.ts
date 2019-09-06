export interface Environment {
  production: boolean;

  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */

  icmBaseURL: string;
  icmServer: string;
  icmServerStatic: string;
  icmChannel: string;
  icmApplication?: string;

  // set 'mockServerAPI' to true if not working against a real ICM server
  mockServerAPI?: boolean;
  // array of REST path expressions that should always be mocked
  mustMockPaths?: string[];

  /* FEATURE TOOGLES */
  features: (
    | 'captcha'
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
    | 'tracking'
    /* features which do not have the degree of maturity to use them in production */
    | 'experimental')[];

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
  defaultProductListingViewType: 'grid' | 'list';

  // enable or disable service worker
  serviceWorker: boolean;

  // experimental feature: enable the transfer of the application state to another tab or keep it after a full page refresh/load - disabled for now
  syncLocalStorage: boolean;

  // configuration of the available locales - hard coded for now
  locales: { lang: string; currency: string; value: string; displayName: string; displayLong: string }[];
}
