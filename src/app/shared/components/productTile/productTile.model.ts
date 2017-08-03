class Attribute {
    name: string;
    type: string;
    value: any;
}

class ListPrice {
    type: string;
    value: number;
    currencyMnemonic: string;
    range: any;
}

class ShippingMethod {
    name: string;
    type: string;
    id: string;
    shippingTimeMin: number;
    shippingTimeMax: number;
}

class Value {
    type: string;
    value: number;
    currencyMnemonic: string;
}

class Attribute2 {
    name: string;
    type: string;
    value: Value;
}

class AvailableWarranty {
    type: string;
    description: string;
    title: string;
    uri: string;
    attributes: Attribute2[];
}

class SalePrice {
    type: string;
    value: number;
    currencyMnemonic: string;
    scaledPrices: any[];
}

class Image {
    name: string;
    type: string;
    imageActualHeight: number;
    imageActualWidth: number;
    viewID: string;
    effectiveUrl: string;
    typeID: string;
    primaryImage: boolean;
}

export class ProductTileModel {
    name: string;
    type: string;
    attributes: Attribute[];
    shortDescription: string;
    minOrderQuantity: number;
    longDescription: string;
    productMaster: boolean;
    listPrice: ListPrice;
    productBundle: boolean;
    shippingMethods: ShippingMethod[];
    availableWarranties: AvailableWarranty[];
    productName: string;
    roundedAverageRating: string;
    readyForShipmentMin: number;
    readyForShipmentMax: number;
    salePrice: SalePrice;
    sku: string;
    images: Image[];
    manufacturer: string;
    availability: boolean;
    retailSet: boolean;
    inStock: boolean;
    mastered: boolean;

    enableExpressShop: boolean;
    richSnippetsEnabled: boolean;
    ShowProductRating: boolean;
    showAddToCart: boolean;
    totalRatingCount: number;
    simpleRatingView: boolean;
    averagRating: number;
    isRetailSet: boolean;
    displayType: string;
    applicablePromotions: any[];
    name_override: string;
    mockListView: any;
    showInformationalPrice: boolean;
    isEndOfLife: boolean;
    id: string;
    averageRatingClass: string;
    isProductMaster: boolean;
}
