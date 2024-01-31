export interface WishlistSharing {
  name: string;
  recipients: string;
  message: string;
  sender: string;
}

export interface WishlistSharingResponse {
  wishlistId: string;
  owner: string;
  secureCode: string;
}
