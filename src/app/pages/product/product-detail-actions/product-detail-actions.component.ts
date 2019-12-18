import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Product, ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-detail-actions',
  templateUrl: './product-detail-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailActionsComponent {
  @Input() product: Product;
  @Input() currentUrl: string;
  @Output() productToCompare = new EventEmitter<void>();

  // TODO: to be removed once channelName inforamtion available in system
  channelName = 'inTRONICS';

  isMasterProduct = ProductHelper.isMasterProduct;

  addToCompare() {
    this.productToCompare.emit();
  }
}
