import { CategoryData } from './category.interface';
import { Category } from './category.model';


export class CategoryFactory {
  static fromData(categoryData: CategoryData): Category {
    let subCategories: Category[] = null;
    if (categoryData) {
      if (categoryData.subCategories) {
        subCategories = categoryData.subCategories.map(rawSubCategory => CategoryFactory.fromData(rawSubCategory));
      }
      const category: Category = new Category(categoryData.id, categoryData.name);

      category.type = categoryData.type;
      category.hasOnlineProducts = categoryData.hasOnlineProducts;
      category.hasOnlineSubCategories = categoryData.hasOnlineSubCategories;
      category.online = categoryData.online;
      category.description = categoryData.description;
      category.subCategoriesCount = categoryData.subCategoriesCount;
      category.images = categoryData.images;
      category.subCategories = subCategories;
      category.uri = categoryData.uri;

      return category;
    } else {
      throw new Error('\'categoryData\' is required');
    }
  }
}
