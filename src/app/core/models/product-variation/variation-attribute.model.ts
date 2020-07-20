import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface VariationAttribute extends Attribute<string> {
  variationAttributeId: string;
}
