class Image {
  name: string;
  type: string;
  effectiveUrl: string;
  viewID: string;
  typeID: string;
  imageActualHeight: number;
  imageActualWidth: number;
  primaryImage: boolean;
}

class Image2 {
  name: string;
  type: string;
  effectiveUrl: string;
  viewID: string;
  typeID: string;
  imageActualHeight: number;
  imageActualWidth: number;
  primaryImage: boolean;
}

export class SubCategory {
  name: string;
  type: string;
  hasOnlineProducts: boolean;
  hasOnlineSubCategories: boolean;
  online: string;
  description: string;
  images: Image2[];
  id: string;
  uri: string;
}

export class SubcategoryModel {
  name: string;
  type: string;
  hasOnlineProducts: boolean;
  hasOnlineSubCategories: boolean;
  online: string;
  description: string;
  subCategoriesCount: number;
  images: Image[];
  id: string;
  subCategories: SubCategory[];
}
