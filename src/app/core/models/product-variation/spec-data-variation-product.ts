import { VariationProductView } from '../product-view/product-view.model';

// tslint:disable-next-line: ish-no-object-literal-type-assertion
export const variationProduct = {
  sku: '222',
  productMasterSKU: 'M111',
  variableVariationAttributes: [
    { name: 'Attr 1', type: 'VariationAttribute', value: 'B', variationAttributeId: 'a1' },
    { name: 'Attr 2', type: 'VariationAttribute', value: 'D', variationAttributeId: 'a2' },
  ],
  productMaster: {
    sku: 'M111',
    variationAttributeValues: [
      { name: 'Attr 1', type: 'VariationAttribute', value: 'A', variationAttributeId: 'a1' },
      { name: 'Attr 1', type: 'VariationAttribute', value: 'B', variationAttributeId: 'a1' },
      { name: 'Attr 2', type: 'VariationAttribute', value: 'C', variationAttributeId: 'a2' },
      { name: 'Attr 2', type: 'VariationAttribute', value: 'D', variationAttributeId: 'a2' },
    ],
  },
  variations: [
    {
      type: 'VariationLink',
      uri: '222',
      variableVariationAttributeValues: [
        { name: 'Attr 1', type: 'VariationAttribute', value: 'B', variationAttributeId: 'a1' },
        { name: 'Attr 2', type: 'VariationAttribute', value: 'D', variationAttributeId: 'a2' },
      ],
    },
    {
      type: 'VariationLink',
      attributes: [{ name: 'defaultVariation', type: 'Boolean', value: true }],
      uri: '333',
      variableVariationAttributeValues: [
        { name: 'Attr 1', type: 'VariationAttribute', value: 'A', variationAttributeId: 'a1' },
        { name: 'Attr 2', type: 'VariationAttribute', value: 'D', variationAttributeId: 'a2' },
      ],
    },
  ],
} as VariationProductView;

export const expectedGroups = [
  {
    id: 'a1',
    label: 'Attr 1',
    options: [
      {
        label: 'A',
        value: 'A',
        type: 'a1',
        alternativeCombination: false,
        active: false,
      },
      {
        label: 'B',
        value: 'B',
        type: 'a1',
        alternativeCombination: false,
        active: true,
      },
    ],
  },
  {
    id: 'a2',
    label: 'Attr 2',
    options: [
      {
        label: 'C',
        value: 'C',
        type: 'a2',
        alternativeCombination: true,
        active: false,
      },
      {
        label: 'D',
        value: 'D',
        type: 'a2',
        alternativeCombination: false,
        active: true,
      },
    ],
  },
];
