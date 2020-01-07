import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-lazy-product-add-to-wishlist',
  templateUrl: './lazy-product-add-to-wishlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyProductAddToWishlistComponent {
  @Input() product: Product;
  @Input() displayType?: string;
  componentLocation = {
    moduleId: 'ish-extensions-wishlists',
    selector: 'ish-product-add-to-wishlist',
  };
}
