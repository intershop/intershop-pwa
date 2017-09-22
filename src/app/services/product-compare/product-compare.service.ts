import { Injectable } from '@angular/core';
import { GlobalStateAwareService } from '../base-services/global-state-aware-service';

@Injectable()
export class ProductCompareService extends GlobalStateAwareService<string[]> {

  constructor() {
    super('productCompareStatus', true, true, []);
  }
}
