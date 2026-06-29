import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-attributes',
  imports: [AttributeToStringPipe, SlicePipe],
  standalone: true,
  templateUrl: './product-attributes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAttributesComponent {
  @Input({ required: true }) product: ProductView;
  @Input() multipleValuesSeparator = ', ';
}
