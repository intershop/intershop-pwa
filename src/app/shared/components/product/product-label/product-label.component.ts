import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

/**
 * The Product Label Component renders a label for a product with label information, i.a. new, sale or topseller.
 *
 * @example
 * <ish-product-label [product]="product"></ish-product-label>
 */
@Component({
  selector: 'ish-product-label',
  templateUrl: './product-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductLabelComponent implements OnInit {
  productLabel$: Observable<string>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.productLabel$ = this.context.select('label');
  }
}
