import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, map, shareReplay, startWith } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-inventory',
  templateUrl: './product-inventory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ AsyncPipe, TranslatePipe],
})
export class ProductInventoryComponent implements OnInit {
  visible$: Observable<boolean>;
  available$: Observable<boolean>;
  availableStock$: Observable<number>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'inventory');
    this.available$ = this.context.select('inventory', 'inStock').pipe(startWith(true), shareReplay(1));
    this.availableStock$ = this.context
      .select('inventory', 'availableStock')
      .pipe(map(stock => (stock > 0 ? stock : 0)));
  }
}
