import { InjectionToken } from '@angular/core';
import { Locale } from '../../models/locale/locale.model';

/**
 * If 'true' the application has to work with the implemented mock data, if 'false' a backend system is used
 */
export const NEED_MOCK = new InjectionToken<boolean>('needMock');
/**
 * Array of paths that always use mocked data
 */
export const MUST_MOCK_PATHS = new InjectionToken<string[]>('mustMockPaths');
/**
 * Array of locales that are available in the application
 */
export const AVAILABLE_LOCALES = new InjectionToken<Locale[]>('availableLocales');
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
 * global definition of the endless scrolling page size
 */
export const ENDLESS_SCROLLING_ITEMS_PER_PAGE = new InjectionToken<number>('endlessScrollingItemsPerPage');
