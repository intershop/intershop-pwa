import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import * as Sentry from '@sentry/browser';

import { SentryStoreModule } from './store/sentry-store.module';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  handleError(error) {
    Sentry.captureException(error.originalError || error);
    console.error(error);
  }
}

@NgModule({
  imports: [SentryStoreModule],
  providers: [{ provide: ErrorHandler, useClass: SentryErrorHandler }],
})
export class SentryModule {}
