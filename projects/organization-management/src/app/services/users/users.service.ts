import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Link } from 'ish-core/models/link/link.model';
import { UserData } from 'ish-core/models/user/user.interface';
import { UserMapper } from 'ish-core/models/user/user.mapper';
import { ApiService, resolveLinks, unpackEnvelope } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private apiService: ApiService) {}

  getUsers() {
    return this.apiService.get(`customers/-/users`).pipe(
      unpackEnvelope<Link>(),
      resolveLinks<UserData>(this.apiService),
      map(users => users.map(UserMapper.fromData))
    );
  }

  getUser(login: string) {
    return this.apiService.get(`customers/-/users/${login}`).pipe(map(UserMapper.fromData));
  }
}
