import { GroupData as GroupData } from './group.interface';

export class GroupHelper {
  static rootsFirst(a: GroupData, b: GroupData): number {
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
