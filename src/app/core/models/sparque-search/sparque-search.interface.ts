import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { SparqueProduct } from 'ish-core/models/sparque-product/sparque-product.interface';

/**
 * Interface for Sparque Search API response object
 */
export interface SparqueSearch {
  products?: SparqueProduct[];
  total?: number;
  sortings?: SparqueSortingOption[];
  facets?: SparqueFixedFacetGroup[];
}

export interface SparqueSortingOption {
  identifier: string;
  title: string;
}

export interface SparqueFixedFacetGroup {
  id: string;
  title: string;
  rank?: number;
  options: SparqueFixedFacetOption[];
  attributes?: Attribute[];
}

export interface SparqueFixedFacetOption {
  id: string;
  identifier: string;
  score: number;
  value: string;
  localizedNames?: { [key: string]: string };
  localizedValues?: { [key: string]: string };
  childFacets?: SparqueFixedFacetOption[];
}
