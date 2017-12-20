import { RawCategory } from './category.interface';
import { Category } from './category.model';


export function categoryFromRaw(rawCategory: RawCategory): Category {
  let subCategories: Category[] = null;
  if (rawCategory) {
    if (rawCategory.subCategories) {
      subCategories = rawCategory.subCategories.map(rawSubCategory => categoryFromRaw(rawSubCategory));
    }
    const category: Category = new Category(rawCategory.id, rawCategory.name);

    category.type = rawCategory.type;
    category.hasOnlineProducts = rawCategory.hasOnlineProducts;
    category.hasOnlineSubCategories = rawCategory.hasOnlineSubCategories;
    category.online = rawCategory.online;
    category.description = rawCategory.description;
    category.subCategoriesCount = rawCategory.subCategoriesCount;
    category.images = rawCategory.images;
    category.subCategories = subCategories;
    category.uri = rawCategory.uri;

    return category;
  } else {
    throw new Error('\'rawCategory\' is required');
  }
}
