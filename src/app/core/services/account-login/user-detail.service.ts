import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Customer } from '../../../models/customer/customer.model';
import { GlobalStateAwareService } from '../base-services/global-state-aware.service';

@Injectable()
export class UserDetailService extends GlobalStateAwareService<Customer> {

  constructor(
    @Inject(PLATFORM_ID) platformId,
    cookieService: CookieService
  ) {
    super(platformId, 'currentUserDetail', true, true, null, cookieService);
  }

  setValue(newUserDetail: Customer): void {
    this.next(newUserDetail);
  }
}
