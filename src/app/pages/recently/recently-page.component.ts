import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AllProductTypes } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-recently-page',
  templateUrl: './recently-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyPageComponent implements OnInit {
  products$: Observable<AllProductTypes>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.products$ = this.shoppingFacade.recentlyViewedProducts$;
  }

  clearAll() {
    this.shoppingFacade.clearRecentlyViewedProducts();
  }
}
