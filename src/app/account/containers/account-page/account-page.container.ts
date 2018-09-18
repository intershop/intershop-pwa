import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getBreadcrumbData } from '../../../core/store/viewconf';

@Component({
  templateUrl: './account-page.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountPageContainerComponent {
  breadcrumbData$ = this.store.pipe(select(getBreadcrumbData));

  constructor(private store: Store<{}>) {}
}
