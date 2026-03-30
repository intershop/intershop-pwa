import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, map, shareReplay, startWith } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SupplierStock } from 'ish-core/models/product-inventory/product-inventory.model';

enum StockCategory {
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
}

@Component({
  selector: 'ish-product-inventory',
  templateUrl: './product-inventory.component.html',
  styleUrls: ['./product-inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInventoryComponent implements OnInit {
  @Input() displayType: 'default' | 'extended' = 'default';

  visible$: Observable<boolean>;
  available$: Observable<boolean>;
  availableStock$: Observable<number>;
  supplierStock$: Observable<SupplierStock[]>;

  constructor(private context: ProductContextFacade) {}

  private stockThresholds = [
    { limit: 100, category: StockCategory.Success, text: 'available' },
    { limit: 50, category: StockCategory.Warning, text: 'limited availability' },
    { limit: 0, category: StockCategory.Danger, text: 'low stock' },
  ];

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'inventory');
    this.available$ = this.context.select('inventory', 'inStock').pipe(startWith(true), shareReplay(1));
    this.availableStock$ = this.context
      .select('inventory', 'availableStock')
      .pipe(map(stock => (stock > 0 ? stock : 0)));
    if (this.displayType === 'extended') {
      this.supplierStock$ = this.context
        .select('inventory', 'supplierStock')
        .pipe(map(stocks => [...stocks].sort((a, b) => a.displayName.localeCompare(b.displayName))));
    }
  }

  private getStockCategory(count: number): { category: StockCategory; text: string } {
    for (const threshold of this.stockThresholds) {
      if (count > threshold.limit) {
        return { category: threshold.category, text: threshold.text };
      }
    }
    return { category: StockCategory.Danger, text: 'unknown' }; // Fallback
  }

  getStockStyling(count: number): string {
    return this.getStockCategory(count).category;
  }

  getStockText(count: number): string {
    const { text } = this.getStockCategory(count);
    return `${text} (${count.toString()})`;
  }
}
