import { HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { existsSync, readFileSync } from 'fs';
import { ServerCookiesModule } from 'ngx-utils-cookies-port';
import { join } from 'path';
import { Observable, Observer } from 'rxjs';

import { DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { UniversalLogInterceptor } from 'ish-core/interceptors/universal-log.interceptor';
import { UniversalMockInterceptor } from 'ish-core/interceptors/universal-mock.interceptor';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

class TranslateUniversalLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      let rootPath = process.cwd();
      if (rootPath && rootPath.indexOf('browser') > 0) {
        rootPath = process.cwd().split('browser')[0];
      }
      const file = join(rootPath, 'dist', 'browser', 'assets', 'i18n', `${lang}.json`);
      if (!existsSync(file)) {
        const errString = `Localization file '${file}' not found!`;
        console.error(errString);
        observer.error(errString);
      } else {
        const content = JSON.parse(readFileSync(file, 'utf8'));
        observer.next(content);
        observer.complete();
      }
    });
  }
}

export function translateLoaderFactory() {
  return new TranslateUniversalLoader();
}

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
  imports: [
    AppModule,
    ServerCookiesModule,
    ServerModule,
    ServerTransferStateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: UniversalMockInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UniversalLogInterceptor, multi: true },
    { provide: ErrorHandler, useClass: UniversalErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
  constructor(transferState: TransferState) {
    transferState.set(DISPLAY_VERSION, process.env.DISPLAY_VERSION);
  }
}
