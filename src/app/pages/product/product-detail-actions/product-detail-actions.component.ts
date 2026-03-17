import { AsyncPipe, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ProductSendToCompareComponent } from '../../../extensions/compare/shared/product-send-to-compare/product-send-to-compare.component';
import { ProductAddToWishlistComponent } from '../../../extensions/wishlists/shared/product-add-to-wishlist/product-add-to-wishlist.component';

import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { FEATURE_TOGGLE_IMPORTS } from 'ish-core/feature-toggle';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-detail-actions',
  templateUrl: './product-detail-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ...FEATURE_TOGGLE_IMPORTS,
    ProductAddToWishlistComponent,
    ProductSendToCompareComponent,
    AsyncPipe,
    TranslatePipe],
})
export class ProductDetailActionsComponent implements OnInit {
  // TODO: to be removed once channelName information available in system
  channelName = 'inTRONICS';

  product$: Observable<ProductView>;

  constructor(@Inject(DOCUMENT) public document: Document, private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  configuration$(key: keyof ProductContextDisplayProperties) {
    return this.context.select('displayProperties', key);
  }
}

