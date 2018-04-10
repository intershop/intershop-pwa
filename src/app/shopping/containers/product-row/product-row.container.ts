import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AddItemToBasket } from '../../../checkout/store/basket';
import { CheckoutState } from '../../../checkout/store/checkout.state';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';

@Component({
  selector: 'ish-product-row-container',
  templateUrl: './product-row.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRowContainerComponent {
  @Input() product: Product;
  @Input() category?: Category;

  constructor(
    private store: Store<CheckoutState>
  ) { }

  addToCart() {
    this.store.dispatch(new AddItemToBasket({ sku: this.product.sku, quanity: this.product.minOrderQuantity }));
  }
}
