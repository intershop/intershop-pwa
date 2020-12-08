import { InjectionToken } from '@angular/core';

import { CookieConsentOptions } from 'ish-core/models/cookies/cookies.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';

/**
 * Array of paths that always use mocked data
 */
export const API_MOCK_PATHS = new InjectionToken<string[]>('apiMockPaths');

/**
 * If 'username' login name is used for registration, if 'email' the email is used as login name (default: 'email')
 */
export const USER_REGISTRATION_LOGIN_TYPE = new InjectionToken<string>('userRegistrationLoginType');

/**
 * The maximum subcategories level depth rendered in the main navigation
 */
export const MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH = new InjectionToken<number>(
  'mainNavigationMaxSubCategoriesDepth'
);

/**
 * global definition of the product listing page size
 */
export const PRODUCT_LISTING_ITEMS_PER_PAGE = new InjectionToken<number>('productListingItemsPerPage');

/**
 * default definition of the product listing view type
 */
export const DEFAULT_PRODUCT_LISTING_VIEW_TYPE = new InjectionToken<ViewType>('defaultProductListingViewType');

/**
 * global definition of the Bootstrap grid system breakpoint widths
 */
export const SMALL_BREAKPOINT_WIDTH = new InjectionToken<number>('smallBreakpointWidth');

export const MEDIUM_BREAKPOINT_WIDTH = new InjectionToken<number>('mediumBreakpointWidth');

export const LARGE_BREAKPOINT_WIDTH = new InjectionToken<number>('largeBreakpointWidth');

export const EXTRALARGE_BREAKPOINT_WIDTH = new InjectionToken<number>('extralargeBreakpointWidth');

/**
 * The configured theme for the application (or 'default' if not configured)
 */
export const THEME = new InjectionToken<string>('theme');

/**
 * the configured cookie consent options for the application
 */
export const COOKIE_CONSENT_OPTIONS = new InjectionToken<CookieConsentOptions>('cookieConsentOptions');
