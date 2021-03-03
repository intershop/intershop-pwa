import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { AnyProductViewType } from 'ish-core/models/product/product.helper';

@Component({
  selector: 'ish-product-detail-info-accordion',
  templateUrl: './product-detail-info-accordion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailInfoAccordionComponent implements OnInit {
  product$: Observable<AnyProductViewType>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  configuration$(key: keyof ProductContextDisplayProperties) {
    return this.context.select('displayProperties', key);
  }
}
