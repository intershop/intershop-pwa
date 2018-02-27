import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-recently-viewed-all',
  templateUrl: './recently-viewed-all.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentlyViewedAllComponent {

  @Input() products: Product[];
  @Output() clearRecently = new EventEmitter<void>();

  clearAll() {
    this.clearRecently.emit();
  }

}
