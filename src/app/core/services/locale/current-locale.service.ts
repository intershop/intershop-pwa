import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalStateAwareService } from '../base-services/global-state-aware.service';

@Injectable()
export class CurrentLocaleService extends GlobalStateAwareService<any> {

  constructor(
    private translateService: TranslateService
  ) {
    super('currentLocale', false, false);
  }

  setLang(lang: any) {
    this.translateService.use(lang.lang);
    this.next(lang);
  }
}
