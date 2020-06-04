import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';

import { Product, ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-detail-actions',
  templateUrl: './product-detail-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailActionsComponent {
  @Input() product: Product;
  @Output() productToCompare = new EventEmitter<void>();

  /**
   * TODO: to be removed once channelName inforamtion available in system
   */
  channelName = 'inTRONICS';

  isMasterProduct = ProductHelper.isMasterProduct;

  addToCompare() {
    this.productToCompare.emit();
  }

  constructor(@Inject(DOCUMENT) public document: Document) {}
}
