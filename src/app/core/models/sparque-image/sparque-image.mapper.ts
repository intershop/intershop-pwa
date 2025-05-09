import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Image } from 'ish-core/models/image/image.model';
import { getStaticEndpoint } from 'ish-core/store/core/configuration';

import { SparqueImage } from './sparque-image.interface';

@Injectable({ providedIn: 'root' })
export class SparqueImageMapper {
  private staticURL: string;

  constructor(store: Store) {
    store.pipe(select(getStaticEndpoint)).subscribe(staticURL => (this.staticURL = staticURL));
  }

  fromImageUrl(imageUrl: string): Image {
    if (!imageUrl) {
      return;
    }
    const typeID =
      imageUrl.split('/').length > 1 ? (imageUrl.split('/')[0].length > 1 ? 'S' : imageUrl.split('/')[0]) : 'S';
    const viewID = 'front';
    return {
      effectiveUrl: `${this.staticURL}/${imageUrl}`,
      viewID,
      typeID,
      type: 'Image',
      name: `${viewID} ${typeID}`,
      imageActualHeight: typeID === 'S' ? 110 : 270,
      imageActualWidth: typeID === 'S' ? 110 : 270,
      primaryImage: true,
    };
  }

  mapProductImages(images: SparqueImage[]): Image[] {
    return images ? images.map(image => this.mapImage(image)) : [];
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
      name: `${viewID} ${typeID}`,
      imageActualHeight: typeID === 'S' ? 110 : 270,
      imageActualWidth: typeID === 'S' ? 110 : 270,
    };
  }
}
