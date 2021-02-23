import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-brand',
  templateUrl: './product-brand.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductBrandComponent implements OnInit {
  manufacturer$: Observable<string>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.manufacturer$ = this.context.select('product', 'manufacturer');
  }
}
