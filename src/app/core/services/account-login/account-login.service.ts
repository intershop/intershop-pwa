// NEEDS_WORK: is the model necessary?
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { Customer } from '../../../models/customer/customer.model';
import { ApiService } from '../../services/api.service';
import { AccountLogin } from './account-login.model';

@Injectable()
export class AccountLoginService {

  constructor(
    private apiService: ApiService
  ) { }

  private accountLoginFromCustomer(customer: Customer): AccountLogin {
    return {
      userName: customer.credentials.login,
      password: customer.credentials.password
    };
  }

  signinUser(userDetails: AccountLogin): Observable<Customer> {
    const headers = new HttpHeaders().set('Authorization', 'BASIC ' + Buffer.from((userDetails.userName + ':' + userDetails.password)).toString('base64'));
    return this.apiService.get<Customer>('customers/-', null, headers);
  }

  createUser(newCustomer: Customer): Observable<Customer> {
    return this.apiService.post<Customer>('customers', newCustomer).pipe(
      // TODO:see #IS-22750 - user should actually be logged in after registration
      switchMap(() => this.signinUser(this.accountLoginFromCustomer(newCustomer)))
    );
  }
}
