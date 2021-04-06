import { Injectable } from '@angular/core';

import { ContentPageletTreeData } from './content-pagelet-tree.interface';

@Injectable({ providedIn: 'root' })
export class ContentPageletTreeMapper {
  /**
   * Converts {@link ContentPageletTreeData} to the model entity {@link ContentPageletTree}.
   */
  fromData(data: ContentPageletTreeData): ContentPageletTreeData {
    if (!data) {
      throw new Error('falsy input');
    }

    return data;
  }
}
