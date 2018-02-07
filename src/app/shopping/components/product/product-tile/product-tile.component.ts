// NEEDS_WORK: product listing components rework
import { Component, Inject, Input, ViewChild } from '@angular/core';
import { CartStatusService } from '../../../../core/services/cart-status/cart-status.service';
import { ProductCompareService } from '../../../../core/services/product-compare/product-compare.service';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { Product } from '../../../../models/product/product.model';
import { DisableIconDirective } from '../../../directives/disable-icon.directive';

@Component({
  selector: 'ish-product-tile',
  templateUrl: './product-tile.component.html'
})

export class ProductTileComponent {
  @Input() product: Product;
  @ViewChild(DisableIconDirective) disableIconDirective: DisableIconDirective = null;

  constructor(
    private productCompareService: ProductCompareService,
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
  addToCompare(): void {
    if (this.productCompareService.containsSKU(this.product.sku)) {
      this.productCompareService.removeSKU(this.product.sku);
    } else {
      this.productCompareService.addSKU(this.product.sku);
    }
  }
}
