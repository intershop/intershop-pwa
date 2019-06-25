import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductRetailSet } from 'ish-core/models/product/product-retail-set.model';

type DisplayType = 'tile' | 'row';

@Component({
  selector: 'ish-retail-set-parts',
  templateUrl: './retail-set-parts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetailSetPartsComponent {
  @Input() product: ProductRetailSet;
  /**
   * The Display Type of the product item, 'tile' - the default - or 'row'.
   */
  @Input() displayType?: DisplayType = 'row';
}
