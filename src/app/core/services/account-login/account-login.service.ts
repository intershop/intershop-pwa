// NEEDS_WORK: is the model necessary?
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { CustomerFactory } from '../../../models/customer/customer.factory';
import { CustomerData } from '../../../models/customer/customer.interface';
import { Customer } from '../../../models/customer/customer.model';
import { ApiService } from '../../services/api.service';
import { AccountLogin } from './account-login.model';
import { UserDetailService } from './user-detail.service';

@Injectable()
export class AccountLoginService {

  constructor(
    private userDetailService: UserDetailService,
    private apiService: ApiService
  ) { }

  /**
   * Calls signin function of concerned service
   * @param  {} userDetails
   * @returns Observable
   */
  signinUser(userDetails: AccountLogin): Observable<Customer> {
    const headers = new HttpHeaders().set('Authorization', 'BASIC ' + Buffer.from((userDetails.userName + ':' + userDetails.password)).toString('base64'));
    return this.apiService.get<CustomerData>('customers/-', null, headers).pipe(
      map(data => CustomerFactory.fromData(data)),
      map((data) => {
        if ((typeof (data) === 'object')) {
          this.userDetailService.setValue(data);
        }
        return data;
      })

    );
  }
  /**
   * Creates the User and saves the User details
   * @param  {} userDetails
   */
  createUser(userDetails): Observable<Customer> {
    return this.apiService.post<Customer>('createUser', userDetails).pipe(
      map(data => {
        this.userDetailService.setValue(data);
        return data;
      })
    );
  }

  /**
   * calls isAuthorized function of concerned service
   * @returns boolean
   */
  isAuthorized(): boolean {
    return !!this.userDetailService.getValue();
  }

  /**
  * Calls logout function of concerned service
  * @returns void
  */
  logout(): void {
    this.userDetailService.setValue(null);
  }

  subscribe(callback: (userDetail: Customer) => void) {
    this.userDetailService.subscribe(callback);
  }
}
