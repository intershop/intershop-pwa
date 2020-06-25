import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from 'ish-core/services/api/api.service';

import { B2bUserMapper } from '../../models/b2b-user/b2b-user.mapper';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets all users of a customer. The current user is supposed to have administrator rights.
   * @returns               All users of the customer.
   */
  getUsers(): Observable<B2bUser[]> {
    return this.apiService.get(`customers/-/users`).pipe(map(B2bUserMapper.fromListData));
  }

  /**
   * Gets the data of a b2b user. The current user is supposed to have administrator rights.
   * @param login  The login of the user.
   * @returns      The user.
   */
  getUser(login: string): Observable<B2bUser> {
    return this.apiService.get(`customers/-/users/${login}`).pipe(map(B2bUserMapper.fromData));
  }
}
