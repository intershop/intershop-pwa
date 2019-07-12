import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-bundle-display',
  templateUrl: './product-bundle-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductBundleDisplayComponent {
  @Input() productBundleParts: { product: ProductView; quantity: number }[];
}
