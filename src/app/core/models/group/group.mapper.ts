import { Injectable } from '@angular/core';

import { GroupData } from './group.interface';
import { Group } from './group.model';

@Injectable({ providedIn: 'root' })
export class GroupMapper {
  fromData(groupData: GroupData): Group {
    if (groupData) {
      return {
        groupId: groupData.groupId,
        groupName: groupData.groupName,
      };
    } else {
      throw new Error(`groupData is required`);
    }
  }
}
