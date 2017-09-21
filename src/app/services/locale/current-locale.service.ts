import { Injectable } from '@angular/core';
import { GlobalStateAwareService } from '../base-services/global-state-aware-service';

@Injectable()
export class CurrentLocaleService extends GlobalStateAwareService<string> {

  constructor() {
    super('currentLocale', false, false);
  }
}
