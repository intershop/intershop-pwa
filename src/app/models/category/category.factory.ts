import { FactoryHelper } from '../factory-helper';
import { ImageFactory } from '../image/image.factory';
import { CategoryData } from './category.interface';
import { Category } from './category.model';

export class CategoryFactory {

  static fromData(categoryData: CategoryData, categoryUniqueId?: string): Category {
    if (categoryData) {

      categoryUniqueId = categoryUniqueId ? categoryUniqueId : categoryData.id;

      const category: Category = new Category(categoryData.id, categoryData.name, categoryUniqueId);

      FactoryHelper.primitiveMapping<CategoryData, Category>(categoryData, category);

      if (categoryData.subCategories) {
        category.subCategories = categoryData.subCategories
          .map(subCategoryData => CategoryFactory.fromData(subCategoryData, categoryUniqueId + '.' + subCategoryData.id));
      }

      if (categoryData.subCategoriesIds) {
        category.subCategoriesIds = [...categoryData.subCategoriesIds];
      }

      if (categoryData.images) {
        category.images = categoryData.images.map(imageData => ImageFactory.fromData(imageData));
      }
      return category;
    } else {
      throw new Error('\'categoryData\' is required');
    }
  }

  static clone(c: Category) {
    return CategoryFactory.fromData(c as CategoryData, c.uniqueId); // TODO
  }
}
