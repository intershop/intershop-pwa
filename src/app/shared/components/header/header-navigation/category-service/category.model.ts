import {SubcategoryModel, SubCategory} from './subcategory.model';

class Image {
  name: string;
  type: string;
  imageActualHeight: number;
  imageActualWidth: number;
  effectiveUrl: string;
  typeID: string;
  primaryImage: boolean;
  viewID: string;
}

class Element {
  name: string;
  type: string;
  id: string;
  description: string;
  online: string;
  images: Image[];
  hasOnlineSubCategories: boolean;
  hasOnlineProducts: boolean;
  uri: string;
  subCategories: SubCategory[];
}

export class CategoryModel {
  elements: Element[];
  type: string;
}
