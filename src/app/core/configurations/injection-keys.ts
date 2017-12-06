import { InjectionToken } from '@angular/core';

export const NEED_MOCK = new InjectionToken<boolean>('needMock');
export const MUST_MOCK_PATHS = new InjectionToken<string[]>('mustMockPaths');
export const AVAILABLE_LOCALES = new InjectionToken<any>('availableLocales');
