import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function translateFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient],
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
