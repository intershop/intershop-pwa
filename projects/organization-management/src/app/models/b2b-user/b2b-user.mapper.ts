import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { UserData } from 'ish-core/models/user/user.interface';
import { UserMapper } from 'ish-core/models/user/user.mapper';

import { B2bUserData } from './b2b-user.interface';
import { B2bUser } from './b2b-user.model';

export class B2bUserMapper {
  static fromData(user: UserData): B2bUser {
    return UserMapper.fromData(user);
  }

  static fromListData(data: B2bUserData[]): B2bUser[] {
    if (data) {
      return data.map(e => ({
        name: e.name,
        login: e.login,
        roleIDs: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'roles'),
      }));
    } else {
      throw new Error('data is required');
    }
  }
}
