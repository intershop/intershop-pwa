import { flatten, groupBy } from 'lodash-es';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { VariationProductMasterView, VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { objectToArray } from 'ish-core/utils/functions';

import { VariationOptionGroup } from './variation-option-group.model';
import { VariationSelectOption } from './variation-select-option.model';
import { VariationSelection } from './variation-selection.model';

export class ProductVariationHelper {
  /**
   * Check specific option if perfect variant match is not existing.
   * @param option  The select option to check.
   * @returns       Indicates if no perfect match is found.
   * TODO: Refactor this to a more functional style
   */
  private static alternativeCombinationCheck(option: VariationSelectOption, product: VariationProductView): boolean {
    let quality: number;
    const perfectMatchQuality = product.variableVariationAttributes.length;

    // loop all selected product attributes ignoring the ones related to currently checked option.
    for (const selectedAttribute of product.variableVariationAttributes) {
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
   * TODO: Refactor this to a more functional style
   */
  static findPossibleVariationForSelection(
    selection: VariationSelection,
    product: VariationProductView,
    changedAttribute?: string
  ): VariationProductView {
    const selectionArray = objectToArray(selection);
    const variations = product.variations();
    let possibleVariation: VariationProductView;
    let matchedVariation: VariationProductView;

    for (const variation of variations) {
      let quality = 0;

      for (const variationAttribute of variation.variableVariationAttributes || []) {
        // selected variant object loop
        for (const item of selectionArray) {
          if (variationAttribute.variationAttributeId === item.key && variationAttribute.value === item.value) {
            quality += 1;
          }
        }
      }

      // redirect to perfect match
      if (quality === selectionArray.length) {
        matchedVariation = variation;
        break;
      }

      // store possible redirect uri (quality > 0)
      if (quality > 0 && variation.sku !== product.sku) {
        if (!possibleVariation) {
          possibleVariation = variation;
        } else if (changedAttribute) {
          const filteredVariableVariationAttributes = variation.variableVariationAttributes.filter(
            x => x.variationAttributeId === changedAttribute
          );
          if (
            filteredVariableVariationAttributes.length === 1 &&
            filteredVariableVariationAttributes[0].value === selection[changedAttribute]
          ) {
            possibleVariation = variation;
          }
        }
      }
    }

    // redirect if match quality > 0
    return matchedVariation || possibleVariation || product;
  }

  static hasDefaultVariation(product: VariationProductMasterView): boolean {
    return product && !!product.defaultVariationSKU;
  }

  static productVariationCount(product: VariationProductMasterView, filters: FilterNavigation): number {
    if (!product) {
      return 0;
    } else if (!filters?.filter) {
      return product.variations()?.length;
    }

    const selectedFacets = flatten(
      filters.filter.map(filter => filter.facets.filter(facet => facet.selected).map(facet => facet.name))
    ).map(selected => selected.split('='));

    return product
      .variations()
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
