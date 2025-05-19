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
        products.push(this.fromData(product));
        productSkus.push(product.sku);
      });
    }

    return { productSkus, products };
  }

  fromListData(data: SparqueProduct[]): Partial<Product>[] {
    return data?.length ? data.map(product => this.fromData(product)) : [];
  }

  private fromData(data: SparqueProduct): Partial<Product> {
    return {
      sku: data.sku,
      name: data.name,
      shortDescription: data.shortDescription,
      manufacturer: data.defaultBrandName,
      available: true,
      type: 'Product',
      images: this.sparqueImageMapper.fromImages(data.images),
      // TODO: completenessLevel for product lists should be 2 (otherwise a product details call will be triggered)
      // the Sparque response is currently missing needed product data to omit the additional REST calls (rating, promotion, etc.)
      completenessLevel: 1,
    };
  }
}
