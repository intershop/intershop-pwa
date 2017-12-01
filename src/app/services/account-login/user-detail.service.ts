import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { GlobalStateAwareService } from '../base-services/global-state-aware.service';
import { UserDetail } from './account-login.model';

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
