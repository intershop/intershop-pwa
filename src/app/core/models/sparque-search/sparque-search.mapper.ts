import { Injectable } from '@angular/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { SearchResponse } from 'ish-core/models/search/search.model';
import { SparqueOfferMapper } from 'ish-core/models/sparque-offer/sparque-offer.mapper';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { FixedFacetGroupResult, SparqueSearchResponse, SparqueSortingOptionResponse } from './sparque-search.interface';

@Injectable({ providedIn: 'root' })
export class SparqueSearchMapper {
  constructor(private sparqueProductMapper: SparqueProductMapper, private sparqueOfferMapper: SparqueOfferMapper) {}

  fromData(search: SparqueSearchResponse, searchParameter: URLFormParams): SearchResponse {
    return {
      products: this.sparqueProductMapper.mapProducts(search.products),
      sortableAttributes: this.mapSortableAttributes(search.sortings),
      total: search.total,
      filter: this.mapFilter(search.facets, searchParameter),
      prices: this.sparqueOfferMapper.mapOffers(search.products),
    };
  }

  private mapSortableAttributes(sortableAttributes: SparqueSortingOptionResponse[]): SortableAttributesType[] {
    return sortableAttributes
      ? sortableAttributes.map(sorting => ({
          name: sorting.identifier,
          displayName: sorting.title,
        }))
      : [];
  }

  private mapFilter(filter: FixedFacetGroupResult[], searchParameter: URLFormParams): Filter[] {
    return filter.map(facetGroup => {
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
        limitCount: 10,
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
