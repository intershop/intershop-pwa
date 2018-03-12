import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Product } from '../../../models/product/product.model';
import { AddToCompare } from '../../store/compare';
import { ShoppingState } from '../../store/shopping.state';

@Component({
  selector: 'ish-product-detail-actions-container',
  templateUrl: './product-detail-actions.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailActionsContainerComponent {
  @Input() product: Product;

  constructor(private store: Store<ShoppingState>) { }

  addToCompare() {
    this.store.dispatch(new AddToCompare(this.product.sku));
  }
}
