import { Category } from './category.model';

export enum CategoryCompletenessLevel {
  Max = 3,
}

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
      return;
    }
    const regEx = new RegExp(`\\${CategoryHelper.uniqueIdSeparator}`, 'g');
    return uniqueId.replace(regEx, '/');
  }

  /**
   * check if a given category has the maximum completeness level
   */
  static isCategoryCompletelyLoaded(category: Category): boolean {
    return !!category && category.completenessLevel >= CategoryCompletenessLevel.Max;
  }
}
