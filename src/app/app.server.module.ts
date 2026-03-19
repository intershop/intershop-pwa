import { HTTP_INTERCEPTORS, HttpErrorResponse, provideHttpClient, withFetch } from '@angular/common/http';
import { ErrorHandler, NgModule, Optional, TransferState } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { META_REDUCERS } from '@ngrx/store';

import { configurationMeta } from 'ish-core/configurations/configuration.meta';
import { DATA_RETENTION_POLICY } from 'ish-core/configurations/injection-keys';
import { COOKIE_CONSENT_VERSION, DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { SSRCacheInterceptor } from 'ish-core/interceptors/ssr-cache.interceptor';
import { SSRInternalBackendInterceptor } from 'ish-core/interceptors/ssr-internal-backend.interceptor';
import { SSRLogInterceptor } from 'ish-core/interceptors/ssr-log.interceptor';
import { SSRMockInterceptor } from 'ish-core/interceptors/ssr-mock.interceptor';
import { SSRPrometheusInterceptor } from 'ish-core/interceptors/ssr-prometheus.interceptor';
import { getLogger } from 'ish-core/utils/ssr-logging/ssr-logging.service';
import { REQUEST_ID } from 'ish-core/utils/ssr/ssr.tokens';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

const logger = getLogger('SSRErrorHandler');

// Type guard for serialized HttpErrorResponse (prevent doubled encoding issues)
function isHttpErrorLike(error: unknown): error is { name: string; status: number; message: string; url?: string } {
  return (
    typeof error === 'object' &&
    // eslint-disable-next-line unicorn/no-null
    error !== null &&
    'name' in error &&
    (error as { name: unknown }).name === 'HttpErrorResponse' &&
    'status' in error &&
    'message' in error
  );
}

class SSRErrorHandler implements ErrorHandler {
  constructor(private requestId: string | undefined) {}

  handleError(error: unknown): void {
    // Base data with request ID for tracing
    const baseData = this.requestId ? { trace: { id: this.requestId } } : {};

    if (error instanceof HttpErrorResponse || isHttpErrorLike(error)) {
      const logData = {
        ...baseData,
        error: { message: error.message },
        http: { response: { status_code: error.status } },
        url: { original: error.url },
      };
      if (error.status >= 500) {
        logger.error(logData, 'HTTP ERROR');
      } else if (error.status >= 400) {
        logger.warn(logData, 'HTTP ERROR');
      } else {
        logger.info(logData, 'HTTP ERROR');
      }
    } else if (error instanceof Error) {
      logger.error(
        { ...baseData, error: { message: error.message, type: error.name, stack_trace: error.stack } },
        'Application ERROR'
      );
    } else if (typeof error === 'object') {
      try {
        logger.error({ ...baseData, error: { message: JSON.stringify(error) } }, 'ERROR');
      } catch (_) {
        // do not log the error if it can't be stringified, it floods the log with irrelevant information
        logger.error({ ...baseData }, 'ERROR (cannot stringify)');
      }
    } else {
      logger.error({ ...baseData, error: { message: String(error) } }, 'ERROR');
    }
  }
}

const providers = [
  provideServerRendering(),
  // Conditionally add provideHttpClient(withFetch()) based on environment variable
  ...(/on|1|true|yes/.test(process.env.ALLOW_H2?.toLowerCase()) ? [provideHttpClient(withFetch())] : []),
  ...(process.env.ICM_BASE_URL_SSR
    ? [{ provide: HTTP_INTERCEPTORS, useClass: SSRInternalBackendInterceptor, multi: true }]
    : []),
  { provide: HTTP_INTERCEPTORS, useClass: SSRMockInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: SSRCacheInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: SSRLogInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: SSRPrometheusInterceptor, multi: true },
  {
    provide: ErrorHandler,
    useFactory: (requestId: string | undefined) => new SSRErrorHandler(requestId),
    deps: [[new Optional(), REQUEST_ID]],
  },
  { provide: META_REDUCERS, useValue: configurationMeta, multi: true },
  // disable data retention for SSR
  { provide: DATA_RETENTION_POLICY, useValue: {} },
];

@NgModule({
  imports: [AppModule],
  providers,
  bootstrap: [AppComponent],
})
export class AppServerModule {
  constructor(transferState: TransferState) {
    transferState.set(DISPLAY_VERSION, process.env.DISPLAY_VERSION);
    transferState.set(COOKIE_CONSENT_VERSION, process.env.COOKIE_CONSENT_VERSION || environment.cookieConsentVersion);
  }
}
