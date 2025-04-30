import { Injectable } from '@angular/core';

import { Attachment } from 'ish-core/models/attachment/attachment.model';
import { Product } from 'ish-core/models/product/product.model';
import { SparqueImageMapper } from 'ish-core/models/sparque-image/sparque-image.mapper';

import { SparqueAttachment, SparqueProduct } from './sparque-product.interface';

@Injectable({ providedIn: 'root' })
export class SparqueProductMapper {
  constructor(private sparqueImageMapper: SparqueImageMapper) {}

  mapProducts(products: SparqueProduct[]): Partial<Product>[] {
    return products
      ? products.map(product => ({
          name: product.name ? product.name : undefined,
          shortDescription: product.shortDescription ? product.shortDescription : undefined,
          longDescription: product.longDescription ? product.longDescription : undefined,
          available: true,
          manufacturer: product.manufacturer ? product.manufacturer : undefined,
          images: this.sparqueImageMapper.mapProductImages(product.images),
          attributes: product.attributes,
          attachments: product?.attachments ? this.mapAttachments(product.attachments) : undefined,
          sku: product.sku ? product.sku : undefined,
          defaultCategoryId: product.defaultcategoryId ? product.defaultcategoryId : undefined,
          completenessLevel: 0,
        }))
      : undefined;
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
