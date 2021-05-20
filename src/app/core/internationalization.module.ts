import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, OperatorFunction, combineLatest } from 'rxjs';
import { catchError, first, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { StatePropertiesService } from './utils/state-transfer/state-properties.service';

function appendSlash(): OperatorFunction<string, string> {
  return (source$: Observable<string>) => source$.pipe(map(url => `${url}/`));
}

class ICMTranslateLoader implements TranslateLoader {
  constructor(private httpClient: HttpClient, private stateProperties: StatePropertiesService) {}

  getTranslation(lang: string) {
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
      map(this.filterAndTransformKeys),
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

  filterAndTransformKeys(translations: Record<string, string>): Record<string, string | Record<string, string>> {
    const filtered: Record<string, string | Record<string, string>> = {};
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
}

export function translateFactory(httpClient: HttpClient, stateProperties: StatePropertiesService) {
  return new ICMTranslateLoader(httpClient, stateProperties);
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient, StatePropertiesService],
      },
    }),
  ],
})
export class InternationalizationModule {
  constructor(@Inject(LOCALE_ID) lang: string, translateService: TranslateService) {
    registerLocaleData(localeDe);
    registerLocaleData(localeFr);

    translateService.setDefaultLang(lang.replace(/\-/, '_'));
  }
}
