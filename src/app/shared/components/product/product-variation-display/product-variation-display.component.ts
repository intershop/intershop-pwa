import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { VariationProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-variation-display',
  templateUrl: './product-variation-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariationDisplayComponent {
  @Input() product: VariationProductView;
}
