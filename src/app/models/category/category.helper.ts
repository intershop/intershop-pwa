import { Category } from './category.model';

export class CategoryHelper {
  /**
   * @returns          True if the categories are equal, false if not.
   *                   'equal' means
   *                   - both categories are defined
   *                   - the id of the categories is the same
   */
  static equals(self: Category, category: Category): boolean {
    return !!self && !!category && self.uniqueId === category.uniqueId;
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
}
