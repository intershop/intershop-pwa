import { Attribute } from 'ish-core/models/attribute/attribute.model';

import { WishlistHeader } from './wishlist.model';

export interface WishlistData extends WishlistHeader {
  items?: { attributes: Attribute[] }[];
  itemsCount?: number;
  name?: string;
  uri?: string;
}
