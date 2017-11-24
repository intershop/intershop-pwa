import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../services/api.service';
import { AccountLogin } from './account-login';
import { UserDetail } from './account-login.model';
import { UserDetailService } from './user-detail.service';

export interface IAccountLoginService {
  singinUser(userDetails: AccountLogin): Observable<UserDetail>;
  logout(): void;
  isAuthorized(): boolean;
}

@Injectable()
export class AccountLoginService implements IAccountLoginService {

  constructor(private userDetailService: UserDetailService, private apiService: ApiService) { }

  /**
   * Calls signin function of concerned service
   * @param  {} userDetails
   * @returns Observable
   */
  singinUser(userDetails: AccountLogin): Observable<UserDetail> {
    const headers = new HttpHeaders().set('Authorization', 'BASIC ' + Buffer.from((userDetails.userName + ':' + userDetails.password)).toString('base64'));
    return this.apiService.get('customers/-', null, headers).map((data) => {
      if ((typeof (data) === 'object')) {
        this.userDetailService.setUserDetail(data);
      }
      return data;
    });
  }
  /**
   * Creates the User and saves the User details
   * @param  {} userDetails
   */
  createUser(userDetails): Observable<UserDetail> {
    return this.apiService.post('createUser', userDetails).map(data => {
      this.userDetailService.setUserDetail(data);
      return data;
    });
  }

  /**
   * calls isAuthorized function of concerned service
   * @returns boolean
   */
  isAuthorized(): boolean {
    return !!this.userDetailService.current;
  }

  /**
  * Calls logout function of concerned service
  * @returns void
  */
  logout(): void {
    this.userDetailService.setUserDetail(null);
  }

  subscribe(callback: (userDetail: UserDetail) => void) {
    this.userDetailService.subscribe(callback);
  }
}
