import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, map, shareReplay, startWith } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SupplierStock } from 'ish-core/models/product-inventory/product-inventory.model';

enum StockLevel {
  high = 100,
  medium = 50,
  low = 1,
}

@Component({
  selector: 'ish-product-inventory',
  templateUrl: './product-inventory.component.html',
  styleUrls: ['./product-inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, TranslatePipe, NgClass],
})
export class ProductInventoryComponent implements OnInit {
  @Input() displayType: 'default' | 'extended' = 'default';

  visible$: Observable<boolean>;
  available$: Observable<boolean>;
  availableStock$: Observable<number>;
  supplierStock$: Observable<SupplierStock[]>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'inventory');
    this.available$ = this.context.select('inventory', 'inStock').pipe(startWith(true), shareReplay(1));
    this.availableStock$ = this.context
      .select('inventory', 'availableStock')
      .pipe(map(stock => (stock > 0 ? stock : 0)));
    if (this.displayType === 'extended') {
      this.supplierStock$ = this.context
        .select('inventory', 'supplierStock')
        .pipe(map(stocks => [...(stocks ?? [])].sort((a, b) => a.displayName.localeCompare(b.displayName))));
    }
  }

  getStockLevel(count?: number): string {
    return count >= StockLevel.high
      ? 'high'
      : count >= StockLevel.medium
        ? 'medium'
        : count >= StockLevel.low
          ? 'low'
          : 'none';
  }
}
