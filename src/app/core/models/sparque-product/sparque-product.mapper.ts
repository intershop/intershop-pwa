import { Injectable } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';
import { SparqueImageMapper } from 'ish-core/models/sparque-image/sparque-image.mapper';

import { SparqueProduct } from './sparque-product.interface';

@Injectable({ providedIn: 'root' })
export class SparqueProductMapper {
  constructor(private sparqueImageMapper: SparqueImageMapper) {}

  fromSuggestionsData(productsData: SparqueProduct[]): { productSkus: string[]; products: Partial<Product>[] } {
    const productSkus: string[] = [];
    const products: Partial<Product>[] = [];

    if (productsData?.length) {
      productsData.forEach(product => {
        products.push(this.fromListDataSingle(product));
        productSkus.push(product.sku);
      });
    }

    return { productSkus, products };
  }

  /**
   * Maps Sparque product data to PWA product format for list displays.
   *
   * @param data - Array of SparqueProduct data to map
   */
  fromListData(data: SparqueProduct[]): Partial<Product>[] {
    return data?.length ? data.map(product => this.fromListDataSingle(product)) : [];
  }

  private fromListDataSingle(data: SparqueProduct): Partial<Product> {
    return this.fromData(data, 2); // List level for search results
  }

  fromData(data: SparqueProduct, completenessLevel: number = 3): Partial<Product> {
    return {
      sku: data.sku,
      name: data.name,
      shortDescription: data.shortDescription,
      manufacturer: data.defaultBrandName,
      available: true,
      type: 'Product',
      images: this.sparqueImageMapper.fromImages(data.images),
      defaultCategoryId: data.defaultCategoryId,
      longDescription: data.longDescription || data.shortDescription,
      // TODO map quantity value in case sparque wrapper API provides it
      minOrderQuantity: 1,
      stepQuantity: 1,
      packingUnit: '',
      completenessLevel, // Dynamic level: 2 for lists, 3 for details
    };
  }
}
