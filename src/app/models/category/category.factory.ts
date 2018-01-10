import { FactoryHelper } from '../factory-helper';
import { ImageFactory } from '../image/image.factory';
import { CategoryData } from './category.interface';
import { Category } from './category.model';


export class CategoryFactory {

  static fromData(categoryData: CategoryData): Category {
    if (categoryData) {
      const category: Category = new Category(categoryData.id, categoryData.name);

      FactoryHelper.primitiveMapping<CategoryData, Category>(categoryData, category);

      if (categoryData.subCategories) {
        category.subCategories = categoryData.subCategories.map(rawSubCategory => CategoryFactory.fromData(rawSubCategory));
      }
      if (categoryData.images) {
        category.images = categoryData.images.map(imageData => ImageFactory.fromData(imageData));
      }
      return category;
    } else {
      throw new Error('\'categoryData\' is required');
    }
  }
}
