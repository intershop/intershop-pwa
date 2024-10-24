import { Injectable } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';

import { WishlistData } from './wishlist.interface';
import { Wishlist, WishlistItem } from './wishlist.model';

@Injectable({ providedIn: 'root' })
export class WishlistMapper {
  private static parseIdFromURI(uri: string): string {
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
      if (wishlistData.items?.length) {
        items = wishlistData.items.map(item => ({
          sku: AttributeHelper.getAttributeValueByAttributeName(item.attributes, 'sku'),
          id: AttributeHelper.getAttributeValueByAttributeName(item.attributes, 'id'),
          creationDate: Number(AttributeHelper.getAttributeValueByAttributeName(item.attributes, 'creationDate')),
          desiredQuantity: {
            value: AttributeHelper.getAttributeValueByAttributeName<Attribute<number>>(
              item.attributes,
              'desiredQuantity'
            ).value,
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
        shared: wishlistData.shared,
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
  fromDataToId(wishlistData: WishlistData): string {
    return wishlistData ? WishlistMapper.parseIdFromURI(wishlistData.uri) : undefined;
  }
}
