import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalStateAwareService } from '../base-services/global-state-aware.service';

@Injectable()
export class CurrentLocaleService extends GlobalStateAwareService<any> {

  constructor(
    @Inject(PLATFORM_ID) platformId,
    private translateService: TranslateService
  ) {
    super(platformId, 'currentLocale', false, false);
  }

  setValue(lang: any) {
    this.translateService.use(lang.lang);
    this.next(lang);
  }
}
