import { CategoryTreeHelper } from '../category-tree/category-tree.helper';
import { CategoryTree } from '../category-tree/category-tree.model';
import { CategoryData, CategoryPathElement } from './category.interface';
import { Category, CategoryHelper } from './category.model';

export class CategoryMapper {
  /**
   * Utility Method:
   * Maps the incoming raw category path to a path with unique IDs.
   */
  static mapCategoryPath(path: CategoryPathElement[]) {
    if (path && path.length) {
      const ret = [];
      ret.push(path[0].id);
      path.map(el => el.id).reduce((acc, item) => {
        const r = acc + CategoryHelper.uniqueIdSeparator + item;
        ret.push(r);
        return r;
      });
      return ret;
    }
    throw new Error('input is falsy');
  }

  /**
   * Maps a raw {@link CategoryData} element to a {@link Category} element ignoring subcategories.
   */
  static fromDataSingle(categoryData: CategoryData): Category {
    if (categoryData) {
      const categoryPath = CategoryMapper.mapCategoryPath(categoryData.categoryPath);
      const uniqueId = categoryPath[categoryPath.length - 1];

      return {
        uniqueId,
        categoryPath,
        name: categoryData.name,
        hasOnlineProducts: categoryData.hasOnlineProducts,
        hasOnlineSubCategories: categoryData.hasOnlineSubCategories,
        description: categoryData.description,
        images: categoryData.images,
        // if category was not requested directly in REST API, it always has an uri
        completelyLoaded: !categoryData.uri,
      };
    } else {
      throw new Error(`'categoryData' is required`);
    }
  }

  /**
   * Converts the tree of {@link CategoryData} to the model entity {@link CategoryTree}.
   * Inserts all sub categories accordingly.
   */
  static fromData(categoryData: CategoryData): CategoryTree {
    if (categoryData) {
      // recurse into tree
      let subTrees: CategoryTree;
      if (categoryData.subCategories && categoryData.subCategories.length) {
        subTrees = categoryData.subCategories
          .map(CategoryMapper.fromData)
          .reduce((a, b) => CategoryTreeHelper.merge(a, b));
      } else {
        subTrees = CategoryTreeHelper.empty();
      }

      // create tree from current category
      const rootCat = CategoryMapper.fromDataSingle(categoryData);
      const tree = CategoryTreeHelper.single(rootCat);

      // merge sub categories onto current tree
      const treeWithSubCategories = CategoryTreeHelper.merge(tree, subTrees);
      return treeWithSubCategories;
    } else {
      throw new Error(`'categoryData' is required`);
    }
  }
}
