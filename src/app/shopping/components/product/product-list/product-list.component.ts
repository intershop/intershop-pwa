// NEEDS_WORK: product listing components rework - service usage not compliant to style guide
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '../../../../models/product/product.model';
import { ViewMode } from '../../../../models/types';

@Component({
  selector: 'ish-product-list',
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {

  @Input() viewMode: ViewMode;
  @Input() products: Product[];

}
