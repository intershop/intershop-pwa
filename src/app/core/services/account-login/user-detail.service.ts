import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { UserDetail } from '../../../models/account-login.model';
import { GlobalStateAwareService } from '../base-services/global-state-aware.service';

@Injectable()
export class UserDetailService extends GlobalStateAwareService<UserDetail> {

  constructor(
    cookieService: CookieService
  ) {
    super('currentUserDetail', true, true, null, cookieService);
  }

  setUserDetail(newUserDetail: UserDetail): void {
    this.next(newUserDetail);
  }
}
