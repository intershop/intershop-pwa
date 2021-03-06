import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { AnyProductViewType } from 'ish-core/models/product/product.helper';

@Component({
  selector: 'ish-product-variation-display',
  templateUrl: './product-variation-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariationDisplayComponent implements OnInit {
  product$: Observable<AnyProductViewType>;
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.visible$ = this.context.select('displayProperties', 'variations');
  }
}
