import { WishlistItem } from './wishlist-item.model';

export class Wishlist {
  type: string;
  preferred: boolean;
  items: WishlistItem[];
  itemsCount: number;
  title: string;
  creationDate: number;
  public: boolean;
}
