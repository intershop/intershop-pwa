import { SimpleChange } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';

export interface CMSComponent {
  pagelet: ContentPageletView;
  ngOnChanges?(changes?: { pagelet: SimpleChange }): void;
}
