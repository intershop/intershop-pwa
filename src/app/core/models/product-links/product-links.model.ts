import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

export interface ProductLinks {
  [id: string]: {
    products: string[];
    categories: string[];
  };
}

export interface ProductLinksView {
  [id: string]: ProductLinkView;
}

export interface ProductLinkView {
  productSKUs: string[];
  categoryIds: string[];
  products(): ProductView[];
  categories(): CategoryView[];
}
