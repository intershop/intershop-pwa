import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppFacade } from 'ish-core/facades/app.facade';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { SearchResponse } from 'ish-core/models/search/search.model';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { SparqueSearchHelper } from './sparque-search.helper';
import { SparqueFixedFacetGroup, SparqueFixedFacetOption, SparqueSearch } from './sparque-search.interface';

@Injectable({ providedIn: 'root' })
export class SparqueSearchMapper {
  private currentLocale = 'en_US';
  private destroyRef = inject(DestroyRef);

  constructor(private sparqueProductMapper: SparqueProductMapper, private appFacade: AppFacade) {
    this.appFacade.currentLocale$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(locale => {
      this.currentLocale = locale.replace('_', '-');
    });
  }

  fromData(search: SparqueSearch, searchParameter?: URLFormParams): SearchResponse {
    return {
      products: this.sparqueProductMapper.fromListData(search.products),
      total: search.total,
      sortableAttributes: search.sortings
        ? search.sortings.map(sorting => ({
            name: sorting.identifier,
            displayName: sorting.title,
          }))
        : [],
      filter: searchParameter?.selectedCategory
        ? this.mapCategoryFilter(search.facets, searchParameter)
        : this.mapFilter(search.facets, searchParameter),
    };
  }

  private mapCategoryFilter(filter: SparqueFixedFacetGroup[], searchParameter: URLFormParams): Filter[] {
    const mappedFilters = filter
      ? [
          ...filter
            .filter(facetGroup => facetGroup.id !== 'category')
            .map(facetGroup => {
              const facets: Facet[] = facetGroup.options.map(facet => ({
                name: facet.id ? facet.id : facet.value,
                displayName: this.getLocalizedDisplayName(facet),
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
                displayType: SparqueSearchHelper.mapDisplayType(
                  AttributeHelper.getAttributeValueByAttributeName<string>(facetGroup.attributes, 'displayType')
                ),
                id: facetGroup.id,
                facets,
                selectionType: SparqueSearchHelper.mapSelectionType(
                  AttributeHelper.getAttributeValueByAttributeName<string>(facetGroup.attributes, 'selectionType')
                ),
                limitCount: 5,
              };
            }),
        ]
      : [];

    // Check if searchParameter has 'selectedCategory' key
    if (searchParameter?.selectedCategory) {
      const categoryValue = searchParameter.selectedCategory[0];
      const selectedCategoryFilter = {
        name: 'selectedCategory',
        displayType: 'text_clear',
        id: 'selectedCategory',
        facets: [
          {
            name: categoryValue,
            displayName: categoryValue,
            count: 0,
            selected: true,
            level: 0,
            searchParameter: calculateSearchParams(searchParameter, true, 'selectedCategory', categoryValue),
          },
        ],
        selectionType: 'single',
        limitCount: 5,
      };
      mappedFilters.push(selectedCategoryFilter);
    }

    return mappedFilters;
  }

  private mapFilter(filter: SparqueFixedFacetGroup[], searchParameter: URLFormParams): Filter[] {
    return filter
      ? filter.map(facetGroup => {
          const facets = this.resolveFacetOptionsRecursively(facetGroup.options, searchParameter, facetGroup.id);

          return {
            name: facetGroup.title,
            displayType: SparqueSearchHelper.mapDisplayType(
              AttributeHelper.getAttributeValueByAttributeName<string>(facetGroup.attributes, 'displayType')
            ),
            id: facetGroup.id === 'category' ? 'CategoryUUIDLevelMulti' : facetGroup.id,
            facets,
            selectionType: SparqueSearchHelper.mapSelectionType(
              AttributeHelper.getAttributeValueByAttributeName<string>(facetGroup.attributes, 'selectionType')
            ),
            limitCount: 5,
          };
        })
      : [];
  }

  private resolveFacetOptionsRecursively(
    childFacetOptions: SparqueFixedFacetOption[],
    searchParameter: URLFormParams,
    groupId: string,
    parentFacet?: Facet
  ): Facet[] {
    return childFacetOptions.flatMap(facet => {
      const currentFacet = {
        name: facet.id ? facet.id : facet.value,
        displayName: this.getLocalizedDisplayName(facet),
        count: facet.score,
        selected: searchParameter[groupId] ? searchParameter[groupId]?.includes(facet.id) : false,
        level: parentFacet ? parentFacet.level + 1 : 0,
        searchParameter: calculateSearchParams(
          searchParameter,
          searchParameter[groupId]?.includes(facet.id),
          groupId,
          facet.id
        ),
      };
      return facet.childFacets
        ? [
            currentFacet,
            ...this.resolveFacetOptionsRecursively(facet.childFacets, searchParameter, groupId, currentFacet),
          ]
        : [currentFacet];
    });
  }

  /**
   * Gets the localized display name from SparqueFixedFacetOption.
   * First tries to get the value from localizedNames based on current locale,
   * then falls back to the value property.
   *
   * @param facetOption - The facet option containing localized names and value
   * @returns The appropriate display name based on current locale
   */
  private getLocalizedDisplayName(facetOption: SparqueFixedFacetOption): string {
    if (facetOption.localizedNames && this.currentLocale && facetOption.localizedNames[this.currentLocale]) {
      return facetOption.localizedNames[this.currentLocale];
    }

    // Fallback to the value property
    return facetOption.value;
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
