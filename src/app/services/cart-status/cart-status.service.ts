import { Injectable } from '@angular/core';
import { SKUListService } from '../base-services/sku-list-service';

@Injectable()
export class CartStatusService extends SKUListService {

  constructor() {
    super('cartData', false);
  }
}
