import { SparqueAttribute, SparqueProduct } from 'ish-core/models/sparque/sparque.interface';

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
  attributes?: SparqueAttribute[];
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
