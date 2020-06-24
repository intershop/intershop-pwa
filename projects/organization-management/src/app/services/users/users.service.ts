import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserMapper } from 'ish-core/models/user/user.mapper';
import { User } from 'ish-core/models/user/user.model';
import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets all users of a customer. The current user is supposed to have administrator rights.
   * @returns               All users of the customer.
   */
  getUsers(): Observable<User[]> {
    return this.apiService.get(`customers/-/users`).pipe(map(UserMapper.fromListData));
  }

  /**
   * Gets the data of a b2b user. The current user is supposed to have administrator rights.
   * @param login  The login of the user.
   * @returns      The user.
   */
  getUser(login: string): Observable<User> {
    return this.apiService.get(`customers/-/users/${login}`).pipe(map(UserMapper.fromData));
  }
}
