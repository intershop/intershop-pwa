import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { VariationProductMasterView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-master-variations',
  templateUrl: './product-master-variations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductMasterVariationsComponent {
  @Input() product: VariationProductMasterView;
  @Input() category: CategoryView;
}
