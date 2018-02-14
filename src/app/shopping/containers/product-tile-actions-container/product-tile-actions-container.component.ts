import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Product } from '../../../models/product/product.model';
import * as fromStore from '../../store';
import * as compareListActions from '../../store/actions/compare-list.actions';
import * as compareListSelectors from '../../store/selectors/compare-list.selectors';

@Component({
  selector: 'ish-product-tile-actions-container',
  templateUrl: './product-tile-actions-container.component.html',
})
export class ProductTileActionsContainerComponent implements OnInit {

  @Input() product: Product;
  isInCompareList$: Store<boolean>;

  constructor(private store: Store<fromStore.ShoppingState>) { }

  ngOnInit() {
    this.isInCompareList$ = this.store.select(
      compareListSelectors.isInCompareList(this.product.sku)
    );
  }

  toggleCompare() {
    this.store.dispatch(new compareListActions.ToggleCompare(this.product.sku));
  }
}
