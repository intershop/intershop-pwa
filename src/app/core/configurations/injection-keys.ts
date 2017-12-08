import { InjectionToken } from '@angular/core';

export const NEED_MOCK = new InjectionToken<boolean>('needMock');
export const MUST_MOCK_PATHS = new InjectionToken<string[]>('mustMockPaths');
export const AVAILABLE_LOCALES = new InjectionToken<any>('availableLocales');
export const USE_SIMPLE_ACCOUNT = new InjectionToken<boolean>('useSimpleAccount');
export const USER_REGISTRATION_LOGIN_TYPE = new InjectionToken<string>('userRegistrationLoginType');
export const USER_REGISTRATION_SUBSCRIBE_TO_NEWSLETTER = new InjectionToken<boolean>('userRegistrationSubscribeToNewsletter');
