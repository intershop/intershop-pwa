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

}
