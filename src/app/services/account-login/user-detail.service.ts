import { Injectable } from '@angular/core';
import { GlobalStateAwareService } from '../base-services/global-state-aware-service';
import { UserDetail } from './account-login.model';

@Injectable()
export class UserDetailService extends GlobalStateAwareService<UserDetail> {

  constructor() {
    super('currentUserDetail', true);
  }
}
