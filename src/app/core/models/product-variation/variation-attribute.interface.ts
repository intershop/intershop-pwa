import { VariationAttributeType } from './variation-attribute.model';

export interface VariationAttributeData {
  variationAttributeId: string;
  name: string;
  value?: VariationAttributeValue;
  values?: {
    value: VariationAttributeValue;
    metadata?: VariationAttributeMetaData;
  }[];
  attributeType?: VariationAttributeType;
  metadata?: VariationAttributeMetaData;
}

interface VariationAttributeValue {
  name: string;
  value: string;
}

export interface VariationAttributeMetaData {
  colorCode?: string;
  imagePath?: string;
}
