import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

import { RecentlyFacade } from '../../facades/recently.facade';

@Component({
  selector: 'ish-recently-page',
  templateUrl: './recently-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyPageComponent implements OnInit {
  products$: Observable<string[]>;

  constructor(private recentlyFacade: RecentlyFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.products$ = this.shoppingFacade.excludeFailedProducts$(this.recentlyFacade.recentlyViewedProducts$);
  }

  clearAll() {
    this.recentlyFacade.clearRecentlyViewedProducts();
  }
}
