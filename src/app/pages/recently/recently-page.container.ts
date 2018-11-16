import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { ClearRecently, getRecentlyViewedProducts } from 'ish-core/store/shopping/recently';

@Component({
  selector: 'ish-recently-page-container',
  templateUrl: './recently-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyPageContainerComponent {
  products$ = this.store.pipe(select(getRecentlyViewedProducts));

  constructor(private store: Store<{}>) {}

  clearAll() {
    this.store.dispatch(new ClearRecently());
  }
}
