import { Injectable } from '@angular/core';

import { OrganizationHierarchiesGroupHelper } from './organization-hierarchies-group.helper';
import {
  OrganizationHierarchiesGroupData,
  OrganizationHierarchiesGroupDocument,
  OrganizationHierarchiesGroupListDocument,
} from './organization-hierarchies-group.interface';
import { OrganizationHierarchiesGroup } from './organization-hierarchies-group.model';

@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesGroupMapper {
  static fromDocument(groupList: OrganizationHierarchiesGroupListDocument): OrganizationHierarchiesGroup[] {
    const tree: OrganizationHierarchiesGroup[] = [];
    if (groupList) {
      groupList.data.forEach(groupData => {
        OrganizationHierarchiesGroupMapper.fromData(groupData, tree);
      });
    } else {
      throw new Error(`groupDocument is required`);
    }
    return tree.length > 0 ? OrganizationHierarchiesGroupHelper.resolveTreeAttributes(tree, undefined) : tree;
  }

  static fromData(
    groupData: OrganizationHierarchiesGroupData,
    tree: OrganizationHierarchiesGroup[]
  ): OrganizationHierarchiesGroup[] {
    if (groupData) {
      tree.push(OrganizationHierarchiesGroupMapper.resolveAttributes(groupData));
      return tree;
    } else {
      throw new Error(`groupData is required`);
    }
  }

  private static resolveAttributes(group: OrganizationHierarchiesGroupData): OrganizationHierarchiesGroup {
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

  static toGroupDocument(
    child: OrganizationHierarchiesGroup,
    parentGroupId?: string
  ): OrganizationHierarchiesGroupDocument {
    const childGroupData = OrganizationHierarchiesGroupMapper.toGroupData(child, parentGroupId);
    return {
      data: childGroupData,
    };
  }

  static toGroupData(data: OrganizationHierarchiesGroup, parentGroupId?: string): OrganizationHierarchiesGroupData {
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

  static fromDataReversed(groupData: OrganizationHierarchiesGroupData): OrganizationHierarchiesGroup {
    if (groupData) {
      return OrganizationHierarchiesGroupMapper.resolveAttributes(groupData);
    } else {
      throw new Error('groupData is required');
    }
  }
}
