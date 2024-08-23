import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ExternalDisplayPropertiesProvider,
  ProductContext,
  ProductContextDisplayProperties,
} from 'ish-core/facades/product-context.facade';
import { ProductHelper } from 'ish-core/models/product/product.helper';

@Injectable({ providedIn: 'root' })
export class ProductContextDisplayPropertiesService implements ExternalDisplayPropertiesProvider {
  setup(
    context$: Observable<Pick<ProductContext, 'product' | 'prices'>>
  ): Observable<Partial<ProductContextDisplayProperties<false>>> {
    return context$.pipe(
      map(({ product, prices }) => {
        const canBeOrdered = !ProductHelper.isMasterProduct(product) && product?.available;
        const canBeOrderedWithPrice = canBeOrdered && (!!prices?.salePrice || ProductHelper.isRetailSet(product));
        const canBeOrderedNotRetail = canBeOrdered && !ProductHelper.isRetailSet(product);

        const calc = {
          inventory: !ProductHelper.isRetailSet(product) && !ProductHelper.isMasterProduct(product),
          quantity: canBeOrderedNotRetail,
          variations: ProductHelper.isVariationProduct(product),
          bundleParts: ProductHelper.isProductBundle(product),
          retailSetParts: ProductHelper.isRetailSet(product),
          shipment:
            canBeOrderedNotRetail &&
            Number.isInteger(product?.readyForShipmentMin) &&
            Number.isInteger(product?.readyForShipmentMax),
          addToBasket: canBeOrderedWithPrice,
          addToWishlist: !ProductHelper.isMasterProduct(product),
          addToOrderTemplate: canBeOrdered,
          addToCompare: !ProductHelper.isMasterProduct(product),
          addToQuote: canBeOrdered,
          addToNotification: !ProductHelper.isRetailSet(product) && !ProductHelper.isMasterProduct(product),
        };

        return (
          Object.entries(calc)
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
            .filter(([, v]) => v === false)
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v as false }), {})
        );
      })
    );
  }
}
