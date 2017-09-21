import { Location } from '@angular/common';
import { Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../environments/environment';
import { LocalizeRouterSettings } from './routes-parser-locale-currency/localize-router.config';
import { LocalizeParser } from './routes-parser-locale-currency/localize-router.parser';

export class LocalizeRouterLoader extends LocalizeParser {
  constructor(translate: TranslateService,
              location: Location,
              settings: LocalizeRouterSettings) {
    super(translate, location, settings);
  }

  load(routes: Routes): Promise<any> {
    return new Promise((resolve: any) => {
      this.prefix = environment.prefix || '';
      this.pattern = environment.pattern || '';
      this.localesCollection = environment.locales;
      this.init(routes).then(resolve);
    });
  }

}
