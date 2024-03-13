import { OrganizationGroupData } from './organization-group.interface';

export class OrganizationGroupHelper {
  static rootsFirst(a: OrganizationGroupData, b: OrganizationGroupData): number {
    if (a.relationships.parentGroup && !b.relationships.parentGroup) {
      return -1;
    }
    if (!a.relationships.parentGroup && b.relationships.parentGroup) {
      return 1;
    }
    if (!a.relationships.parentGroup && !b.relationships.parentGroup) {
      return 0;
    }
    if (a.relationships.parentGroup && b.relationships.parentGroup) {
      return 0;
    }
  }
}
