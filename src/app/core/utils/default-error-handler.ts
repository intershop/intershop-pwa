import { ErrorHandler, Injectable, Injector } from '@angular/core';
import * as Sentry from '@sentry/browser';

import { FeatureToggleService } from './feature-toggle/feature-toggle.service';

@Injectable()
export class DefaultErrorhandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error): void {
    if (this.injector.get(FeatureToggleService)?.enabled('sentry')) {
      Sentry.captureException(error);
    }
    console.error(error);
  }
}
