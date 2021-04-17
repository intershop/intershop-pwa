import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, switchMapTo } from 'rxjs/operators';

class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(language: string): Observable<unknown> {
    return of(language).pipe(
      map(lang => {
        switch (lang) {
          case 'de_DE':
            return import('@angular/common/locales/global/de');
          case 'fr_FR':
            return import('@angular/common/locales/global/fr');
        }
      }),
      switchMap(imp => {
        const translations$ = from(import(`../../assets/i18n/${language}.json`));
        return imp ? from(imp).pipe(switchMapTo(translations$)) : translations$;
      })
    );
  }
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader,
      },
    }),
  ],
})
export class InternationalizationModule {
  constructor(@Inject(LOCALE_ID) lang: string, translateService: TranslateService) {
    translateService.setDefaultLang(lang.replace(/\-/, '_'));
  }
}
