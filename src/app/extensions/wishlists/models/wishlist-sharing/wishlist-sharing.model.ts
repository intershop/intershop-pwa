export interface WishlistSharing {
  recipients: string;
  message: string;
}

export interface WishlistSharingResponse {
  wishlistId: string;
  owner: string;
  secureCode: string;
}
