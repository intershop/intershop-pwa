import { Injectable } from '@angular/core';

import { Attachment } from 'ish-core/models/attachment/attachment.model';
import { Product } from 'ish-core/models/product/product.model';
import { SparqueImageMapper } from 'ish-core/models/sparque-image/sparque-image.mapper';

import { SparqueAttachment, SparqueProduct } from './sparque-product.interface';

@Injectable({ providedIn: 'root' })
export class SparqueProductMapper {
  constructor(private sparqueImageMapper: SparqueImageMapper) {}

  fromSuggestionsData(productsData: SparqueProduct[]): { productSkus: string[]; products: Partial<Product>[] } {
    const productSkus: string[] = [];
    const products: Partial<Product>[] = [];

    if (productsData?.length) {
      productsData.forEach(product => {
        products.push(this.fromSuggestion(product));
        productSkus.push(product.sku);
      });
    }

    return { productSkus, products };
  }

  fromSuggestion(data: SparqueProduct): Partial<Product> {
    return {
      sku: data.sku,
      name: data.name,
      shortDescription: data.shortDescription,
      available: true,
      type: 'Product',
      images: this.sparqueImageMapper.fromImages(data.images),
      completenessLevel: 2,
    };
  }

  mapProducts(products: SparqueProduct[]): Partial<Product>[] {
    return products
      ? products.map(product => ({
          name: product.name ? product.name : undefined,
          shortDescription: product.shortDescription ? product.shortDescription : undefined,
          longDescription: product.longDescription ? product.longDescription : undefined,
          available: true,
          manufacturer: product.manufacturer ? product.manufacturer : undefined,
          images: this.sparqueImageMapper.fromImages(product.images),
          attributes: product.attributes,
          attachments: product?.attachments ? this.mapAttachments(product.attachments) : undefined,
          sku: product.sku ? product.sku : undefined,
          defaultCategoryId: product.defaultcategoryId ? product.defaultcategoryId : undefined,
          completenessLevel: 0, // TODO: needs adaption, results in extra product rest calls
        }))
      : [];
  }

  private mapAttachments(attachments: SparqueAttachment[]): Attachment[] {
    return attachments.map(attachment => ({
      name: attachment.id,
      type: '',
      key: '',
      url: attachment.relativeUrl,
    }));
  }
}
