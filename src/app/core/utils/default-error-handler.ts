import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { FeatureToggleService } from './feature-toggle/feature-toggle.service';

@Injectable()
export class DefaultErrorhandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  async handleError(error: Error) {
    if (this.injector.get(FeatureToggleService)?.enabled('sentry')) {
      await import('@sentry/browser').then(sentry => {
        sentry.captureException(error);
      });
    }
    console.error(error);
  }
}
