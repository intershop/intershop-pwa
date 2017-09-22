import { Injectable } from '@angular/core';
import { GlobalStateAwareService } from '../base-services/global-state-aware-service';

@Injectable()
export class CartStatusService extends GlobalStateAwareService<string[]> {

  constructor() {
    super('cartData', true, false, []);
  }
}
