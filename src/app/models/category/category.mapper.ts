import { CategoryData } from './category.interface';
import { Category } from './category.model';

export class CategoryMapper {

  static fromData(categoryData: CategoryData, categoryUniqueId?: string): Category {
    if (categoryData) {
      const uniqueId = categoryUniqueId ? categoryUniqueId : categoryData.id;
      const subCategories = (categoryData.subCategories)
        ? categoryData.subCategories
          .map(subCategoryData => CategoryMapper.fromData(subCategoryData, uniqueId + '.' + subCategoryData.id))
        : undefined;

      return {
        uniqueId,
        subCategories,
        id: categoryData.id,
        name: categoryData.name,
        hasOnlineProducts: categoryData.hasOnlineProducts,
        hasOnlineSubCategories: categoryData.hasOnlineSubCategories,
        subCategoriesIds: categoryData.subCategoriesIds,
        subCategoriesCount: categoryData.subCategoriesCount,
        description: categoryData.description,
        images: categoryData.images,
      };
    } else {
      throw new Error(`'categoryData' is required`);
    }
  }
}
