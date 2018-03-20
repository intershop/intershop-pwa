import { InjectionToken } from '@angular/core';
import { Locale } from '../../models/locale/locale.model';

export const NEED_MOCK = new InjectionToken<boolean>('needMock');
export const MUST_MOCK_PATHS = new InjectionToken<string[]>('mustMockPaths');
export const AVAILABLE_LOCALES = new InjectionToken<Locale[]>('availableLocales');
export const USER_REGISTRATION_LOGIN_TYPE = new InjectionToken<string>('userRegistrationLoginType');
export const MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH = new InjectionToken<number>('mainNavigationMaxSubCategoriesDepth');
