import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-recently-viewed-all',
  templateUrl: './recently-viewed-all.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentlyViewedAllComponent {

  @Input() products: Product[];

  clearAll() {
    console.log('Browsing History should be cleared');
  }

}
