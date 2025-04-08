import { Filter } from 'ish-core/models/filter/filter.model';
import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { Product } from 'ish-core/models/product/product.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

export interface SearchResponse {
  products: Partial<Product>[];
  sortableAttributes?: SortableAttributesType[];
  total: number;
  filter?: Filter[];
  prices?: ProductPriceDetails[];
}

export interface SearchParameter {
  searchTerm: string;
  offset: number;
  searchParameter?: URLFormParams;
  sortKey?: string;
  sorting?: string;
  amount: number;
  page?: number;
  facetOptionsCount?: number;
}
