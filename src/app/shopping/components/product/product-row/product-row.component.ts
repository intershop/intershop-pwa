
// NEEDS_WORK: product listing components rework
import { Component, Inject, Input, ViewChild } from '@angular/core';
import { CartStatusService } from '../../../../core/services/cart-status/cart-status.service';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { Product } from '../../../../models/product.model';
import { DisableIconDirective } from '../../../directives/disable-icon.directive';

@Component({
  selector: 'ish-product-row',
  templateUrl: './product-row.component.html',
})

export class ProductRowComponent {
  @Input() product: Product;
  @ViewChild(DisableIconDirective) disableIconDirective: DisableIconDirective = null;

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
}
