import { Injectable } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Image } from 'ish-core/models/image/image.model';

import { SparqueImage } from './sparque-image.interface';

@Injectable({ providedIn: 'root' })
export class SparqueImageMapper {
  mapProductImages(images: SparqueImage[]): Image[] {
    return images ? images.map(image => this.mapImage(image)) : [];
  }

  mapCategoryImage(attributes: Attribute[]): Image[] {
    const imageUrl = AttributeHelper.getAttributeValueByAttributeName(attributes, 'image') as string;
    if (!imageUrl) {
      return [];
    }
    const typeID =
      imageUrl.split('/').length > 1 ? (imageUrl.split('/')[0].length > 1 ? 'S' : imageUrl.split('/')[0]) : 'S';
    const viewID = 'front';
    return [
      {
        effectiveUrl: imageUrl,
        viewID,
        typeID,
        type: 'Image',
        name: viewID.concat(' ').concat(typeID),
        imageActualHeight: typeID === 'S' ? 110 : 270,
        imageActualWidth: typeID === 'S' ? 110 : 270,
        primaryImage: true,
      },
    ];
  }

  private mapImage(image: SparqueImage): Image {
    const viewID = AttributeHelper.getAttributeValueByAttributeName(image.attributes, 'image-view') as string;
    const typeID = AttributeHelper.getAttributeValueByAttributeName(image.attributes, 'image-type') as string;
    return {
      effectiveUrl: image.id,
      primaryImage: image.isPrimaryImage,
      type: 'Image',
      typeID,
      viewID,
      name: viewID.concat(' ').concat(typeID),
      imageActualHeight: typeID === 'S' ? 110 : 270,
      imageActualWidth: typeID === 'S' ? 110 : 270,
    };
  }
}
