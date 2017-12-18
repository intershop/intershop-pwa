// NEEDS_WORK: DUMMY COMPONENT
import { Component, OnInit } from '@angular/core';
import { WishListService } from '../../../core/services/wishlists/wishlists.service';
import { WishlistItem } from '../../../models/wishlist-item.model';
import { Wishlist } from '../../../models/wishlist.model';

@Component({
  templateUrl: './wishlists-page.component.html'
})
export class WishlistsPageComponent implements OnInit {

  wishList: WishlistItem[] = [];

  constructor(
    private wishListService: WishListService
  ) { }

  ngOnInit() {
    this.wishListService.subscribe(this.updateWishlist);
  }

  private updateWishlist = (wishlistData: Wishlist) => {
    this.wishList = (wishlistData) ? wishlistData.items : [];
  }
}
