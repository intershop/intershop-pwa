import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { VariationProductMasterView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-master-variations',
  templateUrl: './product-master-variations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductMasterVariationsComponent implements OnInit {
  @Input() product: VariationProductMasterView;
  @Input() category: CategoryView;

  ngOnInit() {
    if (this.product) {
      console.log(this.product.variationAttributeValues);
    }
  }
}
