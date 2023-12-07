import { Injectable } from '@angular/core';

import { Customer } from 'ish-core/models/customer/customer.model';

import { GroupHelper } from './group.helper';
import { GroupData, GroupDocument, GroupListDocument } from './group.interface';
import { Group } from './group.model';

@Injectable({ providedIn: 'root' })
export class GroupMapper {
  fromCustomerData(customer: Customer): Group {
    return {
      id: customer.customerNo,
      name: customer.companyName ?? customer.customerNo,
      organization: customer.customerNo,
      description: customer.description,
    };
  }

  fromDocument(groupList: GroupListDocument): Group[] {
    const tree: Group[] = [];
    if (groupList) {
      groupList.data.sort((a, b) => GroupHelper.rootsFirst(a, b)).forEach(groupData => this.fromData(groupData, tree));
    } else {
      throw new Error(`groupDocument is required`);
    }
    return tree;
  }

  fromDataReversed(groupData: GroupData): Group {
    if (groupData) {
      return this.resolveAttributes(groupData);
    } else {
      throw new Error('groupData is required');
    }
  }

  fromData(groupData: GroupData, tree: Group[]): Group[] {
    if (groupData) {
      tree.push(this.resolveAttributes(groupData));
      return tree;
    } else {
      throw new Error(`groupData is required`);
    }
  }

  resolveAttributes(group: GroupData): Group {
    const relationship = group.relationships;
    return {
      id: group.id,
      name: group.attributes.name,
      description: group.attributes.description,
      organization: relationship?.organization?.data.id,
      childrenIds: relationship?.childGroups?.data.map(entry => entry.id),
      parentId: relationship?.parentGroup?.data?.id,
    };
  }

  toGroupDocument(child: Group, parentGroupId?: string): GroupDocument {
    const childGroupData = this.toGroupData(child, parentGroupId);
    return {
      data: childGroupData,
    };
  }

  toGroupData(data: Group, parentGroupId?: string): GroupData {
    if (!data) {
      throw new Error('Group data is mandatory');
    }

    const groupData: GroupData = {
      attributes: {
        name: data.name,
        description: data.description,
      },
      id: data.id,
      relationships: {
        organization: {
          data: {
            id: data.organization,
          },
        },
      },
    };
    if (parentGroupId) {
      groupData.relationships.parentGroup = {
        data: {
          id: parentGroupId,
        },
      };
    }

    return groupData;
  }
}
