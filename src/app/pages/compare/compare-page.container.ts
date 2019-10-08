import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AllProductTypes } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-compare-page-container',
  templateUrl: './compare-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparePageContainerComponent implements OnInit {
  compareProducts$: Observable<AllProductTypes[]>;
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
