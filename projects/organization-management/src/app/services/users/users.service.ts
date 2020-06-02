import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Customer } from 'ish-core/models/customer/customer.model';
import { Link } from 'ish-core/models/link/link.model';
import { UserRoleData } from 'ish-core/models/user-role/user-role.interface';
import { UserRoleMapper } from 'ish-core/models/user-role/user-role.mapper';
import { UserRole } from 'ish-core/models/user-role/user-role.model';
import { UserData } from 'ish-core/models/user/user.interface';
import { UserMapper } from 'ish-core/models/user/user.mapper';
import { ApiService, resolveLinks, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/user';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private loggedInCustomer: Customer;

  constructor(private apiService: ApiService, store: Store) {
    store.pipe(select(getLoggedInCustomer)).subscribe(x => (this.loggedInCustomer = x));
  }

  getUsers() {
    return this.apiService.get(`customers/${this.loggedInCustomer.customerNo}/users`).pipe(
      unpackEnvelope<Link>(),
      resolveLinks<UserData>(this.apiService),
      map(users => users.map(UserMapper.fromData))
    );
  }

  getUserRoles(userid: string): Observable<UserRole[]> {
    return this.apiService
      .get<{ userRoles: UserRoleData[] }>(`customers/${this.loggedInCustomer.customerNo}/users/${userid}/roles`)
      .pipe(
        map(response => response.userRoles),
        map(userRoles => userRoles.map(UserRoleMapper.fromData))
      );
  }
}
