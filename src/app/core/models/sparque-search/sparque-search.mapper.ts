import { Injectable } from '@angular/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { SearchResponse } from 'ish-core/models/search/search.model';
import { SparqueMapper } from 'ish-core/models/sparque/sparque.mapper';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { FixedFacetGroupResult, SparqueSearchResponse, SparqueSortingOptionResponse } from './sparque-search.interface';

@Injectable({ providedIn: 'root' })
export class SparqueSearchMapper {
  constructor(private sparqueMapper: SparqueMapper) {}

  fromData(search: SparqueSearchResponse, searchParameter: URLFormParams): SearchResponse {
    return {
      products: this.sparqueMapper.mapProducts(search.products),
      sortableAttributes: this.mapSortableAttributes(search.sortings),
      total: search.total,
      filter: this.mapFilter(search.facets, searchParameter),
    };
  }

  private mapSortableAttributes(sortableAttributes: SparqueSortingOptionResponse[]): SortableAttributesType[] {
    return sortableAttributes
      ? sortableAttributes.map(sortings => ({
          name: sortings.identifier,
          displayName: sortings.title,
        }))
      : [];
  }

  private mapFilter(filter: FixedFacetGroupResult[], searchParameter: URLFormParams): Filter[] {
    return filter.map(facetGroup => {
      const facets: Facet[] = facetGroup.options.map(facet => ({
        name: facet.id ? facet.id : facet.value,
        displayName: facet.value,
        count: facet.score,
        selected: searchParameter[facetGroup.id]?.includes(facet.id),
        level: 0,
        searchParameter: calculateSearchParams(
          searchParameter,
          searchParameter[facetGroup.id]?.includes(facet.id),
          facetGroup.id,
          facet.id
        ),
      }));
      return {
        name: facetGroup.title,
        displayType: 'text_clear',
        id: facetGroup.id,
        facets,
        selectionType: 'single',
        limitCount: 5,
      };
    });
  }
}

function calculateSearchParams(
  currentSearchParams: URLFormParams,
  isSelected: boolean,
  facetGroupId: string,
  facetId: string
): URLFormParams {
  if (isSelected) {
    return Object.fromEntries(Object.entries(currentSearchParams).filter(([, value]) => !value.includes(facetId)));
  }
  return {
    ...currentSearchParams,
    [facetGroupId]: [facetId],
  };
}
