import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AllProductTypes } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-recently-page-container',
  templateUrl: './recently-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyPageContainerComponent implements OnInit {
  products$: Observable<AllProductTypes>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.products$ = this.shoppingFacade.recentlyViewedProducts$;
  }

  clearAll() {
    this.shoppingFacade.clearRecentlyViewedProducts();
  }
}
