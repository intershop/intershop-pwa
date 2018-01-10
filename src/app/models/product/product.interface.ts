import { AttributeData } from '../attribute/attribute.interface';
import { ImageData } from '../image/image.interface';
import { Price } from '../price.model';
import { ShippingMethod } from '../shipping-method.model';

export interface ProductData {
  name: string;
  type: string;
  attributes: AttributeData[];
  shortDescription: string;
  minOrderQuantity: number;
  longDescription: string;
  productMaster: boolean;
  listPrice: Price;
  productBundle: boolean;
  shippingMethods: ShippingMethod[];
  availableWarranties: WarrantyData[];
  productName: string;
  roundedAverageRating: string;
  readyForShipmentMin: number;
  readyForShipmentMax: number;
  salePrice: Price;
  sku: string;
  images: ImageData[];
  manufacturer: string;
  availability: boolean;
  retailSet: boolean;
  inStock: boolean;
  mastered: boolean;
  variationAttributes ?: AttributeData[];
  enableExpressShop: boolean;
  richSnippetsEnabled: boolean;
  showProductRating: boolean;
  showAddToCart: boolean;
  totalRatingCount: number;
  simpleRatingView: boolean;
  averagRating: number;
  isRetailSet: boolean;
  displayType: string;
  applicablePromotions: any[];
  nameOverride: string;
  isEndOfLife: boolean;
  id: string;
  averageRatingClass: string;
  isProductMaster: boolean;
}

interface WarrantyData {
  type: string;
  description: string;
  title: string;
  uri: string;
  attributes: AttributeData[];
}
