import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

/**
 * The Product Item Component renders the product either as 'tile' or 'row'.
 * The 'tile' rendering is the default if no value is provided for the displayType.
 */
@Component({
  selector: 'ish-product-item',
  templateUrl: './product-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemComponent implements OnInit {
  @Input() displayType: 'tile' | 'row' = 'tile';

  product$: Observable<ProductView>;
  loading$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.loading$ = this.context.select('loading');
  }

  get isTile() {
    return this.displayType === 'tile';
  }

  get isRow() {
    return !this.isTile;
  }
}
