import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ExternalDisplayPropertiesProvider,
  ProductContextDisplayProperties,
} from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.helper';

@Injectable({ providedIn: 'root' })
export class ProductContextDisplayPropertiesService implements ExternalDisplayPropertiesProvider {
  setup(product$: Observable<ProductView>): Observable<Partial<ProductContextDisplayProperties<false>>> {
    return product$.pipe(
      map(product => {
        const canBeOrdered = !ProductHelper.isMasterProduct(product) && product.available;

        const canBeOrderedNotRetail = canBeOrdered && !ProductHelper.isRetailSet(product);

        const calc = {
          inventory: !ProductHelper.isRetailSet(product) && !ProductHelper.isMasterProduct(product),
          quantity: canBeOrderedNotRetail,
          variations: ProductHelper.isVariationProduct(product),
          bundleParts: ProductHelper.isProductBundle(product),
          retailSetParts: ProductHelper.isRetailSet(product),
          shipment:
            canBeOrderedNotRetail &&
            Number.isInteger(product.readyForShipmentMin) &&
            Number.isInteger(product.readyForShipmentMax),
          addToBasket: canBeOrdered,
          addToWishlist: !ProductHelper.isMasterProduct(product),
          addToOrderTemplate: canBeOrdered,
          addToCompare: !ProductHelper.isMasterProduct(product),
          addToQuote: canBeOrdered,
        };

        return (
          Object.entries(calc)
            // tslint:disable-next-line: no-boolean-literal-compare
            .filter(([, v]) => v === false)
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v as false }), {})
        );
      })
    );
  }
}
