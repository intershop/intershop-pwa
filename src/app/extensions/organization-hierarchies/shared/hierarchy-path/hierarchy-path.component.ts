import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Order } from 'ish-core/models/order/order.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

@Component({
  selector: 'ish-hierarchy-path',
  templateUrl: './hierarchy-path.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class HierarchyPathComponent {
  @Input() object: Basket | Order;
}
