import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-return-request-product-info',
  templateUrl: './return-request-product-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnRequestProductInfoComponent {
  @Input() sku: string;

  getAttribute(product: ProductView, name: string) {
    return product.attributes.find(attr => attr.name === name) ?? 'N/A';
  }
}
