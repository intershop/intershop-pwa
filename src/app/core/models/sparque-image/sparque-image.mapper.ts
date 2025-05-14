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
      imageActualHeight: this.mapImageSize(typeID),
      imageActualWidth: this.mapImageSize(typeID),
      primaryImage: true,
    };
  }

  fromImages(images: SparqueImage[]): Image[] {
    return images?.length ? images.map(image => this.fromImage(image)) : [];
  }

  private fromImage(image: SparqueImage): Image {
    const viewID = AttributeHelper.getAttributeValueByAttributeName<string>(image.attributes, 'image-view');
    const typeID = AttributeHelper.getAttributeValueByAttributeName<string>(image.attributes, 'image-type');
    return {
      effectiveUrl: `${this.staticURL}/${image.id}`,
      typeID,
      viewID,
      type: 'Image',
      name: `${viewID} ${typeID}`,
      imageActualHeight: this.mapImageSize(typeID),
      imageActualWidth: this.mapImageSize(typeID),
      primaryImage: viewID === 'front',
    };
  }

  private mapImageSize(typeID: string): number {
    switch (typeID) {
      case 'S':
        return 110;
      case 'M':
        return 270;
      case 'L':
        return 500;
      case 'ZOOM':
        return 1500;
      default:
        return 270;
    }
  }
}
