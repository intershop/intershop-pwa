import { SimpleChange } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';

export interface CMSComponent {
  pagelet: ContentPageletView;
  ngOnChanges?(changes?: { pagelet: SimpleChange }): void;
}
