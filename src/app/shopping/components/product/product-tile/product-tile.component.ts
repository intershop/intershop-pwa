// NEEDS_WORK: product listing components rework
import { Component, Inject, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountLoginService } from '../../../../core/services/account-login/account-login.service';
import { CartStatusService } from '../../../../core/services/cart-status/cart-status.service';
import { ProductCompareService } from '../../../../core/services/product-compare/product-compare.service';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { WishlistsService } from '../../../../core/services/wishlists/wishlists.service';
import { Product } from '../../../../models/product.model';
import { DisableIconDirective } from '../../../directives/disable-icon.directive';

@Component({
  selector: 'ish-product-tile',
  templateUrl: './product-tile.component.html',
})

export class ProductTileComponent {
  @Input() product: Product;
  @ViewChild(DisableIconDirective) disableIconDirective: DisableIconDirective = null;

  constructor(
    private accountLoginService: AccountLoginService,
    private wishlistsService: WishlistsService,
    private productCompareService: ProductCompareService,
    private cartStatusService: CartStatusService,
    private router: Router,
    @Inject(ICM_BASE_URL) public icmBaseURL
  ) { }

  /**
   * Adds product to cart
   */
  addToCart(): void {
    this.cartStatusService.addSKU(this.product.sku);
  }

  /**
   * Adds product to wishlist
   */
  addToWishlist(): void {
    if (!this.accountLoginService.isAuthorized()) {
      this.router.navigate(['/login']);
    } else {
      this.wishlistsService.update();
    }
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
