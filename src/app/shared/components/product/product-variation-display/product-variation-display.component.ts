import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { VariationAttributePipe } from 'ish-core/pipes/variation-attribute.pipe';

@Component({
  selector: 'ish-product-variation-display',
  templateUrl: './product-variation-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ AsyncPipe, VariationAttributePipe],
})
export class ProductVariationDisplayComponent implements OnInit {
  product$: Observable<ProductView>;
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.visible$ = this.context.select('displayProperties', 'variations');
  }
}
