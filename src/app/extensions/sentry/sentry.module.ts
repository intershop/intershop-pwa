import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import * as Sentry from '@sentry/browser';
import { environment } from 'environments/environment';

import { DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { FeatureToggleModule, FeatureToggleService } from 'ish-core/feature-toggle.module';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {
    // empty
  }
  handleError(error) {
    Sentry.captureException(error.originalError || error);
    // # throw error;
    // # console.error(error);
  }
}

@NgModule({
  imports: [FeatureToggleModule],
  providers: [{ provide: ErrorHandler, useClass: SentryErrorHandler }],
})
export class SentryModule {
  appVersion: string;

  constructor(featureToggleService: FeatureToggleService, private transferState: TransferState) {
    this.appVersion = this.transferState.get(DISPLAY_VERSION, '');
    // log errors to sentry.io if sentryDSN is available in evironments
    setTimeout(() => {
      if (environment.sentryDSN && featureToggleService.enabled('sentry')) {
        Sentry.init({
          dsn: environment.sentryDSN,
          release: this.appVersion || require('./../../../../package.json').version,
        });
      }
    }, 0);
  }
}
