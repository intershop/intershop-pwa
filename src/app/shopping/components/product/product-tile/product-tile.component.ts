// NEEDS_WORK: product listing components rework
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CartStatusService } from '../../../../core/services/cart-status/cart-status.service';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-tile',
  templateUrl: './product-tile.component.html'
})

export class ProductTileComponent {
  @Input() product: Product;
  @Output() compareToggle = new EventEmitter<string>();

  constructor(
    private cartStatusService: CartStatusService,
    @Inject(ICM_BASE_URL) public icmBaseURL
  ) { }

  /**
   * Adds product to cart
   */
  addToCart(): void {
    this.cartStatusService.addSKU(this.product.sku);
  }

  /**
   * Adds product to comparison
   */
  toggleCompare() {
    this.compareToggle.emit(this.product.sku);
  }
}
