import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';

import { B2bUserDataLink } from './b2b-user.interface';
import { B2bUser } from './b2b-user.model';

export class B2bUserMapper {
  static fromListData(data: B2bUserDataLink[]): B2bUser[] {
    if (data) {
      return data.map(e => ({
        login: e.login,
        firstName: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'firstName'),
        lastName: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'lastName'),
        active: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'active'),
        roleIDs: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'roleIDs'),
        businessPartnerNo: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'businessPartnerNo'),
      }));
    } else {
      throw new Error('data is required');
    }
  }
}
