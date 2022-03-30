import { SimpleChange } from '@angular/core';

import { CallParameters } from 'ish-core/models/call-parameters/call-parameters.model';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';

export interface CMSComponent {
  pagelet: ContentPageletView;
  callParameters?: CallParameters;
  ngOnChanges?(changes?: { pagelet: SimpleChange }): void;
}
