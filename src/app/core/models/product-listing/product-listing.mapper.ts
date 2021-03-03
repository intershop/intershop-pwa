import { Inject, Injectable } from '@angular/core';
import { range } from 'lodash-es';

import { PRODUCT_LISTING_ITEMS_PER_PAGE } from 'ish-core/configurations/injection-keys';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { ProductListingType, SortableAttributesType } from './product-listing.model';

@Injectable({ providedIn: 'root' })
export class ProductListingMapper {
  constructor(@Inject(PRODUCT_LISTING_ITEMS_PER_PAGE) private itemsPerPage: number) {}

  createPages(
    skus: string[],
    productListingType: string,
    productListingValue: string,
    extras?: {
      startPage?: number;
      sortableAttributes?: SortableAttributesType[];
      itemCount?: number;
      sorting?: string;
      filters?: URLFormParams;
    }
  ): ProductListingType {
    const pages = range(0, Math.ceil(skus.length / this.itemsPerPage)).map(n =>
      skus.slice(n * this.itemsPerPage, (n + 1) * this.itemsPerPage)
    );
    const startPage = (extras && extras.startPage) || 1;
    const view: ProductListingType = {
      id: {
        type: productListingType,
        value: productListingValue,
      },
      itemCount: extras?.itemCount || skus.length,
      sortableAttributes: extras?.sortableAttributes || [],
      ...pages.reduce((acc, val, idx) => ({ ...acc, [idx + startPage]: val }), {}),
    };

    if (extras?.sorting) {
      view.id.sorting = extras.sorting;
    }

    if (extras?.filters) {
      view.id.filters = extras.filters;
    }

    return view;
  }
}
