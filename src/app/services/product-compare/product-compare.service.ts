import { Injectable } from '@angular/core';
import { SKUListService } from '../base-services/sku-list.service';

@Injectable()
export class ProductCompareService extends SKUListService {

  constructor() {
    super('productCompareStatus', true);
  }
}
