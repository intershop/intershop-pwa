import { InjectionToken } from '@angular/core';

import { CookieConsentOptions } from 'ish-core/models/cookies/cookies.model';
import { PriceUpdateType } from 'ish-core/models/price/price.model';
import { DataRetentionPolicy } from 'ish-core/utils/meta-reducers';

import { environment } from '../../../environments/environment';
import { Environment } from '../../../environments/environment.model';

/**
 * Array of paths that always use mocked data
 */
export const API_MOCK_PATHS = new InjectionToken<string[]>('apiMockPaths', { factory: () => environment.apiMockPaths });

/**
 * If 'username' login name is used for registration, if 'email' the email is used as login name (default: 'email')
 */
export const USER_REGISTRATION_LOGIN_TYPE = new InjectionToken<string>('userRegistrationLoginType', {
  factory: () => 'email',
});

/**
 * The maximum subcategories level depth rendered in the main navigation
 */
export const MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH = new InjectionToken<number>(
  'mainNavigationMaxSubCategoriesDepth',
  { factory: () => environment.mainNavigationMaxSubCategoriesDepth }
);

/**
 * global definition of the product listing page size
 */
export const PRODUCT_LISTING_ITEMS_PER_PAGE = new InjectionToken<Environment['productListingItemsPerPage']>(
  'productListingItemsPerPage',
  {
    factory: () => environment.productListingItemsPerPage,
  }
);

/**
 * default definition of the product listing view type
 */
export const DEFAULT_PRODUCT_LISTING_VIEW_TYPE = new InjectionToken<Environment['defaultProductListingViewType']>(
  'defaultProductListingViewType',
  {
    factory: () => environment.defaultProductListingViewType,
  }
);

/**
 * the configured cookie consent options for the application
 */
export const COOKIE_CONSENT_OPTIONS = new InjectionToken<CookieConsentOptions>('cookieConsentOptions', {
  factory: () => environment.cookieConsentOptions,
});

/**
 * the configured data retention policy for the application
 */
export const DATA_RETENTION_POLICY = new InjectionToken<DataRetentionPolicy>('dataRetentionPolicy', {
  factory: () => environment.dataRetention,
});

/**
 * the configured price update policy for the application
 */
export const PRICE_UPDATE = new InjectionToken<PriceUpdateType>('priceUpdate', {
  factory: () => environment.priceUpdate,
});

/**
 * the configured theme color
 */
export const THEME_COLOR = new InjectionToken<string>('themeColor', {
  factory: () => environment.themeColor,
});

/*
 * global definition of the Bootstrap grid system breakpoint widths
 */

export const SMALL_BREAKPOINT_WIDTH = new InjectionToken<number>('smallBreakpointWidth', {
  factory: () => environment.smallBreakpointWidth,
});

export const MEDIUM_BREAKPOINT_WIDTH = new InjectionToken<number>('mediumBreakpointWidth', {
  factory: () => environment.mediumBreakpointWidth,
});

export const LARGE_BREAKPOINT_WIDTH = new InjectionToken<number>('largeBreakpointWidth', {
  factory: () => environment.largeBreakpointWidth,
});
