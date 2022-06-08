import { Injectable, ɵfindLocaleData } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class TranslationGenerator {
  constructor(private translate: TranslateService) {}

  init() {
    this.translate.onLangChange.subscribe(({ lang }) => {
      const localeData = ɵfindLocaleData(lang);

      this.setShortDatePlaceholders(localeData, lang);
    });
  }

  private setShortDatePlaceholders(localeData: any, lang: string) {
    const shortDate = localeData[10][0].replace(/\by\b/, 'yyyy') as string;
    // keep-localization-pattern: ^common\.date_format\.letters\.\w$
    const localizedShortDate = shortDate.replace(/(\w)/g, (_, letter) =>
      this.translate.instant(`common.date_format.letters.${letter}`)
    );
    this.translate.set('common.placeholder.shortdate', localizedShortDate, lang);
    this.translate.set('common.placeholder.shortdate-caps', localizedShortDate.toUpperCase(), lang);
  }
}
