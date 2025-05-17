import { Filter } from 'ish-core/models/filter/filter.model';
import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { Product } from 'ish-core/models/product/product.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

export interface SearchParameter {
  searchTerm: string;
  amount: number;
  offset: number;
  sortKey?: string;
  sorting?: string;
  searchParameter?: URLFormParams;
}

export interface SearchResponse {
  products: Partial<Product>[];
  total: number;
  sortableAttributes?: SortableAttributesType[];
  filter?: Filter[];
}
