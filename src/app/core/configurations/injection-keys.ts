import { InjectionToken } from '@angular/core';

import { createEnvironmentInjectionToken } from 'ish-core/utils/injection';

/**
 * Array of paths that always use mocked data
 */
export const API_MOCK_PATHS = createEnvironmentInjectionToken('apiMockPaths');

/**
 * If 'username' login name is used for registration, if 'email' the email is used as login name (default: 'email')
 */
export const USER_REGISTRATION_LOGIN_TYPE = new InjectionToken<string>('userRegistrationLoginType', {
  factory: () => 'email',
});

/**
 * The maximum subcategories level depth rendered in the main navigation
 */
export const MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH = createEnvironmentInjectionToken(
  'mainNavigationMaxSubCategoriesDepth'
);

/**
 * global definition of the product listing page size
 */
export const PRODUCT_LISTING_ITEMS_PER_PAGE = createEnvironmentInjectionToken('productListingItemsPerPage');

/**
 * default definition of the product listing view type
 */
export const DEFAULT_PRODUCT_LISTING_VIEW_TYPE = createEnvironmentInjectionToken('defaultProductListingViewType');

/**
 * the configured cookie consent options for the application
 */
export const COOKIE_CONSENT_OPTIONS = createEnvironmentInjectionToken('cookieConsentOptions');

/**
 * the configured data retention policy for the application
 */
export const DATA_RETENTION_POLICY = createEnvironmentInjectionToken('dataRetention');

/**
 * the configured price update policy for the application
 */
export const PRICE_UPDATE = createEnvironmentInjectionToken('priceUpdate');

/**
 * the configured theme color
 */
export const THEME_COLOR = createEnvironmentInjectionToken('themeColor');

/**
 * the configured copilot settings
 */
export const COPILOT_SETTINGS = createEnvironmentInjectionToken('copilotConfig');

/*
 * global definition of the Bootstrap grid system breakpoint widths
 */

export const SMALL_BREAKPOINT_WIDTH = createEnvironmentInjectionToken('smallBreakpointWidth');

export const MEDIUM_BREAKPOINT_WIDTH = createEnvironmentInjectionToken('mediumBreakpointWidth');

export const LARGE_BREAKPOINT_WIDTH = createEnvironmentInjectionToken('largeBreakpointWidth');
