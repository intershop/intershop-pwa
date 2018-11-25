import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import { AddProductToBasket } from 'ish-core/store/checkout/basket';
import { getSelectedCategory } from 'ish-core/store/shopping/categories';
import { AddToCompare } from 'ish-core/store/shopping/compare';
import { getProductLoading, getSelectedProduct } from 'ish-core/store/shopping/products';
import { getUserAuthorized } from 'ish-core/store/user';
import { ProductAddToQuoteDialogContainerComponent } from '../../extensions/quoting/shared/product/containers/product-add-to-quote-dialog/product-add-to-quote-dialog.container';
import { AddProductToQuoteRequest } from '../../extensions/quoting/store/quote-request';

@Component({
  selector: 'ish-product-page-container',
  templateUrl: './product-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageContainerComponent {
  product$ = this.store.pipe(select(getSelectedProduct));
  category$ = this.store.pipe(select(getSelectedCategory));
  productLoading$ = this.store.pipe(select(getProductLoading));

  constructor(private ngbModal: NgbModal, private store: Store<{}>) {}

  addToBasket({ sku, quantity }) {
    this.store.dispatch(new AddProductToBasket({ sku, quantity }));
  }

  addToCompare(sku) {
    this.store.dispatch(new AddToCompare(sku));
  }

  addToQuote({ sku, quantity }) {
    this.store.dispatch(new AddProductToQuoteRequest({ sku, quantity }));
    this.store
      .pipe(
        select(getUserAuthorized),
        take(1),
        filter(b => b)
      )
      .subscribe(() => {
        this.ngbModal.open(ProductAddToQuoteDialogContainerComponent, { size: 'lg' });
      });
  }
}
