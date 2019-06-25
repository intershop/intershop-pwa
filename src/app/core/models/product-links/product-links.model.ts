import { CategoryView } from '../category-view/category-view.model';
import { ProductView } from '../product-view/product-view.model';

export interface ProductLinks {
  [id: string]: {
    products: string[];
    categories: string[];
  };
}

export interface ProductLinksView {
  [id: string]: {
    productSKUs: string[];
    categoryIds: string[];
    products(): ProductView[];
    categories(): CategoryView[];
  };
}
