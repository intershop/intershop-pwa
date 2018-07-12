import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AddProductToBasket } from '../../../checkout/store/basket';
import { CheckoutState } from '../../../checkout/store/checkout.state';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';
import { AddProductToQuoteRequest } from '../../../quoting/store/quote-request';
import { QuotingState } from '../../../quoting/store/quoting.state';

@Component({
  selector: 'ish-product-row-container',
  templateUrl: './product-row.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRowContainerComponent {
  @Input() product: Product;
  @Input() category?: Category;

  constructor(private store: Store<CheckoutState | QuotingState>) {}

  addToBasket() {
    this.store.dispatch(new AddProductToBasket({ sku: this.product.sku, quantity: this.product.minOrderQuantity }));
  }

  addToQuote() {
    this.store.dispatch(
      new AddProductToQuoteRequest({ sku: this.product.sku, quantity: this.product.minOrderQuantity })
    );
  }
}
