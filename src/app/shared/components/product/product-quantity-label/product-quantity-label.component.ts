import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-quantity-label',
  templateUrl: './product-quantity-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductQuantityLabelComponent implements OnInit {
  @Input() for = '';
  @Input() translationKey = 'product.quantity.label';

  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'quantity');
  }
}
