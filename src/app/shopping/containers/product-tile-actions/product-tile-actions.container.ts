import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../../models/product/product.model';
import { isInCompareProducts, ToggleCompare } from '../../store/compare';
import { ShoppingState } from '../../store/shopping.state';

@Component({
  selector: 'ish-product-tile-actions-container',
  templateUrl: './product-tile-actions.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductTileActionsContainerComponent implements OnInit {

  @Input() product: Product;
  isInCompareList$: Observable<boolean>;

  constructor(
    private store: Store<ShoppingState>
  ) { }

  ngOnInit() {
    this.isInCompareList$ = this.store.pipe(
      select(isInCompareProducts(this.product.sku))
    );
  }

  toggleCompare() {
    this.store.dispatch(new ToggleCompare(this.product.sku));
  }

  addToCart() {
    console.log('[ProductTileActionsContainer] Add ' + this.product.name + ' to Cart');
  }

}
