import { flatten, groupBy } from 'lodash-es';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { omit } from 'ish-core/utils/functions';

import { VariationAttribute } from './variation-attribute.model';
import { VariationOptionGroup } from './variation-option-group.model';
import { VariationSelectOption } from './variation-select-option.model';

export class ProductVariationHelper {
  /**
   * Check specific option if perfect variant match is not existing.
   * @param option  The select option to check.
   * @returns       Indicates if no perfect match is found.
   * TODO: Refactor this to a more functional style
   */
  private static alternativeCombinationCheck(option: VariationSelectOption, product: ProductView): boolean {
    if (!product.variableVariationAttributes?.length) {
      return;
    }

    let quality: number;
    const perfectMatchQuality = product.variableVariationAttributes.length;

    // loop all selected product attributes ignoring the ones related to currently checked option.
    for (const selectedAttribute of product.variableVariationAttributes) {
      // loop all possible variations
      for (const variation of product.variations) {
        quality = 0;

        // loop attributes of possible variation.
        for (const attribute of variation.variableVariationAttributes || []) {
          // increment quality if variation attribute matches selected product attribute.
          if (
            attribute.variationAttributeId === selectedAttribute.variationAttributeId &&
            attribute.value === selectedAttribute.value
          ) {
            quality += 1;
            continue;
          }

          // increment quality if variation attribute matches currently checked option.
          if (attribute.variationAttributeId === option.type && attribute.value === option.value) {
            quality += 1;
            continue;
          }
        }

        // perfect match found
        if (quality === perfectMatchQuality) {
          return false;
        }
      }
    }

    // imperfect match
    return true;
  }

  /**
   * Build select value structure
   */
  static buildVariationOptionGroups(product: ProductView): VariationOptionGroup[] {
    if (!product) {
      return [];
    }

    // transform currently selected variation attribute list to object with the attributeId as key
    const currentSettings = (product.variableVariationAttributes || []).reduce<{ [id: string]: VariationAttribute }>(
      (acc, attr) => ({
        ...acc,
        [attr.variationAttributeId]: attr,
      }),
      {}
    );

    // transform all variation attribute values to selectOptions
    // each with information about alternative combinations and active status (active status comes from currently selected variation)
    const options: VariationSelectOption[] = (product.productMaster?.variationAttributeValues || [])
      .map(attr => ({
        label: attr.value,
        value: attr.value,
        type: attr.variationAttributeId,
        active: currentSettings?.[attr.variationAttributeId]?.value === attr.value,
      }))
      .map(option => ({
        ...option,
        alternativeCombination: ProductVariationHelper.alternativeCombinationCheck(option, product),
      }));

    // group options list by attributeId
    const groupedOptions = groupBy(options, option => option.type);

    // go through those groups and transform them to more complex objects
    return Object.keys(groupedOptions).map(attrId => {
      // we need to get one of the original attributes again here, because we lost the attribute name
      const attribute = product.productMaster.variationAttributeValues.find(a => a.variationAttributeId === attrId);
      return {
        id: attribute.variationAttributeId,
        label: attribute.name,
        options: groupedOptions[attrId],
      };
    });
  }

  private static simplifyVariableVariationAttributes(attrs: VariationAttribute[]): { [name: string]: string } {
    return attrs
      .map(attr => ({
        name: attr.variationAttributeId,
        value: attr.value,
      }))
      .reduce((acc, val) => ({ ...acc, [val.name]: val.value }), {});
  }

  private static difference(obj1: { [name: string]: string }, obj2: { [name: string]: string }): number {
    const keys = Object.keys(obj1);
    if (keys.length !== Object.keys(obj2).length || keys.some(k => Object.keys(obj2).indexOf(k) < 0)) {
      throw new Error("cannot calculate difference if objects don't have the same keys");
    }
    return keys.reduce((sum, key) => (obj1[key] !== obj2[key] ? sum + 1 : sum), 0);
  }

  static findPossibleVariation(name: string, value: string, product: ProductView): string {
    const target = omit(
      ProductVariationHelper.simplifyVariableVariationAttributes(product.variableVariationAttributes),
      name
    );

    const candidates = product.variations
      .filter(variation =>
        variation.variableVariationAttributes.some(attr => attr.variationAttributeId === name && attr.value === value)
      )
      .map(variation => ({
        sku: variation.sku,
        opts: omit(
          ProductVariationHelper.simplifyVariableVariationAttributes(variation.variableVariationAttributes),
          name
        ),
      }));

    if (candidates.length) {
      return candidates.reduce((min, cur) =>
        ProductVariationHelper.difference(cur.opts, target) < ProductVariationHelper.difference(min.opts, target)
          ? cur
          : min
      ).sku;
    }

    return product.sku;
  }

  static hasDefaultVariation(product: ProductView): boolean {
    return product && !!product.defaultVariationSKU;
  }

  static productVariationCount(product: ProductView, filters: FilterNavigation): number {
    if (!product) {
      return 0;
    } else if (!filters?.filter) {
      return product.variations?.length;
    }

    const selectedFacets = flatten(
      filters.filter.map(filter => filter.facets.filter(facet => facet.selected).map(facet => facet.name))
    ).map(selected => selected.split('='));

    return product.variations
      .map(p => p.variableVariationAttributes)
      .filter(attrs =>
        attrs.every(
          attr =>
            // attribute is not selected
            !selectedFacets.find(([key]) => key === attr.variationAttributeId) ||
            // selection is variation
            selectedFacets.find(([key, val]) => key === attr.variationAttributeId && val === attr.value)
        )
      ).length;
  }
}
