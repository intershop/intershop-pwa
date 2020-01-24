import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-bundle-display',
  templateUrl: './product-bundle-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductBundleDisplayComponent implements OnChanges, OnDestroy {
  @Input() productBundleSKU: string;

  productBundleParts$: Observable<{ product: Product; quantity: number }[]>;

  private destroy$ = new Subject();

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnDestroy() {
    this.destroy$.next();
  }

  ngOnChanges() {
    if (this.productBundleSKU) {
      this.productBundleParts$ = this.shoppingFacade
        .productBundleParts$(this.productBundleSKU)
        .pipe(takeUntil(this.destroy$));
    }
  }
}
