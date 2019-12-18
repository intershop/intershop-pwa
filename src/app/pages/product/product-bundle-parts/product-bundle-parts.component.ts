import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ProductBundle } from 'ish-core/models/product/product-bundle.model';

@Component({
  selector: 'ish-product-bundle-parts',
  templateUrl: './product-bundle-parts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductBundlePartsComponent {
  @Input() product: ProductBundle;

  @Output() productToBasket = new EventEmitter();
}
