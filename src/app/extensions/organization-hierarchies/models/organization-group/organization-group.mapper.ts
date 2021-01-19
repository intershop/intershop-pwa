import { Injectable } from '@angular/core';

import { OrganizationGroupData } from './organization-group.interface';
import { OrganizationGroup } from './organization-group.model';

@Injectable({ providedIn: 'root' })
export class OrganizationGroupMapper {
  fromData(organizationGroupData: OrganizationGroupData): OrganizationGroup {
    if (organizationGroupData) {
      return {
        id: organizationGroupData.id,
        name: organizationGroupData.attributes.name,
        parentid: organizationGroupData.relationships.parentGroup?.data?.id,
      };
    } else {
      throw new Error(`organizationGroupData is required`);
    }
  }

  handleRoot(organizationGroup: OrganizationGroup, companyName: string): OrganizationGroup {
    return {
      ...organizationGroup,
      name: organizationGroup.parentid ? organizationGroup.name : companyName,
    };
  }
}
