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
 * ImageMapper.fromImages(images)
 */
@Injectable({ providedIn: 'root' })
export class ImageMapper {
  private icmBaseURL: string;

  constructor(store: Store) {
    store.pipe(select(getICMBaseURL)).subscribe(url => (this.icmBaseURL = url));
  }

  /**
   * Maps Images to Images.
   * @param images The source images.
   * @param icmBaseURL The prefix URL for building absolute URLs for each relative URL.
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
   * @param image The source image.
   * @param icmBaseURL The prefix URL for building absolute URLs for each relative URL.
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
   * @param url The relative or absolute image URL.
   * @param icmBaseURL The prefix URL for building absolute URLs for each relative URL.
   * @returns The URL.
   */
  private fromEffectiveUrl(url: string): string {
    if (!url) {
      return;
    }
    if (url.match('^(https?|file):') || !url.startsWith('/')) {
      return url;
    }
    return `${this.icmBaseURL}${url}`;
  }
}
