export interface VariationAttribute {
  variationAttributeId: string;
  name: string;
  value: string | number | { value: number; unit: string };
  attributeType: VariationAttributeType;
  metaData?: string;
}

export type VariationAttributeType =
  | 'default'
  | 'colorCode'
  | 'defaultAndColorCode'
  | 'swatchImage'
  | 'defaultAndSwatchImage';
