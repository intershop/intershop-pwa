import { ContentfulComponent } from './contentfulComponent.model';

export class CategoryItem {
  category_id: string;
  excluded_products: string[];
  subcategories: CategoryItem[];
}

export class Category {
  internalName: string;
  categoryImage: ContentfulComponent;
}
