import { HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { META_REDUCERS } from '@ngrx/store';

import { configurationMeta } from 'ish-core/configurations/configuration.meta';
import { COOKIE_CONSENT_VERSION, DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { UniversalLogInterceptor } from 'ish-core/interceptors/universal-log.interceptor';
import { UniversalMockInterceptor } from 'ish-core/interceptors/universal-mock.interceptor';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

export class UniversalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    if (error instanceof HttpErrorResponse) {
      console.error('ERROR', error.message);
    } else {
      console.error('ERROR', error.name, error.message, error.stack?.split('\n')?.[1]?.trim());
    }
  }
}

@NgModule({
  imports: [AppModule, ServerModule, ServerTransferStateModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: UniversalMockInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UniversalLogInterceptor, multi: true },
    { provide: ErrorHandler, useClass: UniversalErrorHandler },
    { provide: META_REDUCERS, useValue: configurationMeta, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
  constructor(transferState: TransferState) {
    transferState.set(DISPLAY_VERSION, process.env.DISPLAY_VERSION);
    transferState.set(COOKIE_CONSENT_VERSION, process.env.COOKIE_CONSENT_VERSION || environment.cookieConsentVersion);
  }
}
