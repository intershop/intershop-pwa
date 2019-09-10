import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Product } from 'ish-core/models/product/product.model';
import { getProductBundleParts } from 'ish-core/store/shopping/products';

@Component({
  selector: 'ish-product-bundle-display-container',
  templateUrl: './product-bundle-display.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductBundleDisplayContainerComponent implements OnChanges, OnDestroy {
  @Input() productBundleSKU: string;

  productBundleParts$: Observable<{ product: Product; quantity: number }[]>;

  private destroy$ = new Subject();

  constructor(private store: Store<{}>) {}

  ngOnDestroy() {
    this.destroy$.next();
  }

  ngOnChanges() {
    if (this.productBundleSKU) {
      this.productBundleParts$ = this.store.pipe(
        select(getProductBundleParts, { sku: this.productBundleSKU }),
        takeUntil(this.destroy$)
      );
    }
  }
}
