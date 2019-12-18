import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

@Component({
  selector: 'ish-product-compare-status',
  templateUrl: './product-compare-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCompareStatusComponent implements OnInit {
  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  productCompareCount$: Observable<number>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.productCompareCount$ = this.shoppingFacade.compareProductsCount$;
  }
}
