import { Component } from '@angular/core';
import { WishListItem, WishListModel } from '../../services/wishlists/wishlists.model';
import { WishListService } from '../../services/wishlists/wishlists.service';

@Component({
  templateUrl: './wishlists-page.component.html'
})
export class WishListPageComponent {

  wishList: WishListItem[] = [];

  constructor(wishListService: WishListService) {
    wishListService.subscribe(this.updateWishList);
  }

  private updateWishList = (wishListData: WishListModel) => {
    this.wishList = (wishListData) ? wishListData.items : [];
  }
}
