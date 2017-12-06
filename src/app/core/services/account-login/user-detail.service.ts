import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Customer } from '../../../models/customer.model';
import { GlobalStateAwareService } from '../base-services/global-state-aware.service';

@Injectable()
export class UserDetailService extends GlobalStateAwareService<Customer> {

  constructor(
    cookieService: CookieService
  ) {
    super('currentUserDetail', true, true, null, cookieService);
  }

  setValue(newUserDetail: Customer): void {
    this.next(newUserDetail);
  }
}
