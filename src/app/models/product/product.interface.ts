import { AttributeData } from '../attribute/attribute.interface';
import { ImageData } from '../image/image.interface';
import { PriceData } from '../price/price.interface';

export interface ProductData {

  sku: string;
  productName: string;
  shortDescription: string;
  longDescription: string;

  availability: boolean;
  averageRating: string;
  roundedAverageRating: string;

  images: ImageData[];

  availableWarranties?: WarrantyData[];
  availableGiftWraps?: any[];
  availableGiftMessages?: any[];
  bundles: any[];
  retailSet: boolean;

  inStock: boolean;

  // If warranty {
  price?: PriceData;
  currency?: any;
  // }


  productMasterSKU?: string;
  minOrderQuantity: number;
  // If Variation Master and Retail Set {
  minListPrice?: number;
  maxListPrice?: number;
  minSalePrice?: number;
  maxSalePrice?: number;
  // }
  variationAttributeValues?: AttributeData[];
  variableVariationAttributes?: AttributeData[];
  partOfRetailSet: boolean;
  // If  Retail Set {
  summedUpListPrice?: number;
  summedUpSalePrice?: number;
  // }

  attachments?: any;
  variations?: any;
  crosssells?: any;
  productMaster: boolean;
  listPrice: PriceData;
  productBundle: boolean;
  salePrice: PriceData;
  manufacturer: string;
  mastered: boolean;

}

interface WarrantyData {
  type: string;
  description: string;
  title: string;
  uri: string;
  attributes: AttributeData[];
}
