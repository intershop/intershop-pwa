import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-row',
  templateUrl: './product-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRowComponent implements OnInit {
  product$: Observable<ProductView>;
  quantity$: Observable<number>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.quantity$ = this.context.select('quantity');
  }

  configuration$(key: keyof ProductContextDisplayProperties) {
    return this.context.select('displayProperties', key);
  }
}
