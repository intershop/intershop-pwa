import { Component, OnInit } from '@angular/core';
import { Wishlist } from '../../../../models/wishlist/wishlist.model';
import { WishlistsService } from '../../../services/wishlists/wishlists.service';

@Component({
  selector: 'ish-wishlist-status',
  templateUrl: './wishlist-status.component.html'
})

export class WishlistComponent implements OnInit {

  itemCount = 0;

  constructor(
    private wishlistsService: WishlistsService
  ) { }

  ngOnInit() {
    this.wishlistsService.subscribe((wishlistData: Wishlist) => {
      this.itemCount = (wishlistData) ? wishlistData.itemsCount : 0;
    });
  }
}
