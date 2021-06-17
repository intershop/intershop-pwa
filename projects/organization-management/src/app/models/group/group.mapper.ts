import { Injectable } from '@angular/core';

import { Customer } from 'ish-core/models/customer/customer.model';

import { ResourceIdentifierData } from '../resource-identifier/resource-identifier.interface';

import { GroupHelper } from './group.helper';
import { GroupData, GroupDocument, GroupListDocument } from './group.interface';
import { Group, GroupTree } from './group.model';

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

  fromDocument(groupList: GroupListDocument): GroupTree {
    if (groupList) {
      return groupList.data
        .sort((a, b) => GroupHelper.rootsFirst(a, b))
        .map(groupData => this.fromData(groupData))
        .reduce((a, b) => GroupHelper.merge(a, b), GroupHelper.empty());
    } else {
      throw new Error(`groupDocument is required`);
    }
  }

  fromDataReversed(groupData: GroupData): GroupTree {
    if (groupData && groupData.relationships?.parentGroup?.data) {
      const parent = groupData.relationships.parentGroup;
      const parentTree = this.toGroupTree(this.fromResourceId(parent.data));
      parentTree.edges = { ...this.fromData(groupData).edges };
      parentTree.edges[parent.data.id] = [groupData.id];
      parentTree.groups[groupData.id] = this.fromSingleData(groupData);
      return parentTree;
    } else if (groupData) {
      return this.toGroupTree(groupData);
    } else {
      throw new Error('groupData is required');
    }
  }

  fromData(groupData: GroupData): GroupTree {
    if (groupData) {
      let subTree: GroupTree;
      if (groupData.relationships.childGroups?.data) {
        subTree = groupData.relationships.childGroups.data
          .map(id => this.fromResourceId(id, groupData))
          .map(data => this.fromData(data))
          .reduce((a, b) => GroupHelper.merge(a, b), GroupHelper.empty());
      } else {
        subTree = GroupHelper.empty();
      }
      const tree = this.toGroupTree(groupData);
      return GroupHelper.merge(tree, subTree);
    } else {
      throw new Error(`groupData is required`);
    }
  }

  fromResourceId(groupResource: ResourceIdentifierData, parent?: GroupData): GroupData {
    if (groupResource?.id) {
      return {
        id: groupResource.id,
        attributes: { name: undefined },
        relationships: {
          organization: parent?.relationships?.organization ?? { data: { id: 'unknown' } },
          parentGroup: parent ? { data: { id: parent.id } } : undefined,
        },
      };
    } else {
      throw new Error(`groupResourceIdentifier is required`);
    }
  }

  fromSingleData(groupData: GroupData): Group {
    if (groupData) {
      return {
        id: groupData.id,
        name: groupData.attributes.name,
        description: groupData.attributes.description,
        organization: groupData.relationships.organization.data.id,
      };
    } else {
      throw new Error(`groupData is required`);
    }
  }

  toGroupTree(group: GroupData): GroupTree {
    if (group) {
      const parent = group.relationships.parentGroup ?? { data: undefined };
      const childGroups = group.relationships.childGroups?.data ?? [];
      const edges = !childGroups.length
        ? {}
        : {
            [group.id]: childGroups.map((value: ResourceIdentifierData) => value.id),
          };
      const groups = {
        [group.id]: { ...this.fromSingleData(group) },
      };
      const rootIds = !parent.data ? [group.id] : [];
      return {
        edges,
        groups,
        rootIds,
      };
    } else {
      throw new Error('falsy input');
    }
  }

  toGroupDocument(child: Group, parent?: Group): GroupDocument {
    const childGroupData = this.toGroupData(child, parent);
    return {
      data: childGroupData,
    };
  }

  toGroupData(data: Group, parentData?: Group): GroupData {
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
    if (parentData) {
      groupData.relationships.parentGroup = {
        data: {
          id: parentData.id,
        },
      };
    }

    return groupData;
  }
}
