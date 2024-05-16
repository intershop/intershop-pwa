import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-item-variations',
  templateUrl: './product-item-variations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemVariationsComponent implements OnInit {
  visible$: Observable<boolean>;
  readOnly$: Observable<boolean>;
  variationCount$: Observable<number>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'variations');
    this.readOnly$ = this.context.select('displayProperties', 'readOnly');
    this.variationCount$ = this.context.select('variationCount');
  }
}
