import { Product } from './product.model';

export interface ProductBundle extends Product {
  type: 'Bundle';
}
