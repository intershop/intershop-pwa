import { CategoryData } from './category.interface';
import { Category } from './category.model';

export enum CategoryCompletenessLevel {
  Max = 3,
}

export class CategoryHelper {
  static uniqueIdSeparator = '.';

  /**
   * Converts a given uniqueId of a category in a REST API category path.
   *
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
   * Extracts the category ID from a unique identifier by returning the last element after splitting.
   *
   * @param uniqueId - The unique identifier string to process (e.g., 'A.B.C')
   * @returns The last element of the split string (e.g., 'C' from 'A.B.C')
   *
   * @example
   * 'A.B.C' -> 'C'
   * 'computers.tablets' -> 'tablets'
   */
  static getCategoryID(uniqueId: string): string {
    if (!uniqueId) {
      return;
    }
    const parts = uniqueId.split(CategoryHelper.uniqueIdSeparator);
    return parts[parts.length - 1];
  }

  /**
   * check if a given category has the maximum completeness level
   */
  static isCategoryCompletelyLoaded(category: Category): boolean {
    return !!category && category.completenessLevel >= CategoryCompletenessLevel.Max;
  }

  /**
   * Compute completeness level of incoming raw data.
   * Supports CategoryData, and Category objects.
   */
  // eslint-disable-next-line complexity
  static computeCompleteness(data: CategoryData | Category): number {
    if (!data) {
      return -1;
    }

    let count = 0;

    if (data.categoryRef) {
      // category path categories do not contain a categoryRef
      count++;
    }
    if (data.categoryPath && data.categoryPath.length === 1) {
      // root categories have no images but a single-entry categoryPath
      count++;
    }
    if (data.images) {
      // images are supplied for sub categories in the category details call
      count++;
    }
    if (data.seoAttributes) {
      // seo attributes are only supplied with the category details call
      count++;
    }

    return count;
  }
}
