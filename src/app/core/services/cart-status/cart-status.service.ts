import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { SKUListService } from '../base-services/sku-list.service';

@Injectable()
export class CartStatusService extends SKUListService {

  constructor( @Inject(PLATFORM_ID) platformId) {
    super(platformId, 'cartData', false);
  }
}
