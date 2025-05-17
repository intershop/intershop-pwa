import { Injectable } from '@angular/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { SearchResponse } from 'ish-core/models/search/search.model';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { SparqueFixedFacetGroup, SparqueSearch, SparqueSortingOption } from './sparque-search.interface';

@Injectable({ providedIn: 'root' })
export class SparqueSearchMapper {
  constructor(private sparqueProductMapper: SparqueProductMapper) {}

  fromData(search: SparqueSearch, searchParameter: URLFormParams): SearchResponse {
    return {
      products: this.sparqueProductMapper.fromListData(search.products),
      total: search.total,
      sortableAttributes: this.mapSortableAttributes(search.sortings),
      filter: this.mapFilter(search.facets, searchParameter),
    };
  }

  private mapSortableAttributes(sortingOptions: SparqueSortingOption[]): SortableAttributesType[] {
    return sortingOptions
      ? sortingOptions.map(sorting => ({
          name: sorting.identifier,
          displayName: sorting.title,
        }))
      : undefined;
  }

  private mapFilter(filter: SparqueFixedFacetGroup[], searchParameter: URLFormParams): Filter[] {
    return filter
      ? filter.map(facetGroup => {
          const facets: Facet[] = facetGroup.options.map(facet => ({
            name: facet.id ? facet.id : facet.value,
            displayName: facet.value,
            count: facet.score,
            selected: searchParameter[facetGroup.id] ? searchParameter[facetGroup.id]?.includes(facet.id) : false,
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
        })
      : undefined;
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
