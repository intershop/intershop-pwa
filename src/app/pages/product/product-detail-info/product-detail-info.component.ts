import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, map } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.helper';

@Component({
  selector: 'ish-product-detail-info',
  standalone: false,
  templateUrl: './product-detail-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailInfoComponent implements OnInit {
  product$: Observable<ProductView>;
  isVariationMaster$: Observable<boolean>;
  hasFaqs$: Observable<boolean>;
  hasHowTo$: Observable<boolean>;
  active = 'DESCRIPTION'; // default product tab

  private destroyRef = inject(DestroyRef);
  private context = inject(ProductContextFacade);

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.isVariationMaster$ = this.context.select('product').pipe(map(ProductHelper.isMasterProduct));

    this.hasFaqs$ = this.context.select('product').pipe(
      map(product => {
        const attr = product.attributeGroups?.GEO?.attributes?.find(a => a.name === 'GEO_FAQ');
        return !!attr?.value;
      })
    );

    this.hasHowTo$ = this.context.select('product').pipe(
      map(product => {
        const attr = product.attributeGroups?.GEO?.attributes?.find(a => a.name === 'GEO_HOW_TO');
        return !!attr?.value;
      })
    );

    // when routing between products reset the opened product tab to the default tab
    this.context
      .select('sku')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => (this.active = 'DESCRIPTION'));
  }
}
