import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppFacade } from 'ish-core/facades/app.facade';

@Component({
  selector: 'ish-header-search',
  templateUrl: './header-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderSearchComponent {
  constructor(private appFacade: AppFacade) {}

  closeSearchOverlay() {
    this.appFacade.setInstantSearch(false);
  }
}
