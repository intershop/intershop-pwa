import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { B2bState } from '../../../b2b/store/b2b.state';
import { AddProductToQuoteRequest } from '../../../b2b/store/quote-request';
import { AddProductToBasket } from '../../../checkout/store/basket';
import { CheckoutState } from '../../../checkout/store/checkout.state';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';
import { isInCompareProducts, ToggleCompare } from '../../store/compare';
import { ShoppingState } from '../../store/shopping.state';

@Component({
  selector: 'ish-product-tile-container',
  templateUrl: './product-tile.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTileContainerComponent implements OnInit {
  @Input() product: Product;
  @Input() category?: Category;

  isInCompareList$: Observable<boolean>;

  constructor(private store: Store<ShoppingState | CheckoutState | B2bState>) {}

  ngOnInit() {
    this.isInCompareList$ = this.store.pipe(select(isInCompareProducts(this.product.sku)));
  }

  toggleCompare() {
    this.store.dispatch(new ToggleCompare(this.product.sku));
  }

  addToBasket() {
    this.store.dispatch(new AddProductToBasket({ sku: this.product.sku, quantity: this.product.minOrderQuantity }));
  }

  addToQuote() {
    this.store.dispatch(
      new AddProductToQuoteRequest({ sku: this.product.sku, quantity: this.product.minOrderQuantity })
    );
  }
}
