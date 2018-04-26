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
   * Expands a given uniqueId to the category path categories uniqueIds.
   *
   * Don't use this if you already have a {@link Category} with a categoryPath.
   * @example
   * 'A.B.C' -> ['A', 'A.B', 'A.B.C']
   */
  static getCategoryPathUniqueIds(uniqueId: string): string[] {
    if (!uniqueId) {
      return undefined;
    }
    const uniqueIds = [];
    const ids = uniqueId.split(CategoryHelper.uniqueIdSeparator);
    for (let i = 0; i < ids.length; i++) {
      uniqueIds.push(ids.slice(0, i + 1).join(CategoryHelper.uniqueIdSeparator));
    }
    return uniqueIds;
  }
}
