import { WishlistItemData } from '../wishlist-item/wishlist-item.interface';

export interface WishlistData {
  type: string;
  preferred: boolean;
  items: WishlistItemData[];
  itemsCount: number;
  title: string;
  creationDate: number;
  public: boolean;

}
