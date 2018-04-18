import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { LoginCredentials } from '../../../models/credentials/credentials.model';
import { Customer } from '../../../models/customer/customer.model';

@Injectable()
export class RegistrationService {
  constructor(private apiService: ApiService) {}

  signinUser(loginCredentials: LoginCredentials): Observable<Customer> {
    const headers = new HttpHeaders().set(
      'Authorization',
      'BASIC ' + Buffer.from(loginCredentials.login + ':' + loginCredentials.password).toString('base64')
    );
    return this.apiService.get<Customer>('customers/-', null, headers);
  }

  createUser(newCustomer: Customer): Observable<Customer> {
    return this.apiService.post<Customer>('customers', newCustomer).pipe(
      // TODO:see #IS-22750 - user should actually be logged in after registration
      switchMap(() => this.signinUser(newCustomer.credentials))
    );
  }
}
