import { ErrorHandler, NgModule } from '@angular/core';
import { captureException } from '@sentry/browser';

import { DefaultErrorHandler } from 'ish-core/utils/default-error-handler';

@NgModule({})
export class SentryModule {
  constructor(errorHandler: ErrorHandler) {
    if (!SSR) {
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
