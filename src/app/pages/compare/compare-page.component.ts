import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-compare-page',
  templateUrl: './compare-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparePageComponent implements OnInit {
  compareProducts$: Observable<ProductView[]>;
  compareProductsCount$: Observable<number>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.compareProducts$ = this.shoppingFacade.compareProducts$;
    this.compareProductsCount$ = this.shoppingFacade.compareProductsCount$;
  }

  addToBasket({ sku, quantity }) {
    this.shoppingFacade.addProductToBasket(sku, quantity);
  }

  removeFromCompare(sku: string) {
    this.shoppingFacade.removeProductFromCompare(sku);
  }
}
