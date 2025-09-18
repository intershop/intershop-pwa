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

/**
 * Service responsible for mapping Sparque search responses to the application's search models.
 *
 * This mapper transforms data from the Sparque recommendation system into the standard
 * SearchResponse format used throughout the application. It handles:
 * - Product transformation via SparqueProductMapper
 * - Facet and filter mapping with hierarchical support
 * - Localization of display names
 * - Search parameter handling for faceted navigation
 *
 * The mapper maintains locale awareness by subscribing to locale changes from AppFacade
 * and uses this information to provide localized facet display names.
 */
@Injectable({ providedIn: 'root' })
export class SparqueSearchMapper {
  /** Current locale used for localizing facet display names, updated from AppFacade */
  private currentLocale = 'en_US';

  /** Destroy reference for cleanup of subscriptions */
  private destroyRef = inject(DestroyRef);

  /**
   * Creates an instance of SparqueSearchMapper.
   *
   * @param sparqueProductMapper - Service for mapping Sparque product data
   * @param appFacade - Facade providing access to application-wide state including locale
   */
  constructor(private sparqueProductMapper: SparqueProductMapper, private appFacade: AppFacade) {
    this.appFacade.currentLocale$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(locale => {
      this.currentLocale = locale.replace('_', '-');
    });
  }

  /**
   * Transforms a Sparque search response into the application's SearchResponse format.
   *
   * This method maps Sparque data structures to the standardized search response format,
   * including products, facets, sortable attributes, and filters. It handles category
   * filtering by excluding category facets when a specific category is selected.
   *
   * @param search - The Sparque search response containing products, facets, and sortings
   * @param searchParameter - Optional URL form parameters containing current search state
   * @returns SearchResponse object compatible with the application's search interface
   */
  fromData(search: SparqueSearch, searchParameter?: URLFormParams): SearchResponse {
    const baseFilters = this.mapFilter(
      searchParameter?.selectedCategory
        ? search.facets.filter(facetGroup => facetGroup.id !== 'category')
        : search.facets,
      searchParameter
    );

    // Add selectedCategory filter when present
    const filters = searchParameter?.selectedCategory
      ? [...baseFilters, this.createSelectedCategoryFilter(searchParameter.selectedCategory, searchParameter)]
      : baseFilters;

    return {
      products: this.sparqueProductMapper.fromListData(search.products),
      total: search.total,
      sortableAttributes: search.sortings
        ? search.sortings.map(sorting => ({
            name: sorting.identifier,
            displayName: sorting.title,
          }))
        : [],
      filter: filters,
    };
  }

  /**
   * Creates a selectedCategory filter for category navigation.
   *
   * When a category is selected, this method creates a filter that represents
   * the selected category, allowing users to remove the category selection.
   *
   * @param selectedCategory - Array of selected category IDs
   * @param searchParameter - Current search parameters
   * @returns A Filter object representing the selected category
   */
  private createSelectedCategoryFilter(selectedCategory: string[], searchParameter: URLFormParams): Filter {
    return {
      id: 'selectedCategory',
      name: 'Selected Category',
      displayType: 'text',
      selectionType: 'single',
      limitCount: 5,
      facets: [
        {
          name: selectedCategory[0],
          displayName: selectedCategory[0],
          count: 0,
          selected: true,
          level: 0,
          searchParameter: Object.fromEntries(
            Object.entries(searchParameter).filter(([key]) => key !== 'selectedCategory')
          ),
        },
      ],
    };
  }

  /**
   * Maps Sparque facet groups to application Filter objects.
   *
   * Transforms facet groups from Sparque format into the application's Filter format,
   * handling hierarchical facet structures and selection states. Processes display types,
   * selection types, and recursively resolves facet options.
   *
   * @param filter - Array of Sparque facet groups to map
   * @param searchParameter - Current search parameters for determining selected facets
   * @returns Array of Filter objects compatible with the application's filtering system
   */
  private mapFilter(filter: SparqueFixedFacetGroup[], searchParameter: URLFormParams): Filter[] {
    return filter
      ? filter.map(facetGroup => {
          const selectedFacetOptionsPath = searchParameter[facetGroup.id]
            ? this.findSelectedFacetOptionsPath(
                this.flatFacetOptionsMap(facetGroup.options),
                searchParameter[facetGroup.id]
              )
            : [];
          const facets = this.resolveFacetOptionsRecursively(
            facetGroup.options,
            searchParameter,
            facetGroup.id,
            selectedFacetOptionsPath
          );

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

  /**
   * Flattens a hierarchical facet options structure into a single array.
   *
   * Recursively traverses the facet options tree and creates a flat array containing
   * all facet options from all levels. This is useful for searching through hierarchical
   * facet structures when finding selected options.
   *
   * @param facetOptions - The hierarchical facet options to flatten
   * @param returnFacetOption - Accumulator array for the flattened results
   * @returns Flat array containing all facet options from the hierarchy
   */
  private flatFacetOptionsMap(
    facetOptions: SparqueFixedFacetOption[],
    returnFacetOption: SparqueFixedFacetOption[] = []
  ): SparqueFixedFacetOption[] {
    facetOptions.forEach(option => {
      returnFacetOption.push(option);
      if (option.childFacets) {
        this.flatFacetOptionsMap(option.childFacets, returnFacetOption);
      }
    });
    return returnFacetOption;
  }

  /**
   * Finds the complete path of selected facet options in a hierarchical structure.
   *
   * Given a list of selected facet option IDs, this method traverses the facet hierarchy
   * to find all parent facet options that should also be considered selected. This is
   * necessary for proper handling of hierarchical facets like categories.
   *
   * @param facetOptions - Flat array of all available facet options
   * @param selectedFacetOptionIds - Array of currently selected facet option IDs
   * @returns Complete path of selected facet options including parent options
   */
  private findSelectedFacetOptionsPath(
    facetOptions: SparqueFixedFacetOption[],
    selectedFacetOptionIds: string[]
  ): string[] {
    let result = [...selectedFacetOptionIds];
    facetOptions.forEach(facetOption => {
      if (facetOption.childFacets?.some(childFacet => childFacet.id === result[0])) {
        result = [facetOption.id, ...result];
        result = this.findSelectedFacetOptionsPath(facetOptions, result);
      }
    });
    return result;
  }

  /**
   * Recursively processes hierarchical facet options into flat Facet arrays.
   *
   * Transforms Sparque facet options with potential child facets into a flat array
   * of Facet objects. Handles selection state, search parameters, level calculation,
   * and localized display names. Maintains the hierarchical relationship through
   * level properties while flattening the structure for easier rendering.
   *
   * @param childFacetOptions - The facet options to process
   * @param searchParameter - Current search parameters for generating new search URLs
   * @param groupId - The ID of the facet group these options belong to
   * @param selectedFacetOptions - Array of selected facet option IDs
   * @param parentFacet - Optional parent facet for level calculation
   * @returns Flat array of Facet objects with proper hierarchy information
   */
  private resolveFacetOptionsRecursively(
    childFacetOptions: SparqueFixedFacetOption[],
    searchParameter: URLFormParams,
    groupId: string,
    selectedFacetOptions: string[],
    parentFacet?: Facet
  ): Facet[] {
    return childFacetOptions.flatMap(facetOption => {
      const currentFacet = {
        name: facetOption.id ? facetOption.id : facetOption.value,
        displayName: this.getLocalizedDisplayName(facetOption),
        count: facetOption.score,
        selected: selectedFacetOptions?.includes(facetOption.id),
        level: parentFacet ? parentFacet.level + 1 : 0,
        searchParameter: calculateSearchParams(searchParameter, selectedFacetOptions, groupId, facetOption.id),
      };

      return facetOption.childFacets
        ? [
            currentFacet,
            ...this.resolveFacetOptionsRecursively(
              facetOption.childFacets,
              searchParameter,
              groupId,
              selectedFacetOptions,
              currentFacet
            ),
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

/**
 * Calculates new search parameters when a facet option is selected or deselected.
 *
 * This utility function handles the logic for updating search parameters when users
 * interact with facet options. It supports both selection (adding facet to parameters)
 * and deselection (removing facet from parameters) based on current state.
 *
 * @param currentSearchParams - The current URL search parameters
 * @param selectedFacetOptions - Array of currently selected facet option IDs
 * @param facetGroupId - The ID of the facet group being modified
 * @param facetId - The ID of the specific facet option being toggled
 * @returns Updated search parameters reflecting the facet selection change
 */
function calculateSearchParams(
  currentSearchParams: URLFormParams,
  selectedFacetOptions: string[],
  facetGroupId: string,
  facetId: string
): URLFormParams {
  if (!selectedFacetOptions.includes(facetId)) {
    return { ...currentSearchParams, [facetGroupId]: [facetId] };
  }
  return selectedFacetOptions.indexOf(facetId) === 0
    ? Object.fromEntries(Object.entries(currentSearchParams).filter(([key]) => !key.includes(facetGroupId)))
    : {
        ...currentSearchParams,
        [facetGroupId]: [selectedFacetOptions[selectedFacetOptions.indexOf(facetId) - 1]],
      };
}
