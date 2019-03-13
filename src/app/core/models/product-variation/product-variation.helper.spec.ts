import { VariationProductMasterView } from '../product-view/product-view.model';

import { ProductVariationHelper } from './product-variation.helper';
import { expectedGroups, variationProduct } from './spec-data-variation-product';

describe('Product Variation Helper', () => {
  it('should find default variation for master product', () => {
    const product = {
      variations: [
        { uri: '111' },
        {
          attributes: [{ name: 'defaultVariation', type: 'Boolean', value: true }],
          uri: '222',
        },
        { uri: '333' },
      ],
    } as VariationProductMasterView;

    const result = ProductVariationHelper.findDefaultVariationForMaster(product);
    expect(result.uri).toBe('222');
  });

  it('should build build variation option groups for variation product', () => {
    const result = ProductVariationHelper.buildVariationOptionGroups(variationProduct);
    expect(result).toEqual(expectedGroups);
  });
});
