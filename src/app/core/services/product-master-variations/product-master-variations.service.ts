import { Injectable } from '@angular/core';
import b64u from 'b64u';
import { groupBy } from 'lodash-es';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { VariationAttribute } from 'ish-core/models/product-variation/variation-attribute.model';
import { VariationProductMasterView, VariationProductView } from 'ish-core/models/product-view/product-view.model';

interface FiltersType {
  [facet: string]: string[];
}

@Injectable({ providedIn: 'root' })
export class ProductMasterVariationsService {
  getFiltersAndFilteredVariationsForMasterProduct(
    product: VariationProductMasterView,
    filterString: string
  ): { filterNavigation: FilterNavigation; products: string[] } {
    const filters = this.splitFormParams(filterString);
    return {
      filterNavigation: this.createFilterNavigation(product, filters),
      products: this.filterVariations(product, filters),
    };
  }

  private filterVariations(product: VariationProductMasterView, filters: FiltersType): string[] {
    if (filters && Object.keys(filters).length) {
      return this.potetialMatches(filters, product.variations()).map(p => p.sku);
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

  private potetialMatches(newFilters: FiltersType, variations: VariationProductView[]) {
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
    filters: FiltersType,
    variations: VariationProductView[]
  ) {
    const selected = !!filters[filterName] && filters[filterName].includes(attribute.value);
    const newFilters = {
      ...filters,
      [filterName]: selected
        ? this.removed(filters[filterName], attribute.value)
        : this.added(filters[filterName], attribute.value),
    };
    return {
      name: attribute.value,
      searchParameter: b64u.toBase64(b64u.encode(this.mergeFormParams(newFilters))),
      count: this.potetialMatches(newFilters, variations).length,
      filterId: filterName,
      link: { uri: '', title: attribute.value, type: 'Link' },
      selected,
      type: 'Facet',
    };
  }

  private createFilterNavigation(product: VariationProductMasterView, filters: FiltersType): FilterNavigation {
    const groups = groupBy(product.variationAttributeValues, val => val.variationAttributeId);
    return {
      filter: Object.keys(groups).map(key => ({
        id: key,
        displayType: 'checkbox',
        name: groups[key][0].name,
        facets: groups[key]
          .map(val => this.createFacet(key, val, filters, product.variations()))
          .filter(facet => !!facet.count || facet.selected),
      })),
    };
  }

  private mergeFormParams(object: FiltersType): string {
    return Object.entries(object)
      .filter(([, value]) => Array.isArray(value) && value.length)
      .map(([key, val]) => `${key}=${(val as string[]).join(',')}`)
      .join('&');
  }

  private splitFormParams(object: string): FiltersType {
    return object
      ? object
          .split('&')
          .map(val => {
            const sp = val.split('=');
            return { key: sp[0], value: sp[1].split(',') };
          })
          .reduce((acc, val) => ({ ...acc, [val.key]: val.value }), {})
      : {};
  }
}
