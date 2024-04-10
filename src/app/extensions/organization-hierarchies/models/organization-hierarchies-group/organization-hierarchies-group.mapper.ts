import { Injectable } from '@angular/core';

import { Customer } from 'ish-core/models/customer/customer.model';

import { OrganizationHierarchiesGroupHelper } from './organization-hierarchies-group.helper';
import {
  OrganizationHierarchiesGroupData,
  OrganizationHierarchiesGroupDocument,
  OrganizationHierarchiesGroupListDocument,
} from './organization-hierarchies-group.interface';
import { OrganizationHierarchiesGroup } from './organization-hierarchies-group.model';

@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesGroupMapper {
  fromCustomerData(customer: Customer): OrganizationHierarchiesGroup {
    return {
      id: customer.customerNo,
      displayName: customer.companyName ?? customer.customerNo,
      organization: customer.customerNo,
      description: customer.description,
    };
  }

  fromDocument(groupList: OrganizationHierarchiesGroupListDocument): OrganizationHierarchiesGroup[] {
    const tree: OrganizationHierarchiesGroup[] = [];
    if (groupList) {
      groupList.data.forEach(groupData => {
        this.fromData(groupData, tree);
      });
    } else {
      throw new Error(`groupDocument is required`);
    }
    return tree.length > 0 ? OrganizationHierarchiesGroupHelper.resolveTreeAttributes(tree, undefined) : tree;
  }

  fromData(
    groupData: OrganizationHierarchiesGroupData,
    tree: OrganizationHierarchiesGroup[]
  ): OrganizationHierarchiesGroup[] {
    if (groupData) {
      tree.push(this.resolveAttributes(groupData));
      return tree;
    } else {
      throw new Error(`groupData is required`);
    }
  }

  resolveAttributes(group: OrganizationHierarchiesGroupData): OrganizationHierarchiesGroup {
    const relationship = group.relationships;
    return {
      id: group.id,
      displayName: group.attributes.name,
      description: group.attributes.description,
      organization: relationship?.organization?.data.id,
      childrenIds: relationship?.childGroups?.data.map(entry => entry.id),
      parentId: relationship?.parentGroup?.data?.id,
      expandable: relationship?.childGroups?.data.length > 0 ? true : false,
      level: relationship?.parentGroup?.data?.id ? undefined : 0,
    };
  }

  toGroupDocument(child: OrganizationHierarchiesGroup, parentGroupId?: string): OrganizationHierarchiesGroupDocument {
    const childGroupData = this.toGroupData(child, parentGroupId);
    return {
      data: childGroupData,
    };
  }

  toGroupData(data: OrganizationHierarchiesGroup, parentGroupId?: string): OrganizationHierarchiesGroupData {
    if (!data) {
      throw new Error('Group data is mandatory');
    }

    const groupData: OrganizationHierarchiesGroupData = {
      attributes: {
        name: data.displayName,
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

  fromDataReversed(groupData: OrganizationHierarchiesGroupData): OrganizationHierarchiesGroup {
    if (groupData) {
      return this.resolveAttributes(groupData);
    } else {
      throw new Error('groupData is required');
    }
  }
}
