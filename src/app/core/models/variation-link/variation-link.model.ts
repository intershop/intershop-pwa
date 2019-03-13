import { Link } from '../link/link.model';
import { VariationAttribute } from '../product-variation/variation-attribute.model';

export interface VariationLink extends Link {
  type: 'VariationLink';
  variableVariationAttributeValues: VariationAttribute[];
}

export interface ProductVariationLinksMap {
  [sku: string]: VariationLink[];
}
