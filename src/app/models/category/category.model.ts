import { Image } from '../image.model';

export class Category {

  public type: string;
  public hasOnlineProducts: boolean;
  public hasOnlineSubCategories: boolean;
  public online: string;
  public description: string;
  public subCategoriesCount?: number;
  public images?: Image[];
  public subCategories?: Category[];
  public uri?: string;

  constructor(public id: string, public name: string) { }

  /**
   * Helper function to compare two categories
   * @param category2  The second category to be compared with the first.
   * @returns          True if the categories are equal, false if not.
   *                   'equal' means
   *                   - both categories are defined
   *                   - the id of the categories is the same
   */
  equals(category2: Category): boolean {
    return !!category2 && this.id === category2.id;
  }
}
