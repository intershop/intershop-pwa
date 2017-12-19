// NEEDS_WORK: DUMMY COMPONENT
import { Component, OnInit } from '@angular/core';
import { WishlistsService } from '../../../core/services/wishlists/wishlists.service';
import { WishlistItem } from '../../../models/wishlist-item.model';
import { Wishlist } from '../../../models/wishlist.model';

@Component({
  templateUrl: './wishlists-page.component.html'
})
export class WishlistsPageComponent implements OnInit {

  wishlist: WishlistItem[] = [];

  constructor(
    private wishlistsService: WishlistsService
  ) { }

  ngOnInit() {
    this.wishlistsService.subscribe(this.updateWishlist);
  }

  private updateWishlist = (wishlistData: Wishlist) => {
    this.wishlist = (wishlistData) ? wishlistData.items : [];
  }
}
