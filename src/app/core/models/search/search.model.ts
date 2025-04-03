import { Filter } from 'ish-core/models/filter/filter.model';
import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { Product } from 'ish-core/models/product/product.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

export interface SearchResponse {
  products: Product[];
  sortableAttributes?: SortableAttributesType[];
  total: number;
  filter?: Filter[];
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
