import { UserData } from 'ish-core/models/user/user.interface';
import { UserMapper } from 'ish-core/models/user/user.mapper';

import { B2bUser } from './b2b-user.model';

export class B2bUserMapper {
  static fromData(user: UserData): B2bUser {
    return UserMapper.fromData(user);
  }

  static fromListData(data: { elements: { name: string; login: string }[] }): B2bUser[] {
    return ((data?.elements || []).map(e => ({
      name: e.name,
      login: e.login,
    })) as unknown[]) as B2bUser[];
  }
}
