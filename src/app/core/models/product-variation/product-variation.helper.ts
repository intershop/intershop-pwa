import { groupBy } from 'lodash-es';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { VariationProduct } from 'ish-core/models/product/product.model';
import { omit } from 'ish-core/utils/functions';

import { VariationAttribute } from './variation-attribute.model';
import { VariationOptionGroup } from './variation-option-group.model';
import { VariationSelectOption } from './variation-select-option.model';

export class ProductVariationHelper {
  /**
   * Build select value structure
   */
  static buildVariationOptionGroups(product: ProductView, variations: VariationProduct[]): VariationOptionGroup[] {
    if (!product?.variableVariationAttributes?.length) {
      return [];
    }

    // transform currently selected variation attribute list to object with the attributeId as key
    const currentSettings = product.variableVariationAttributes.reduce<{ [id: string]: VariationAttribute }>(
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
        label: ProductVariationHelper.toDisplayValue(attr.value),
        value: ProductVariationHelper.toValue(attr.value)?.toString(),
        type: attr.variationAttributeId,
        metaData: attr.metaData,
        active: ProductVariationHelper.isEqual(currentSettings?.[attr.variationAttributeId]?.value, attr.value),
      }))
      .map(option => ({
        ...option,
        alternativeCombination: ProductVariationHelper.alternativeCombinationCheck(option, product, variations),
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
        attributeType: attribute.attributeType,
        options: groupedOptions[attrId],
      };
    });
  }

  static findPossibleVariation(
    name: string,
    value: string,
    product: ProductView,
    variations: VariationProduct[]
  ): string {
    const target = omit(
      ProductVariationHelper.simplifyVariableVariationAttributes(product.variableVariationAttributes),
      name
    );

    const candidates = variations
      .filter(variation =>
        variation.variableVariationAttributes.some(
          attr => attr.variationAttributeId === name && ProductVariationHelper.isEqual(attr.value, value)
        )
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

  static productVariationCount(variations: VariationProduct[], filters: FilterNavigation): number {
    if (!variations?.length) {
      return 0;
    } else if (!filters?.filter) {
      return variations?.length;
    }

    const selectedFacets = filters.filter
      .map(filter => filter.facets.filter(facet => facet.selected).map(facet => facet.name))
      .flat()
      .map(selected => selected.split('='));

    if (!selectedFacets.length) {
      return variations?.length;
    }

    return variations
      .map(p => p.variableVariationAttributes)
      .filter(attrs =>
        attrs.every(
          attr =>
            // attribute is not selected
            !selectedFacets.find(([key]) => key === attr.variationAttributeId) ||
            // selection is variation
            selectedFacets.find(
              ([key, val]) => key === attr.variationAttributeId && ProductVariationHelper.isEqual(val, attr.value)
            )
        )
      ).length;
  }

  /**
   * Check specific option if perfect variant match is not existing.
   *
   * @param option  The select option to check.
   * @param product The given product containing the related product variations
   * @returns       Indicates if no perfect match is found.
   */
  private static alternativeCombinationCheck(
    option: VariationSelectOption,
    product: ProductView,
    variations: VariationProduct[]
  ): boolean {
    if (!product.variableVariationAttributes?.length) {
      return;
    }

    const comparisonAttributes = product.variableVariationAttributes.map(attribute =>
      attribute.variationAttributeId === option.type ? { ...attribute, value: option.value } : attribute
    );

    // check if the current product has the same attributes as the attributes to be compared
    if (
      ProductVariationHelper.variationAttributeArrayEquals(product.variableVariationAttributes, comparisonAttributes)
    ) {
      // perfect match found
      return false;
    }

    // check if one of the variation products has the same attributes as the attributes to be compared
    return !variations.some(variation =>
      ProductVariationHelper.variationAttributeArrayEquals(variation.variableVariationAttributes, comparisonAttributes)
    );
  }

  // determines whether both arrays have the same variation attributes
  private static variationAttributeArrayEquals(array1: VariationAttribute[], array2: VariationAttribute[]): boolean {
    return (
      Array.isArray(array1) &&
      Array.isArray(array2) &&
      array1.length === array2.length &&
      array1.every(val =>
        array2.find(
          attribute => attribute.name === val.name && ProductVariationHelper.isEqual(attribute.value, val.value)
        )
      )
    );
  }

  private static toValue(input: VariationAttribute['value']): string | number {
    return typeof input === 'object' ? input.value : input;
  }

  private static toDisplayValue(input: VariationAttribute['value']): string {
    return typeof input === 'object' ? `${input.value} ${input.unit}` : input.toString();
  }

  private static isEqual(obj1: VariationAttribute['value'], obj2: VariationAttribute['value']): boolean {
    // eslint-disable-next-line eqeqeq -- needed for comparison of string, integers and floats
    return ProductVariationHelper.toValue(obj1) == ProductVariationHelper.toValue(obj2);
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
}
