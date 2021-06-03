import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { META_REDUCERS } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Observable, OperatorFunction, combineLatest, of, throwError } from 'rxjs';
import { catchError, first, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { configurationMeta } from 'ish-core/configurations/configuration.meta';
import { COOKIE_CONSENT_VERSION, DISPLAY_VERSION, SSR_TRANSLATIONS } from 'ish-core/configurations/state-keys';
import { UniversalLogInterceptor } from 'ish-core/interceptors/universal-log.interceptor';
import { UniversalMockInterceptor } from 'ish-core/interceptors/universal-mock.interceptor';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

type Translations = Record<string, string | Record<string, string>>;

function appendSlash(): OperatorFunction<string, string> {
  return (source$: Observable<string>) => source$.pipe(map(url => `${url}/`));
}

function filterAndTransformKeys(translations: Record<string, string>): Translations {
  const filtered: Translations = {};
  const prefix = /^pwa-/;
  for (const key in translations) {
    if (prefix.test(key)) {
      const value = translations[key];
      try {
        const parsed = JSON.parse(value);
        filtered[key.replace(prefix, '')] = parsed;
      } catch {
        filtered[key.replace(prefix, '')] = value;
      }
    }
  }
  return filtered;
}

class TranslateUniversalLoader implements TranslateLoader {
  constructor(
    private stateProperties: StatePropertiesService,
    private httpClient: HttpClient,
    private transferState: TransferState
  ) {}

  getTranslation(lang: string): Observable<string> {
    const local$ = of(lang).pipe(
      map(() => {
        let rootPath = process.cwd();
        if (rootPath && rootPath.indexOf('browser') > 0) {
          rootPath = process.cwd().split('browser')[0];
        }
        const file = join(rootPath, 'dist', 'browser', 'assets', 'i18n', `${lang}.json`);
        if (!existsSync(file)) {
          const errString = `Localization file '${file}' not found!`;
          console.error(errString);
          return throwError(errString);
        } else {
          return JSON.parse(readFileSync(file, 'utf8'));
        }
      })
    );
    return this.icmURL.pipe(
      switchMap(url =>
        this.httpClient.get(`${url};loc=${lang}/localizations`, {
          params: {
            searchKeys: 'pwa-',
          },
        })
      ),
      map(filterAndTransformKeys),
      withLatestFrom(local$),
      map(([translations, localTranslations]) => ({
        ...localTranslations,
        ...translations,
      })),
      tap((translations: Translations) => this.transferState.set(SSR_TRANSLATIONS, translations)),
      catchError(() => local$)
    );
  }

  get icmURL(): Observable<string> {
    return combineLatest([
      this.stateProperties.getStateOrEnvOrDefault('ICM_BASE_URL', 'icmBaseURL').pipe(appendSlash()),
      this.stateProperties.getStateOrEnvOrDefault('ICM_SERVER', 'icmServer').pipe(appendSlash()),
      this.stateProperties.getStateOrEnvOrDefault('ICM_CHANNEL', 'icmChannel').pipe(appendSlash()),
      this.stateProperties.getStateOrEnvOrDefault('ICM_APPLICATION', 'icmApplication'),
    ]).pipe(
      first(),
      map(arr => arr.join(''))
    );
  }
}

export function translateLoaderFactory(
  stateProperties: StatePropertiesService,
  httpClient: HttpClient,
  transferState: TransferState
) {
  return new TranslateUniversalLoader(stateProperties, httpClient, transferState);
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
    ServerModule,
    ServerTransferStateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [StatePropertiesService, HttpClient, TransferState],
      },
    }),
  ],
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
