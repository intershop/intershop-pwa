import { TranslateService } from '@ngx-translate/core';
import { Routes } from '@angular/router';
import { Location } from '@angular/common';

import { environment } from '../../environments/environment';
import { LocalizeParser } from './routes-parser-locale-currency/localize-router.parser';
import { LocalizeRouterSettings } from './routes-parser-locale-currency/localize-router.config';

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
