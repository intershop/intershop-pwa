import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { SKUListService } from '../base-services/sku-list.service';

@Injectable()
export class ProductCompareService extends SKUListService {

  constructor(cookieService: CookieService) {
    super('productCompareStatus', true, cookieService);
  }
}
