import { Injectable } from '@angular/core';
import b64u from 'b64u';
import { groupBy, intersection } from 'lodash-es';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { VariationAttribute } from 'ish-core/models/product-variation/variation-attribute.model';
import { VariationProductMasterView } from 'ish-core/models/product-view/product-view.model';

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

  private filterVariations(product: VariationProductMasterView, filters): string[] {
    if (filters && Object.keys(filters).length) {
      return intersection(
        ...Object.entries(filters).map(([key, value]) =>
          product
            .variations()
            .filter(variation =>
              variation.variableVariationAttributes.find(
                attr => attr.variationAttributeId === key && Array.isArray(value) && value.includes(attr.value)
              )
            )
            .map(p => p.sku)
        )
      );
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

  private createFacet(filterName: string, attribute: VariationAttribute, filters) {
    const selected = !!filters[filterName] && filters[filterName].includes(attribute.value);
    const searchParameter = this.mergeFormParams({
      ...filters,
      [filterName]: selected
        ? this.removed(filters[filterName], attribute.value)
        : this.added(filters[filterName], attribute.value),
    });
    return {
      name: attribute.value,
      searchParameter: b64u.toBase64(b64u.encode(searchParameter)),
      count: undefined,
      filterId: filterName,
      link: { uri: '', title: attribute.value, type: 'Link' },
      selected,
      type: 'Facet',
    };
  }

  private createFilterNavigation(product: VariationProductMasterView, filters): FilterNavigation {
    const groups = groupBy(product.variationAttributeValues, val => val.variationAttributeId);
    return {
      filter: Object.keys(groups).map(key => ({
        id: key,
        displayType: 'checkbox',
        name: groups[key][0].name,
        facets: groups[key].map(val => this.createFacet(key, val, filters)),
      })),
    };
  }

  private mergeFormParams(object) {
    return Object.entries(object)
      .filter(([, value]) => Array.isArray(value) && value.length)
      .map(([key, val]) => `${key}=${(val as string[]).join(',')}`)
      .join('&');
  }

  private splitFormParams(object: string) {
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
