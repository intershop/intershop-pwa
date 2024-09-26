import { Attribute } from 'ish-core/models/attribute/attribute.model';

import { WishlistHeader } from './wishlist.model';

export interface WishlistData extends WishlistHeader {
  items?: { attributes: Attribute[] }[];
  itemsCount?: number;
  public?: boolean;
  shared?: boolean;
  name?: string;
  uri?: string;
}
