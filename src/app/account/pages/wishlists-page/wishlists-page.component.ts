import { Component, OnInit } from '@angular/core';
import { WishListService } from '../../../core/services/wishlists/wishlists.service';
import { WishlistItem } from '../../../models/wishlist-item.model';
import { Wishlist } from '../../../models/wishlist.model';

@Component({
  templateUrl: './wishlists-page.component.html'
})
export class WishListPageComponent implements OnInit {

  wishList: WishlistItem[] = [];

  constructor(
    private wishListService: WishListService
  ) { }

  ngOnInit() {
    this.wishListService.subscribe(this.updateWishList);
  }

  private updateWishList = (wishListData: Wishlist) => {
    this.wishList = (wishListData) ? wishListData.items : [];
  }
}
