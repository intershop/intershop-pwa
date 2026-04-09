import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-attributes',
  templateUrl: './product-attributes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SlicePipe, AttributeToStringPipe],
})
export class ProductAttributesComponent {
  @Input({ required: true }) product: ProductView;
  @Input() multipleValuesSeparator = ', ';
}
