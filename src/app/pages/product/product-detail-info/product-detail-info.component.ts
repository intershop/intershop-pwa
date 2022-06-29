import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-detail-info',
  templateUrl: './product-detail-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailInfoComponent implements OnInit {
  product$: Observable<ProductView>;
  isVariationMaster$: Observable<boolean>;
  active = 'DESCRIPTION';

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.isVariationMaster$ = this.context.select('variationCount').pipe(map(variationCount => !!variationCount));
  }

  configuration$(key: keyof ProductContextDisplayProperties) {
    return this.context.select('displayProperties', key);
  }
}
