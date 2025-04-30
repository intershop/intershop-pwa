import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { SparqueProduct } from 'ish-core/models/sparque-product/sparque-product.interface';

/**
 * Interface for Sparque Search API response object
 */
export interface SparqueSearchResponse {
  products?: SparqueProduct[];
  total?: number;
  facets?: FixedFacetGroupResult[];
  sortings: SparqueSortingOptionResponse[];
}

export interface FixedFacetGroupResult {
  id: string;
  title: string;
  options: FixedFacetOption[];
  attributes?: Attribute[];
}

interface FixedFacetOption {
  id: string;
  identifier: string;
  score: number;
  value: string;
  childFacets?: string[];
}

export interface SparqueSortingOptionResponse {
  identifier: string;
  title: string;
}
