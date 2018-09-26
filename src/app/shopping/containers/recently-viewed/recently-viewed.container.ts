import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getMostRecentlyViewedProducts } from '../../store/recently';

@Component({
  selector: 'ish-recently-viewed-container',
  templateUrl: './recently-viewed.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyViewedContainerComponent {
  recentlyProducts$ = this.store.pipe(select(getMostRecentlyViewedProducts));

  constructor(private store: Store<{}>) {}
}
