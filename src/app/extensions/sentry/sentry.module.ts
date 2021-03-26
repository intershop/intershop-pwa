import { isPlatformBrowser } from '@angular/common';
import { ErrorHandler, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { captureException } from '@sentry/browser';

import { DefaultErrorHandler } from 'ish-core/utils/default-error-handler';

@NgModule({})
export class SentryModule {
  constructor(errorHandler: ErrorHandler, @Inject(PLATFORM_ID) platformId: string) {
    if (isPlatformBrowser(platformId)) {
      if (errorHandler instanceof DefaultErrorHandler) {
        errorHandler.addHandler(error => {
          captureException(error);
        });
      } else {
        console.warn('cannot add sentry to DefaultErrorHandler');
      }
    }
  }
}
