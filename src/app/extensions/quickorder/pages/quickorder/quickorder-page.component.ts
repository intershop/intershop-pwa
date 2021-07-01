import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

@Component({
  selector: 'ish-quickorder-page',
  templateUrl: './quickorder-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderPageComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor(private shoppingFacade: ShoppingFacade, private checkoutFacade: CheckoutFacade) {}

  ngOnInit(): void {
    this.loading$ = this.checkoutFacade.basketLoading$;
  }

  addProductsToBasket(products: { sku: string; quantity: number }[]) {
    if (products.length > 0) {
      products.forEach(product => {
        this.shoppingFacade.addProductToBasket(product.sku, product.quantity);
      });
    }
  }
}
