import { Category } from './category.model';

export class CategoryHelper {
  static uniqueIdSeparator = '.';

  /**
   * @returns          True if the categories are equal, false if not.
   *                   'equal' means
   *                   - both categories are defined
   *                   - the uniqueId of the categories is the same
   */
  static equals(self: Category, category: Category): boolean {
    return !!self && !!category && self.uniqueId === category.uniqueId;
  }

  /**
   * Converts a given uniqueId of a category in a REST API category path.
   * @example
   * 'A.B.C' -> 'A/B/C'
   */
  static getCategoryPath(uniqueId: string): string {
    if (!uniqueId) {
      return undefined;
    }
    const regEx = new RegExp(`\\${CategoryHelper.uniqueIdSeparator}`, 'g');
    return uniqueId.replace(regEx, '/');
  }

  /**
   * expands a given uniqueId to the IDs of the path
   * @example
   * 'A.B.C' -> ['A.B.C', 'A.B', 'A']
   */
  static getCategoryPathIds(uniqueId: string): string[] {
    if (!uniqueId) {
      return undefined;
    }
    const r = [];
    const ids = uniqueId.split('.');
    for (let i = 0; i < ids.length; i++) {
      r.push(ids.slice(0, i + 1).join('.'));
    }
    return r.reverse();
  }

  /**
   * check if a given category has subcategories which are not loaded yet
   */
  static isCategoryCompletelyLoaded(category: Category): boolean {
    return (
      !!category &&
      (category.hasOnlineSubCategories === false || (!!category.subCategories && !!category.subCategories.length))
    );
  }
}
