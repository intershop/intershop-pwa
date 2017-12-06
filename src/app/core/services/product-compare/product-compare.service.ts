import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { SKUListService } from '../base-services/sku-list.service';

@Injectable()
export class ProductCompareService extends SKUListService {

  constructor(
    @Inject(PLATFORM_ID) platformId,
    cookieService: CookieService
  ) {
    super(platformId, 'productCompareStatus', true, cookieService);
  }
}
