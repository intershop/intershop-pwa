export interface VariationAttribute {
  variationAttributeId: string;
  name: string;
  value: { value: number; unit: string } | number | string;
  attributeType: VariationAttributeType;
  metaData?: string;
}

export type VariationAttributeType =
  | 'colorCode'
  | 'default'
  | 'defaultAndColorCode'
  | 'defaultAndSwatchImage'
  | 'swatchImage';
