import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalStateAwareService } from '../base-services/global-state-aware.service';

@Injectable()
export class CurrentLocaleService extends GlobalStateAwareService<string> {

  constructor(private translateService: TranslateService) {
    super('currentLocale', false, false);
  }

  setLang(lang: string) {
    this.translateService.use(lang);
    this.next(lang);
  }
}
