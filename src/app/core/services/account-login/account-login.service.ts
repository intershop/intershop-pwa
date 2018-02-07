// NEEDS_WORK: is the model necessary?
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators/switchMap';
import { CustomerFactory } from '../../../models/customer/customer.factory';
import { CustomerData } from '../../../models/customer/customer.interface';
import { Customer } from '../../../models/customer/customer.model';
import { ApiService } from '../../services/api.service';
import { AccountLogin } from './account-login.model';

@Injectable()
export class AccountLoginService {

  constructor(
    private apiService: ApiService
  ) { }

  private accountLoginFromCustomer(customer: CustomerData): AccountLogin {
    return {
      userName: customer.credentials.login,
      password: customer.credentials.password
    };
  }

  signinUser(userDetails: AccountLogin): Observable<Customer> {
    const headers = new HttpHeaders().set('Authorization', 'BASIC ' + Buffer.from((userDetails.userName + ':' + userDetails.password)).toString('base64'));
    return this.apiService.get<CustomerData>('customers/-', null, headers).pipe(
      map(data => CustomerFactory.fromData(data))
    );
  }

  createUser(newCustomer: CustomerData): Observable<Customer> {
    return this.apiService.post<CustomerData>('customers', newCustomer).pipe(
      // TODO: normally this should work but I get 500 from ICM
      // switchMap(() => this.apiService.get<CustomerData>('customers/-')),
      // map(data => CustomerFactory.fromData(data))
      switchMap(() => this.signinUser(this.accountLoginFromCustomer(newCustomer)))
    );
  }
}
