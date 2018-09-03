import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { AddProductToBasket } from '../../../checkout/store/basket';
import { getUserAuthorized } from '../../../core/store/user';
import { CategoryView } from '../../../models/category-view/category-view.model';
import { Product } from '../../../models/product/product.model';
import { ProductAddToQuoteDialogContainerComponent } from '../../../quoting/containers/product-add-to-quote-dialog/product-add-to-quote-dialog.container';
import { AddProductToQuoteRequest } from '../../../quoting/store/quote-request';
import { getSelectedCategory } from '../../store/categories';
import { AddToCompare } from '../../store/compare';
import { getProductLoading, getSelectedProduct } from '../../store/products';

@Component({
  selector: 'ish-product-page-container',
  templateUrl: './product-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageContainerComponent implements OnInit {
  product$: Observable<Product>;
  productLoading$: Observable<boolean>;
  category$: Observable<CategoryView>;

  constructor(private ngbModal: NgbModal, private store: Store<{}>) {}

  ngOnInit() {
    this.product$ = this.store.pipe(select(getSelectedProduct), filter(product => !!product));
    this.category$ = this.store.pipe(select(getSelectedCategory), filter(category => !!category));
    this.productLoading$ = this.store.pipe(select(getProductLoading));
  }

  addToBasket({ sku, quantity }) {
    this.store.dispatch(new AddProductToBasket({ sku: sku, quantity: quantity }));
  }

  addToCompare(sku) {
    this.store.dispatch(new AddToCompare(sku));
  }

  addToQuote({ sku, quantity }) {
    this.store.dispatch(new AddProductToQuoteRequest({ sku: sku, quantity: quantity }));
    this.store.pipe(select(getUserAuthorized), take(1), filter(b => b)).subscribe(() => {
      this.ngbModal.open(ProductAddToQuoteDialogContainerComponent, { size: 'lg' });
    });
  }
}
