import { Injectable } from '@angular/core';
import b64u from 'b64u';
import { groupBy } from 'lodash-es';

import { Facet } from 'ish-core/models/facet/facet.model';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { VariationAttribute } from 'ish-core/models/product-variation/variation-attribute.model';
import { VariationProductMasterView, VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { URLFormParams, formParamsToString, stringToFormParams } from 'ish-core/utils/url-form-params';

@Injectable({ providedIn: 'root' })
export class ProductMasterVariationsService {
  getFiltersAndFilteredVariationsForMasterProduct(
    product: VariationProductMasterView,
    filterString: string
  ): { filterNavigation: FilterNavigation; products: string[] } {
    const filters = stringToFormParams(filterString);
    return {
      filterNavigation: this.createFilterNavigation(product, filters),
      products: this.filterVariations(product, filters),
    };
  }

  private filterVariations(product: VariationProductMasterView, filters: URLFormParams): string[] {
    if (filters && Object.keys(filters).length) {
      return this.potentialMatches(filters, product.variations()).map(p => p.sku);
    } else {
      return product.variations().map(p => p.sku);
    }
  }

  private removed(array: string[], value: string): string[] {
    if (!array || !array.length) {
      return [];
    }

    const ret = [...array];
    ret.splice(array.indexOf(value), 1);
    return ret;
  }

  private added(array: string[], value: string): string[] {
    if (!array || !array.length) {
      return [value];
    }
    return [...array, value];
  }

  private potentialMatches(newFilters: URLFormParams, variations: VariationProductView[]) {
    return variations.filter(variation =>
      Object.keys(newFilters)
        .filter(facet => newFilters[facet].length)
        .every(facet =>
          newFilters[facet].some(
            val =>
              !!variation.variableVariationAttributes.find(
                attr => attr.variationAttributeId === facet && attr.value === val
              )
          )
        )
    );
  }

  private createFacet(
    filterName: string,
    attribute: VariationAttribute,
    filters: URLFormParams,
    variations: VariationProductView[]
  ): Facet {
    const selected = !!filters[filterName] && filters[filterName].includes(attribute.value);
    const newFilters = {
      ...filters,
      [filterName]: selected
        ? this.removed(filters[filterName], attribute.value)
        : this.added(filters[filterName], attribute.value),
    };
    return {
      name: attribute.value,
      searchParameter: b64u.toBase64(b64u.encode(formParamsToString(newFilters))),
      count:
        this.potentialMatches(newFilters, variations).length &&
        variations.filter(variation =>
          variation.variableVariationAttributes.find(
            att => att.variationAttributeId === attribute.variationAttributeId && att.value === attribute.value
          )
        ).length,
      displayName: attribute.value,
      selected,
      level: 0,
    };
  }

  private createFilterNavigation(product: VariationProductMasterView, filters: URLFormParams): FilterNavigation {
    const groups = groupBy(product.variationAttributeValues, val => val.variationAttributeId);
    return {
      filter: Object.keys(groups).map(key => ({
        id: key,
        displayType: 'checkbox',
        name: groups[key][0].name,
        selectionType: 'multiple_or',
        facets: groups[key]
          .map(val => this.createFacet(key, val, filters, product.variations()))
          .filter(facet => !!facet.count || facet.selected),
      })),
    };
  }
}
