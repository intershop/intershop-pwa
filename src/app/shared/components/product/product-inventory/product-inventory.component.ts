import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-inventory',
  templateUrl: './product-inventory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInventoryComponent implements OnInit {
  visible$: Observable<boolean>;
  available$: Observable<boolean>;
  availableStock$: Observable<number>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'inventory');
    this.available$ = this.context.select('inventory', 'inStock');
    this.availableStock$ = this.context
      .select('inventory', 'availableStock')
      .pipe(map(stock => (stock > 0 ? stock : 0)));
  }
}
