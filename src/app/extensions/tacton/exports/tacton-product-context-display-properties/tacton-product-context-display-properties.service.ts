import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ExternalDisplayPropertiesProvider,
  ProductContext,
  ProductContextDisplayProperties,
} from 'ish-core/facades/product-context.facade';

@Injectable()
export class TactonProductContextDisplayPropertiesService implements ExternalDisplayPropertiesProvider {
  setup(
    context$: Observable<Pick<ProductContext, 'product' | 'prices'>>
  ): Observable<Partial<ProductContextDisplayProperties<false>>> {
    return context$.pipe(
      map(({ product }) =>
        product?.type === 'TactonProduct'
          ? {
              addToBasket: false,
              addToCompare: false,
              addToNotification: false,
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
