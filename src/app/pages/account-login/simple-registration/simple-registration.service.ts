import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { UserDetail } from '../../../services/account-login/account-login.model';
import { UserDetailService } from '../../../services/account-login/user-detail.service';

@Injectable()
export class SimpleRegistrationService {
  constructor(private userDetailService: UserDetailService) { }
  createUser(userDetails): Observable<UserDetail> {
    // TODO: creating the user should be done with a method from account-login.service
    this.userDetailService.next(userDetails);
    return Observable.of(null);
  }
}
