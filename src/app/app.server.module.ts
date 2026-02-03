import { HTTP_INTERCEPTORS, HttpErrorResponse, provideHttpClient, withFetch } from '@angular/common/http';
import { ErrorHandler, NgModule, TransferState } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { META_REDUCERS } from '@ngrx/store';

import { configurationMeta } from 'ish-core/configurations/configuration.meta';
import { DATA_RETENTION_POLICY } from 'ish-core/configurations/injection-keys';
import { COOKIE_CONSENT_VERSION, DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { UniversalCacheInterceptor } from 'ish-core/interceptors/universal-cache.interceptor';
import { UniversalInternalBackendInterceptor } from 'ish-core/interceptors/universal-internal-backend.interceptor';
import { UniversalLogInterceptor } from 'ish-core/interceptors/universal-log.interceptor';
import { UniversalMockInterceptor } from 'ish-core/interceptors/universal-mock.interceptor';
import { UniversalPrometheusInterceptor } from 'ish-core/interceptors/universal-prometheus.interceptor';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

class UniversalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      console.error('ERROR', error.message);
    } else if (error instanceof Error) {
      console.error('ERROR', error.name, error.message, error.stack?.split('\n')?.[1]?.trim());
    } else if (typeof error === 'object') {
      try {
        console.error('ERROR', JSON.stringify(error));
      } catch (_) {
        // do not log the error if it can't be stringified, it floods the log with irrelevant information
        console.error('ERROR (cannot stringify)');
      }
    } else {
      console.error('ERROR', error);
    }
  }
}

const providers = [
  // Conditionally add provideHttpClient(withFetch()) based on environment variable
  ...(/on|1|true|yes/.test(process.env.ALLOW_H2?.toLowerCase()) ? [provideHttpClient(withFetch())] : []),
  ...(process.env.ICM_BASE_URL_SSR
    ? [{ provide: HTTP_INTERCEPTORS, useClass: UniversalInternalBackendInterceptor, multi: true }]
    : []),
  { provide: HTTP_INTERCEPTORS, useClass: UniversalMockInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: UniversalCacheInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: UniversalLogInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: UniversalPrometheusInterceptor, multi: true },
  { provide: ErrorHandler, useClass: UniversalErrorHandler },
  { provide: META_REDUCERS, useValue: configurationMeta, multi: true },
  // disable data retention for SSR
  { provide: DATA_RETENTION_POLICY, useValue: {} },
];

@NgModule({
  imports: [AppModule, ServerModule],
  providers,
  bootstrap: [AppComponent],
})
export class AppServerModule {
  constructor(transferState: TransferState) {
    transferState.set(DISPLAY_VERSION, process.env.DISPLAY_VERSION);
    transferState.set(COOKIE_CONSENT_VERSION, process.env.COOKIE_CONSENT_VERSION || environment.cookieConsentVersion);
  }
}
