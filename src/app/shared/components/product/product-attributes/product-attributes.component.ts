import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AnyProductViewType } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-attributes',
  templateUrl: './product-attributes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAttributesComponent {
  @Input() product: AnyProductViewType;
  @Input() multipleValuesSeparator = ', ';
}
