import { Injectable } from '@angular/core';

import { DotCmsImageData } from './dot-cms-image.interface';
import { DotCmsImage } from './dot-cms-image.model';

@Injectable({ providedIn: 'root' })
export class DotCmsImageMapper {
  fromData(dotCmsImageData: DotCmsImageData): DotCmsImage {
    if (dotCmsImageData) {
      return {
        title: dotCmsImageData.title,
        asset: dotCmsImageData.asset,
      };
    } else {
      throw new Error(`dotCmsImageData is required`);
    }
  }
}
