import { OrganizationGroup } from './organization-group.model';

export class OrganizationGroupHelper {
  static equal(organizationGroup1: OrganizationGroup, organizationGroup2: OrganizationGroup): boolean {
    return !!organizationGroup1 && !!organizationGroup2 && organizationGroup1.id === organizationGroup2.id;
  }
}
