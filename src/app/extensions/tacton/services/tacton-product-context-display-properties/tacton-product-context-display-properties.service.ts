import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ExternalDisplayPropertiesProvider,
  ProductContextDisplayProperties,
} from 'ish-core/facades/product-context.facade';
import { AnyProductViewType } from 'ish-core/models/product/product.model';

@Injectable()
export class TactonProductContextDisplayPropertiesService implements ExternalDisplayPropertiesProvider {
  setup(product$: Observable<AnyProductViewType>): Observable<Partial<ProductContextDisplayProperties<false>>> {
    return product$.pipe(
      map(product =>
        product?.type === 'TactonProduct'
          ? {
              addToBasket: false,
              addToCompare: false,
              addToOrderTemplate: false,
              addToQuote: false,
              addToWishlist: false,
              price: false,
              inventory: false,
              quantity: false,
              shipment: false,
              variations: false,
              promotions: false,
            }
          : {}
      )
    );
  }
}
