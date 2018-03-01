import { InjectionToken } from '@angular/core';
import { Locale } from '../../models/locale/locale.interface';

export const NEED_MOCK = new InjectionToken<boolean>('needMock');
export const MUST_MOCK_PATHS = new InjectionToken<string[]>('mustMockPaths');
export const AVAILABLE_LOCALES = new InjectionToken<Locale[]>('availableLocales');
export const USER_REGISTRATION_LOGIN_TYPE = new InjectionToken<string>('userRegistrationLoginType');
export const USER_REGISTRATION_SUBSCRIBE_TO_NEWSLETTER = new InjectionToken<boolean>('userRegistrationSubscribeToNewsletter');
