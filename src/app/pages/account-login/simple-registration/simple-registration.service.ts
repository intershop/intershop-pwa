import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AccountLoginService } from '../../../services/account-login/account-login.service';
import { UserDetail } from '../../../services/account-login/account-login.model';

@Injectable()
export class SimpleRegistrationService {
  constructor(private accountLoginService: AccountLoginService) { }
  createUser(userDetails: UserDetail): Observable<UserDetail> {
    this.accountLoginService.storeUserDetail(userDetails);
    return Observable.of(userDetails);
  }
}
