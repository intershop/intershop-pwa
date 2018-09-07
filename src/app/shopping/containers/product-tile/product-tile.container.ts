import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { AddProductToBasket } from '../../../checkout/store/basket';
import { getUserAuthorized } from '../../../core/store/user';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';
import { ProductAddToQuoteDialogContainerComponent } from '../../../quoting/containers/product-add-to-quote-dialog/product-add-to-quote-dialog.container';
import { AddProductToQuoteRequest } from '../../../quoting/store/quote-request';
import { ToggleCompare, isInCompareProducts } from '../../store/compare';
import { LoadProduct, getProduct } from '../../store/products';

@Component({
  selector: 'ish-product-tile-container',
  templateUrl: './product-tile.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTileContainerComponent implements OnInit {
  @Input()
  productSku: string;
  @Input()
  category?: Category;

  product$: Observable<Product>;
  isInCompareList$: Observable<boolean>;

  constructor(private store: Store<{}>, private ngbModal: NgbModal) {}

  ngOnInit() {
    this.product$ = this.store.pipe(select(getProduct, { sku: this.productSku }));
    // Checks if the product is already in the store and only dispatches a LoadProduct action if it is not
    this.product$
      .pipe(
        take(1),
        filter(x => !x)
      )
      .subscribe(() => this.store.dispatch(new LoadProduct(this.productSku)));
    this.isInCompareList$ = this.store.pipe(select(isInCompareProducts(this.productSku)));
  }

  toggleCompare() {
    this.store.dispatch(new ToggleCompare(this.productSku));
  }

  addToBasket() {
    this.product$
      .pipe(take(1))
      .subscribe(product =>
        this.store.dispatch(new AddProductToBasket({ sku: product.sku, quantity: product.minOrderQuantity }))
      );
  }

  addToQuote() {
    this.product$
      .pipe(take(1))
      .subscribe(product =>
        this.store.dispatch(new AddProductToQuoteRequest({ sku: product.sku, quantity: product.minOrderQuantity }))
      );
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
