import { RxState } from '@rx-angular/state';

import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';

interface ProductListingContext extends ProductListingID {
  fragmentOnRouting: string;
}

export class ProductListingContextFacade extends RxState<ProductListingContext> {}
