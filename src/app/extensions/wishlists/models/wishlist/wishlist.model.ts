export interface WishlistHeader {
  preferred: boolean;
  title: string;
}

export interface Wishlist extends WishlistHeader {
  id: string;
  items?: WishlistItem[];
  itemsCount?: number;
  public?: boolean;
}

export interface WishlistItem {
  sku: string;
  id: string;
  creationDate: number;
  desiredQuantity: {
    value: number;
    unit?: string;
  };
  purchasedQuantity?: {
    value: number;
    unit: string;
  };
}
