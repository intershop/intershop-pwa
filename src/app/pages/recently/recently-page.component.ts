import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

@Component({
  selector: 'ish-recently-page',
  templateUrl: './recently-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyPageComponent implements OnInit {
  products$: Observable<string[]>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.products$ = this.shoppingFacade.recentlyViewedProducts$;
  }

  clearAll() {
    this.shoppingFacade.clearRecentlyViewedProducts();
  }
}
