import { groupBy } from 'lodash-es';

import { VariationProductMasterView, VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { objectToArray } from 'ish-core/utils/functions';

import { VariationAttribute } from './variation-attribute.model';
import { VariationOptionGroup } from './variation-option-group.model';
import { VariationSelectOption } from './variation-select-option.model';
import { VariationSelection } from './variation-selection.model';

export class ProductVariationHelper {
  /**
   * Check specific option if perfect variant match is not existing.
   * @param option  The select option to check.
   * @returns       Indicates if no perfect match is found.
   */
  // TODO: Refactor this to a more functional style
  static alternativeCombinationCheck(option: VariationSelectOption, product: VariationProductView): boolean {
    let quality: number;
    const selectedProductAttributes: VariationAttribute[] = [];
    const perfectMatchQuality = product.variableVariationAttributes.length;

    // remove option related attribute type since it should not be involved in combination check.
    for (const attribute of product.variableVariationAttributes) {
      if (attribute.variationAttributeId !== option.type) {
        selectedProductAttributes.push(attribute);
      }
    }

    // loop all selected product attributes ignoring the ones related to currently checked option.
    for (const selectedAttribute of selectedProductAttributes) {
      // loop all possible variations
      for (const variation of product.variations()) {
        quality = 0;

        // loop attributes of possible variation.
        for (const attribute of variation.variableVariationAttributes || []) {
          // increment quality if variation attribute matches selected product attribute.
          if (
            attribute.variationAttributeId === selectedAttribute.variationAttributeId &&
            attribute.value === selectedAttribute.value
          ) {
            quality += 1;
          }

          // increment quality if variation attribute matches currently checked option.
          if (attribute.variationAttributeId === option.type && attribute.value === option.value) {
            quality += 1;
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
  static buildVariationOptionGroups(product: VariationProductView): VariationOptionGroup[] {
    // transform currently selected variation attribute list to object with the attributeId as key
    const currentSettings = product.variableVariationAttributes.reduce(
      (acc, attr) => ({
        ...acc,
        [attr.variationAttributeId]: attr,
      }),
      {}
    );

    // transform all variation attribute values to selectOptions
    // each with information about alternative combinations and active status (active status comes from currently selected variation)
    const options: VariationSelectOption[] = (product.productMaster().variationAttributeValues || [])
      .map(attr => ({
        label: attr.value,
        value: attr.value,
        type: attr.variationAttributeId,
        active: currentSettings && currentSettings[attr.variationAttributeId].value === attr.value,
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
      const attribute = product.productMaster().variationAttributeValues.find(a => a.variationAttributeId === attrId);
      return {
        id: attribute.variationAttributeId,
        label: attribute.name,
        options: groupedOptions[attrId],
      };
    });
  }

  /**
   * Find possible variant match
   * @param selection The selected variant form values.
   */
  // TODO: Refactor this to a more functional style
  static findPossibleVariationForSelection(
    selection: VariationSelection,
    product: VariationProductView
  ): VariationProductView {
    const valueArray = objectToArray(selection);
    let possibleVariation: VariationProductView;

    for (const variation of product.variations()) {
      let quality = 0;

      for (const variationAttribute of variation.variableVariationAttributes || []) {
        // selected variant object loop
        for (const item of valueArray) {
          if (variationAttribute.variationAttributeId === item.key && variationAttribute.value === item.value) {
            quality += 1;
          }
        }
      }

      // redirect to perfect match
      if (quality === valueArray.length) {
        return variation;
      }
      // store possible redirect uri (quality > 0)
      if (quality > 0 && !possibleVariation) {
        possibleVariation = variation;
      }
    }

    // redirect if match quality > 0
    if (possibleVariation) {
      return possibleVariation;
    }
  }

  static hasDefaultVariation(product: VariationProductMasterView): boolean {
    return product && !!product.defaultVariationSKU;
  }
}
