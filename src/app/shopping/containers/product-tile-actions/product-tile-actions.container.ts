import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Product } from '../../../models/product/product.model';
import { isInCompareList, ShoppingState, ToggleCompare } from '../../store/compare-list';

@Component({
  selector: 'ish-product-tile-actions-container',
  templateUrl: './product-tile-actions.container.html',
})
export class ProductTileActionsContainerComponent implements OnInit {

  @Input() product: Product;
  isInCompareList$: Store<boolean>;

  constructor(private store: Store<ShoppingState>) { }

  ngOnInit() {
    this.isInCompareList$ = this.store.select(
      isInCompareList(this.product.sku)
    );
  }

  toggleCompare() {
    this.store.dispatch(new ToggleCompare(this.product.sku));
  }
}
