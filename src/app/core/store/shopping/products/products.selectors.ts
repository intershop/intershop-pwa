import { createSelector } from '@ngrx/store';

import {
  VariationProductMasterView,
  VariationProductView,
  createProductView,
} from 'ish-core/models/product-view/product-view.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { VariationAttribute } from 'ish-core/models/variation-attribute/variation-attribute.model';
import { getSelectedOrder } from 'ish-core/store/orders';
import { groupBy } from 'ish-core/utils/functions';
import { getCategoryTree } from '../categories';
import { getShoppingState } from '../shopping-store';

import { productAdapter } from './products.reducer';

// all this is just placed here temporarily
export interface VariationSelectOption {
  label: string;
  value: string;
  type: string;
  alternativeCombination?: boolean;
  active?: boolean;
}

export interface VariationOptionGroup {
  options: VariationSelectOption[];
  label: string;
  id: string;
}

export interface VariationSelection {
  [key: string]: string;
}

/**
 * Check specific option if perfect variant match is not existing.
 * @param option  The select option to check.
 * @returns       Indicates if no perfect match is found.
 */
const alternativeCombinationCheck = (option: VariationSelectOption, product: VariationProductView) => {
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
    for (const variation of product.variations) {
      quality = 0;

      // loop attributes of possible variation.
      for (const attribute of variation.variableVariationAttributeValues) {
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
};

/**
 * Build select value structure
 */
const buildVariationOptionGroups = (product: VariationProductView): VariationOptionGroup[] => {
  const currentSettings = product.variableVariationAttributes.reduce(
    (acc, attr) => ({
      ...acc,
      [attr.variationAttributeId]: attr,
    }),
    {}
  );

  const options: VariationSelectOption[] = product.productMaster.variationAttributeValues
    .map(attr => ({
      label: attr.value,
      value: attr.value,
      type: attr.variationAttributeId,
      active: currentSettings && currentSettings[attr.variationAttributeId].value === attr.value,
    }))
    .map(option => ({
      ...option,
      alternativeCombination: alternativeCombinationCheck(option, product),
    }));

  const groupedOptions = groupBy(options, option => option.type);

  return Object.keys(groupedOptions).map(attrId => {
    const attribute = product.productMaster.variationAttributeValues.find(a => a.variationAttributeId === attrId);
    return {
      id: attribute.variationAttributeId,
      label: attribute.name,
      options: groupedOptions[attrId],
    };
  });
};

///////////////////////////

const getProductsState = createSelector(
  getShoppingState,
  state => state.products
);

export const {
  selectEntities: getProductEntities,
  selectAll: getProducts,
  selectIds: getProductIds,
} = productAdapter.getSelectors(getProductsState);

export const getSelectedProductId = createSelector(
  getProductsState,
  state => state.selected
);

export const getFailed = createSelector(
  getProductsState,
  state => state.failed
);

export const getProductVariations = createSelector(
  getProductsState,
  products => products.variations
);

export const getSelectedProduct = createSelector(
  getCategoryTree,
  getProductEntities,
  getSelectedProductId,
  getProductVariations,
  (tree, entities, id, variationsMap) => {
    const product = createProductView(entities[id], tree);

    // for master product, add variations
    if (ProductHelper.isMasterProduct(product)) {
      const variations = variationsMap[product.sku];

      if (!variationsMap || !variations) {
        return;
      }

      return {
        ...product,
        variations: variationsMap[product.sku],
      };
    }

    // for variation product, add master and master's variations
    if (ProductHelper.isVariationProduct(product)) {
      const productMaster = createProductView(entities[product.productMasterSKU], tree);

      if (!productMaster || !variationsMap) {
        return;
      }

      return {
        ...product,
        productMaster,
        variations: variationsMap[productMaster.sku],
      };
    }

    return product;
  }
);

export const getSelectedProductVariationOptions = createSelector(
  getSelectedProduct,
  product => {
    if (ProductHelper.isVariationProduct(product) && ProductHelper.hasVariations(product)) {
      return buildVariationOptionGroups(product as VariationProductView);
    }
  }
);

export const getProduct = createSelector(
  getCategoryTree,
  getProductEntities,
  getFailed,
  (tree, products, failed, props: { sku: string }) =>
    failed.includes(props.sku)
      ? // tslint:disable-next-line:ish-no-object-literal-type-assertion
        createProductView({ sku: props.sku } as Product, tree)
      : createProductView(products[props.sku], tree)
);

export const getSelectedProductVariations = createSelector(
  getSelectedProduct,
  getProductVariations,
  (product, variations) => {
    if (ProductHelper.isMasterProduct(product)) {
      return variations[product.sku] || [];
    }

    if (ProductHelper.isVariationProduct(product)) {
      return variations[product.productMasterSKU] || [];
    }

    return [];
  }
);

export const getProductLoading = createSelector(
  getProductsState,
  products => products.loading
);
