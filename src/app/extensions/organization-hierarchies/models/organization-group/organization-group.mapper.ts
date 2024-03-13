import { Injectable } from '@angular/core';

import { Customer } from 'ish-core/models/customer/customer.model';

import { OrganizationGroupHelper } from './organization-group.helper';
import {
  OrganizationGroupData,
  OrganizationGroupDocument,
  OrganizationGroupListDocument,
} from './organization-group.interface';
import { OrganizationGroup } from './organization-group.model';

@Injectable({ providedIn: 'root' })
export class OrganizationGroupMapper {
  fromCustomerData(customer: Customer): OrganizationGroup {
    return {
      id: customer.customerNo,
      name: customer.companyName ?? customer.customerNo,
      organization: customer.customerNo,
      description: customer.description,
    };
  }

  fromDocument(groupList: OrganizationGroupListDocument): OrganizationGroup[] {
    const tree: OrganizationGroup[] = [];
    if (groupList) {
      groupList.data
        .sort((a, b) => OrganizationGroupHelper.rootsFirst(a, b))
        .forEach(groupData => this.fromData(groupData, tree));
    } else {
      throw new Error(`groupDocument is required`);
    }
    return tree;
  }

  fromData(groupData: OrganizationGroupData, tree: OrganizationGroup[]): OrganizationGroup[] {
    if (groupData) {
      tree.push(this.resolveAttributes(groupData));
      return tree;
    } else {
      throw new Error(`groupData is required`);
    }
  }

  resolveAttributes(group: OrganizationGroupData): OrganizationGroup {
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

  toGroupDocument(child: OrganizationGroup, parentGroupId?: string): OrganizationGroupDocument {
    const childGroupData = this.toGroupData(child, parentGroupId);
    return {
      data: childGroupData,
    };
  }

  toGroupData(data: OrganizationGroup, parentGroupId?: string): OrganizationGroupData {
    if (!data) {
      throw new Error('Group data is mandatory');
    }

    const groupData: OrganizationGroupData = {
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

  fromDataReversed(groupData: OrganizationGroupData): OrganizationGroup {
    if (groupData) {
      return this.resolveAttributes(groupData);
    } else {
      throw new Error('groupData is required');
    }
  }

  //fromData(organizationGroupData: OrganizationGroupData): OrganizationGroup {
  //  if (organizationGroupData) {
  //    return {
  //      id: organizationGroupData.id,
  //      name: organizationGroupData.attributes.name,
  //      parentid: organizationGroupData.relationships.parentGroup?.data?.id,
  //    };
  //  } else {
  //    throw new Error(`organizationGroupData is required`);
  //  }
  //}
}
