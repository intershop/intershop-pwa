import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getICMBaseURL } from 'ish-core/store/core/configuration';

import { Image } from './image.model';

/**
 * ImageMappers maps and adjusts meta-data of Images or its properties, i.e.
 * the absolute path of Image property effectiveUrl.
 *
 * @example
 * ImageMapper.fromImages(images)
 * ImageMapper.fromImage(image)
 */
@Injectable({ providedIn: 'root' })
export class ImageMapper {
  private icmBaseURL: string;

  constructor(store: Store) {
    store.pipe(select(getICMBaseURL)).subscribe(url => (this.icmBaseURL = url));
  }

  /**
   * Maps Images to Images.
   *
   * @param images The source images.
   * @returns The images.
   */
  fromImages(images: Image[]): Image[] {
    if (!images || images.length === 0) {
      return;
    }
    return images.map(image => this.fromImage(image));
  }

  /**
   * Maps Image to Image.
   *
   * @param image The source image.
   * @returns The image.
   */
  private fromImage(image: Image): Image {
    return {
      ...image,
      effectiveUrl: this.fromEffectiveUrl(image.effectiveUrl),
    };
  }

  /**
   * Builds absolute URL from relative URL and icmBaseURL or returns absolute URL.
   *
   * @param url The relative or absolute image URL.
   * @returns The URL.
   */
  fromEffectiveUrl(url: string): string {
    if (!url) {
      return;
    }
    if (url.match('^(https?|file):') || !url.startsWith('/')) {
      return url;
    }
    return `${this.icmBaseURL}${url}`;
  }

  /**
   * Maps a single product image URL to a minimum product images array.
   *
   * @param url The image URL.
   * @returns The minimum images (M and S image).
   */
  fromImageUrl(url: string): Image[] {
    if (!url) {
      return;
    }
    return [
      {
        effectiveUrl: this.fromEffectiveUrl(url),
        name: 'front M',
        primaryImage: true,
        type: 'Image',
        typeID: 'M',
        viewID: 'front',
        imageActualHeight: 270,
        imageActualWidth: 270,
      },
      {
        effectiveUrl: this.fromEffectiveUrl(url),
        name: 'front S',
        primaryImage: true,
        type: 'Image',
        typeID: 'S',
        viewID: 'front',
        imageActualHeight: 110,
        imageActualWidth: 110,
      },
    ];
  }
}
