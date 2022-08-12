import { Pipe, PipeTransform } from '@angular/core';

import { ContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';

import { generateContentPageUrl } from './content-page.route';

@Pipe({ name: 'ishContentPageRoute', pure: true })
export class ContentPageRoutePipe implements PipeTransform {
  transform(page: ContentPageTreeView): string {
    return generateContentPageUrl(page);
  }
}
