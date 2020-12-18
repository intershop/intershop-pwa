import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { UserMapper } from 'ish-core/models/user/user.mapper';

import { B2bUserData, B2bUserDataLink } from './b2b-user.interface';
import { B2bUser } from './b2b-user.model';

export class B2bUserMapper {
  static fromData(user: B2bUserData): B2bUser {
    return { ...UserMapper.fromData(user), active: user.active };
  }

  static fromListData(data: B2bUserDataLink[]): B2bUser[] {
    if (data) {
      return data.map(e => ({
        login: e.login,
        firstName: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'firstName'),
        lastName: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'lastName'),
        roleIDs: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'roleIDs'),
        active: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'active'),
        userBudget: {
          orderSpentLimit: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'orderSpentLimit'),
          budget: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'budget'),
          remainingBudget: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'remainingBudget'),
          budgetPeriod: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'budgetPeriod'),
          spentBudget: AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'spentBudget') || {
            ...AttributeHelper.getAttributeValueByAttributeName(e.attributes, 'budget'),
            value: 0,
          },
        },
      }));
    } else {
      throw new Error('data is required');
    }
  }
}
