import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { Inject, Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, OperatorFunction, combineLatest, of } from 'rxjs';
import { catchError, first, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { SSR_LOCALE, SSR_TRANSLATIONS } from './configurations/state-keys';
import { StatePropertiesService } from './utils/state-transfer/state-properties.service';

export type Translations = Record<string, string | Record<string, string>>;

export function appendSlash(): OperatorFunction<string, string> {
  return (source$: Observable<string>) => source$.pipe(map(url => `${url}/`));
}

export function filterAndTransformKeys(translations: Record<string, string>): Translations {
  const filtered: Translations = {};
  for (const key in translations) {
    if (key.startsWith('pwa-')) {
      const value = translations[key];
      try {
        const parsed = JSON.parse(value);
        filtered[key.replace('pwa-', '')] = parsed;
      } catch {
        filtered[key.replace('pwa-', '')] = value;
      }
    }
  }
  return filtered;
}

@Injectable()
class ICMTranslateLoader implements TranslateLoader {
  constructor(
    private httpClient: HttpClient,
    private stateProperties: StatePropertiesService,
    private transferState: TransferState
  ) {}

  getTranslation(lang: string) {
    if (this.transferState.hasKey(SSR_TRANSLATIONS)) {
      return of(this.transferState.get(SSR_TRANSLATIONS, undefined));
    }
    const local$ = this.httpClient
      .get(`assets/i18n/${lang}.json`)
      .pipe(
        catchError(() =>
          this.stateProperties
            .getStateOrEnvOrDefault('DEFAULT_LOCALE', 'defaultLocale')
            .pipe(switchMap(url => this.httpClient.get(`assets/i18n/${url}.json`)))
        )
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

export function translateFactory(
  httpClient: HttpClient,
  stateProperties: StatePropertiesService,
  transferState: TransferState
) {
  return new ICMTranslateLoader(httpClient, stateProperties, transferState);
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient, StatePropertiesService, TransferState],
      },
    }),
  ],
})
export class InternationalizationModule {
  constructor(
    @Inject(LOCALE_ID) angularDefaultLocale: string,
    translateService: TranslateService,
    transferState: TransferState
  ) {
    registerLocaleData(localeDe);
    registerLocaleData(localeFr);

    let defaultLang = angularDefaultLocale.replace(/\-/, '_');
    if (transferState.hasKey(SSR_LOCALE)) {
      defaultLang = transferState.get(SSR_LOCALE, defaultLang);
    }
    translateService.setDefaultLang(defaultLang);
    translateService.use(defaultLang);
  }
}
