import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppFacade } from 'ish-core/facades/app.facade';

@Component({
  selector: 'ish-instantsearch-close',
  templateUrl: './instantsearch-close.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstantsearchCloseComponent {
  constructor(private appFacade: AppFacade) {}

  closeInstantSearchOverlay() {
    this.appFacade.setInstantSearch(false);
  }
}
