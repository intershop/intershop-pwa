import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-tile',
  templateUrl: './product-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTileComponent implements OnInit {
  product$: Observable<ProductView>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  configuration$(key: keyof ProductContextDisplayProperties) {
    return this.context.select('displayProperties', key);
  }
}
