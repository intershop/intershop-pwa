import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-attributes',
  templateUrl: './product-attributes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAttributesComponent {
  @Input() product: ProductView;
  @Input() multipleValuesSeparator = ', ';
}
