import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthorizationData } from 'ish-core/models/authorization/authorization.interface';
import { AuthorizationMapper } from 'ish-core/models/authorization/authorization.mapper';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { encodeResourceID } from 'ish-core/utils/url-resource-ids';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  constructor(private apiService: ApiService, private authorizationMapper: AuthorizationMapper) {}

  getRolesAndPermissions(customer: Customer, user: User) {
    if (!customer?.customerNo) {
      return throwError(() => new Error('getRolesAndPermissions() called without customer.customerNo'));
    }
    if (!user?.login) {
      return throwError(() => new Error('getRolesAndPermissions() called without user.login'));
    }

    return this.apiService
      .get<AuthorizationData>(`customers/${customer.customerNo}/users/${encodeResourceID(user.login)}/roles`)
      .pipe(map(data => this.authorizationMapper.fromData(data)));
  }
}
