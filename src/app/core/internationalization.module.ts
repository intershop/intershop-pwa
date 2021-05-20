import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function translateFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
import { Observable } from 'rxjs';
import { catchError, first, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { getICMStaticURL } from './store/core/configuration';
import { whenTruthy } from './utils/operators';
import { StatePropertiesService } from './utils/state-transfer/state-properties.service';

class ICMTranslateLoader implements TranslateLoader {
  constructor(private httpClient: HttpClient, private store: Store, private stateProperties: StatePropertiesService) {}
  get localizationUrl$(): Observable<string> {
    return this.store.pipe(select(getICMStaticURL)).pipe(
      withLatestFrom(this.stateProperties.getStateOrEnvOrDefault('ICM_CHANNEL', 'icmChannel')),
      map(([url, channel]: [string, string]) => `${url}/${channel.replace('-Site', '')}`),
      whenTruthy(),
      first()
    );
  }

  getTranslation(lang: string): Observable<any> {
    console.log(lang);
    return this.localizationUrl$.pipe(
      switchMap(url => {
        console.log('trying ICM');
        return this.httpClient.get(`${url}/${lang}/translations/${lang}.json`).pipe(
          catchError(() => {
            console.log('trying local');
            return this.httpClient.get(`assets/i18n/${lang}.json`).pipe(
              catchError(() => {
                console.log('trying default');
                return this.stateProperties
                  .getStateOrEnvOrDefault('DEFAULT_LOCALE', 'defaultLocale')
                  .pipe(switchMap(locale => this.httpClient.get(`assets/i18n/${locale}.json`)));
              })
            );
          })
        );
      })
    );
  }
}

export function translateFactory(httpClient: HttpClient, store: Store, stateProperties: StatePropertiesService) {
  return new ICMTranslateLoader(httpClient, store, stateProperties);
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient],
        deps: [HttpClient, Store, StatePropertiesService],
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
