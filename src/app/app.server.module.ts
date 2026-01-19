import { HTTP_INTERCEPTORS, HttpErrorResponse, provideHttpClient, withFetch } from '@angular/common/http';
import { ErrorHandler, NgModule, TransferState } from '@angular/core';
import { ServerModule, provideServerRendering } from '@angular/platform-server';
import { META_REDUCERS } from '@ngrx/store';

import { configurationMeta } from 'ish-core/configurations/configuration.meta';
import { DATA_RETENTION_POLICY } from 'ish-core/configurations/injection-keys';
import { COOKIE_CONSENT_VERSION, DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { SSRCacheInterceptor } from 'ish-core/interceptors/ssr-cache.interceptor';
import { SSRLogInterceptor } from 'ish-core/interceptors/ssr-log.interceptor';
import { SSRMockInterceptor } from 'ish-core/interceptors/ssr-mock.interceptor';
import { SSRPrometheusInterceptor } from 'ish-core/interceptors/ssr-prometheus.interceptor';
import { LogLevel, logECS, shouldLog } from 'ish-core/utils/ssr-logging.utils';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

function logErrorPlainText(error: unknown): void {
  let level: LogLevel = 'error';
  let message: string;

  if (error instanceof HttpErrorResponse) {
    level = error.status >= 500 ? 'error' : 'warn';
    message = error.message;
  } else if (error instanceof Error) {
    message = `${error.name} ${error.message} ${error.stack?.split('\n')?.[1]?.trim()}`;
  } else if (typeof error === 'object') {
    try {
      message = JSON.stringify(error);
    } catch (_) {
      message = '(cannot stringify)';
    }
  } else {
    message = String(error);
  }

  if (shouldLog(level)) {
    const logMethod = level === 'error' ? console.error : console.warn;
    logMethod(level.toUpperCase(), message);
  }
}

function buildEcsLogData(error: unknown): { level: LogLevel; message: string; extra: Record<string, unknown> } {
  if (error instanceof HttpErrorResponse) {
    return {
      level: error.status >= 500 ? 'error' : 'warn',
      message: `ERROR: ${error.message}`,
      extra: {
        error: { message: error.message, type: 'HttpErrorResponse' },
        http: { response: { status_code: error.status } },
        url: { original: error.url },
      },
    };
  }
  if (error instanceof Error) {
    return {
      level: 'error',
      message: `ERROR: ${error.message}`,
      extra: { error: { message: error.message, type: error.name, stack_trace: error.stack } },
    };
  }
  if (typeof error === 'object') {
    try {
      const jsonStr = JSON.stringify(error);
      return { level: 'error', message: `ERROR: ${jsonStr}`, extra: { error: { details: jsonStr } } };
    } catch (_) {
      return { level: 'error', message: 'ERROR (cannot stringify)', extra: { error: { message: 'cannot stringify' } } };
    }
  }
  return { level: 'error', message: `ERROR: ${String(error)}`, extra: { error: { message: String(error) } } };
}

class SSRErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    const isJsonLogging = process.env.LOGFORMAT?.toLowerCase() === 'json';

    if (!isJsonLogging) {
      logErrorPlainText(error);
      return;
    }

    const { level, message, extra } = buildEcsLogData(error);
    if (shouldLog(level)) {
      logECS(level, message, 'app.server.module', extra);
    }
  }
}

const providers = [
  // Modern server rendering provider
  provideServerRendering(),
  // Conditionally add provideHttpClient(withFetch()) based on environment variable
  ...(/on|1|true|yes/.test(process.env.ALLOW_H2?.toLowerCase()) ? [provideHttpClient(withFetch())] : []),
  { provide: HTTP_INTERCEPTORS, useClass: SSRMockInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: SSRCacheInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: SSRLogInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: SSRPrometheusInterceptor, multi: true },
  { provide: ErrorHandler, useClass: SSRErrorHandler },
  { provide: META_REDUCERS, useValue: configurationMeta, multi: true },
  // disable data retention for SSR
  { provide: DATA_RETENTION_POLICY, useValue: {} },
  // Canonical URL handling is managed by SEO effects, not APP_INITIALIZER
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
