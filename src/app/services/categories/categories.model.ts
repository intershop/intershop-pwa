export class Category {
  name: string;
  type: string;
  hasOnlineProducts: boolean;
  hasOnlineSubCategories: boolean;
  online: string;
  description: string;
  subCategoriesCount?: number;
  images?: Image[];
  id: string;
  subCategories?: Category[];
  uri: string;
}

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
