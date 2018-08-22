import { Link } from '../link/link.model';
import { VariationAttribute } from '../variation-attribute/variation-attribute.model';

export interface VariationLink extends Link {
  variableVariationAttributeValues: VariationAttribute[];
}
