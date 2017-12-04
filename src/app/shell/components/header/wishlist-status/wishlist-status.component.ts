import { Component, OnInit } from '@angular/core';
import { WishListService } from '../../../../core/services/wishlists/wishlists.service';
import { Wishlist } from '../../../../models/wishlist.model';

@Component({
  selector: 'is-wishlist-status',
  templateUrl: './wishlist-status.component.html'
})

export class WishListComponent implements OnInit {

  itemCount = 0;

  constructor(
    private wishListService: WishListService
  ) { }

  ngOnInit() {
    this.wishListService.subscribe((wishListData: Wishlist) => {
      this.itemCount = (wishListData) ? wishListData.itemsCount : 0;
    });
  }
}
