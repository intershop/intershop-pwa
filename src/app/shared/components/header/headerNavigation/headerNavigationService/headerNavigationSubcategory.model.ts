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

export class SubCategory {
  name: string;
  type: string;
  id: string;
  displayName: string;
  online: string;
  images: Image[];
  hasOnlineSubCategories: boolean;
  hasOnlineProducts: boolean;
  uri: string;
}

class Image2 {
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
  displayName: string;
  description: string;
  subCategories: SubCategory[];
  online: string;
  images: Image2[];
  subCategoriesCount: number;
  hasOnlineSubCategories: boolean;
  hasOnlineProducts: boolean;
}

export class HeaderNavigationSubcategoryModel {
  elements: Element[];
}
