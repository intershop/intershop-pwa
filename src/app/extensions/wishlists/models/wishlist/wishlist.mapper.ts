import { Injectable } from '@angular/core';

import { WishlistData } from './wishlist.interface';
import { Wishlist, WishlistItem } from './wishlist.model';

@Injectable({ providedIn: 'root' })
export class WishlistMapper {
  private static parseIDfromURI(uri: string): string {
    const match = /wishlists[^\/]*\/([^\?]*)/.exec(uri);
    if (match) {
      return match[1];
    } else {
      console.warn(`could not find id in uri '${uri}'`);
      return;
    }
  }
  fromData(wishlistData: WishlistData, wishlistId: string): Wishlist {
    if (wishlistData) {
      let items: WishlistItem[];
      if (wishlistData.items && wishlistData.items.length) {
        // create items object from attribute array
        const arrayToObject = attributes =>
          attributes.reduce((obj, attr) => {
            obj[attr.name] = attr.value;
            return obj;
          }, {});
        items = wishlistData.items
          .map(item => arrayToObject(item.attributes))
          .map(item => ({
            sku: item.sku,
            id: item.id,
            creationDate: Number(item.creationDate),
            desiredQuantity: {
              value: item.desiredQuantity.value,
              // TBD: is the unit necessary?
              // unit: item.desiredQuantity.unit,
            },
          }));
      } else {
        items = [];
      }
      return {
        id: wishlistId,
        title: wishlistData.title,
        itemsCount: wishlistData.itemsCount || 0,
        preferred: wishlistData.preferred,
        public: wishlistData.public,
        items,
      };
    } else {
      throw new Error(`wishlistData is required`);
    }
  }

  fromUpdate(wishlist: Wishlist, id: string): Wishlist {
    if (wishlist && id) {
      return {
        id,
        title: wishlist.title,
        preferred: wishlist.preferred,
        public: wishlist.public,
      };
    }
  }

  /**
   * extract ID from URI
   */
  fromDataToIds(wishlistData: WishlistData): Wishlist {
    if (wishlistData) {
      return {
        id: WishlistMapper.parseIDfromURI(wishlistData.uri),
        title: wishlistData.title,
        preferred: wishlistData.preferred,
      };
    }
  }
}
