import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AccountLoginService } from '../../../services/account-login/account-login.service';

@Injectable()
export class SimpleRegistrationService {
  constructor(private accountLoginService: AccountLoginService) { }
  createUser(userDetails): Observable<string> {
    this.accountLoginService.storeUserDetail(userDetails);
    return Observable.of('Data Saved');
  }
}
