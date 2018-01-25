import { Injectable } from '@angular/core';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { AccountLogin } from '../../core/services/account-login/account-login.model';
import { AccountLoginService } from '../../core/services/account-login/account-login.service';
import { ApiService } from '../../core/services/api.service';
import { Customer } from '../../models/customer/customer.model';

@Injectable()
export class CustomerRegistrationService {

  constructor(
    private accountLoginService: AccountLoginService,
    private apiService: ApiService,
  ) { }

  /**
    * Creates the User and saves the User details
    * @param  {} userDetails
    */
  registerPrivateCustomer(newCustomer: Customer): Observable<Customer> {
    if (!newCustomer) {
      return null;
    }
    // determine user credentials for login
    const accountLogin = new (AccountLogin);
    accountLogin.userName = newCustomer.credentials.login;
    accountLogin.password = newCustomer.credentials.password;

    return this.apiService.post<Customer>('customers', newCustomer)
      .flatMap((data) => this.accountLoginService.singinUser(accountLogin));
  }
}
