import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { ImageMapper } from 'ish-core/models/image/image.mapper';
import { Image } from 'ish-core/models/image/image.model';
import { Product } from 'ish-core/models/product/product.model';
import { getStaticEndpoint } from 'ish-core/store/core/configuration';

import { SparqueAttribute, SparqueImage, SparqueProduct } from './sparque.interface';

@Injectable({ providedIn: 'root' })
export class SparqueMapper {
  private icmStaticURL: string;

  constructor(private imageMapper: ImageMapper, private store: Store) {}

  private getICMStaticURL(): void {
    this.store.pipe(select(getStaticEndpoint)).subscribe(url => {
      this.icmStaticURL = url;
    });
  }

  mapProducts(products: SparqueProduct[]): Product[] {
    this.getICMStaticURL();
    return products
      ? products.map(product => ({
          name: product.name ? product.name : undefined,
          shortDescription: product.shortDescription ? product.shortDescription : undefined,
          longDescription: product.longDescription ? product.longDescription : undefined,
          available: true,
          manufacturer: product.manufacturer ? product.manufacturer : undefined,
          images: this.mapImages(product.images),
          attributes: this.mapAttributes(product.attributes),
          sku: product.sku ? product.sku : undefined,
          defaultCategoryId: product.defaultcategoryId ? product.defaultcategoryId : undefined,
          completenessLevel: 0,
          maxOrderQuantity: undefined,
          minOrderQuantity: undefined,
          stepQuantity: undefined,
          roundedAverageRating: undefined,
          numberOfReviews: undefined,
          readyForShipmentMin: undefined,
          readyForShipmentMax: undefined,
          packingUnit: undefined,
          type: undefined,
          promotionIds: undefined,
          failed: false,
        }))
      : undefined;
  }

  private mapImages(images: SparqueImage[]): Image[] {
    const urlOfPrimaryImage = this.getUrlOfPrimaryImage(images).startsWith('/')
      ? this.getUrlOfPrimaryImage(images)
      : `/${this.getUrlOfPrimaryImage(images)}`;

    return this.imageMapper.fromImageUrl(this.icmStaticURL.concat(urlOfPrimaryImage));
  }

  private getUrlOfPrimaryImage(images: SparqueImage[]): string {
    const noImageImageUrl = '/assets/img/not-available.svg';
    const primaryImage = images?.find(image => image.isPrimaryImage);
    return primaryImage ? primaryImage.id : noImageImageUrl;
  }

  mapAttributes(attributes: SparqueAttribute[]): Attribute[] {
    return attributes ? attributes.map(attribute => ({ name: attribute.name, value: attribute.value })) : [];
  }

  getStaticURL(): string {
    return this.icmStaticURL;
  }

  getImage(attributes: SparqueAttribute[], name: string): Image[] {
    const imageAttribute = attributes.find(attr => attr.name === 'image');
    return imageAttribute
      ? [
          {
            name,
            viewID: undefined,
            typeID: undefined,
            imageActualHeight: undefined,
            imageActualWidth: undefined,
            effectiveUrl: imageAttribute.value ? `${this.getStaticURL()}/${imageAttribute.value}` : undefined,
            type: undefined,
            primaryImage: true,
          },
        ]
      : [];
  }
}
